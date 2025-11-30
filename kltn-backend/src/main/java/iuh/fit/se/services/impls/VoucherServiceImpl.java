package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.CreateVoucherRequest;
import iuh.fit.se.dtos.requests.UpdateVoucherRequest;
import iuh.fit.se.dtos.responses.VoucherResponse;
import iuh.fit.se.entities.User;
import iuh.fit.se.entities.UserVoucher;
import iuh.fit.se.entities.Voucher;
import iuh.fit.se.enums.DiscountType;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.VoucherMapper;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.repositories.UserVoucherRepository;
import iuh.fit.se.repositories.VoucherRepository;
import iuh.fit.se.services.interfaces.IVoucherService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VoucherServiceImpl implements IVoucherService {

  VoucherRepository voucherRepository;
  UserVoucherRepository userVoucherRepository;
  UserRepository userRepository;
  VoucherMapper voucherMapper;

  @Override
  public VoucherApplyResult validateAndCalculate(Long userId, String code, BigDecimal orderTotal) {
    if (code == null || code.trim().isEmpty()) {
      throw new AppException(ErrorCode.INVALID_INPUT, "Voucher code is required");
    }
    if (orderTotal == null || orderTotal.compareTo(BigDecimal.ZERO) <= 0) {
      throw new AppException(ErrorCode.INVALID_INPUT, "Order total must be positive");
    }
    Voucher voucher =
        voucherRepository
            .findByCodeIgnoreCaseAndActiveIsTrue(code.trim())
            .orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_FOUND));

    LocalDateTime now = LocalDateTime.now();
    if (voucher.getStartDate() != null && now.isBefore(voucher.getStartDate())) {
      throw new AppException(ErrorCode.DISCOUNT_NOT_ACTIVE);
    }
    if (voucher.getEndDate() != null && now.isAfter(voucher.getEndDate())) {
      throw new AppException(ErrorCode.DISCOUNT_EXPIRED);
    }
    if (Boolean.FALSE.equals(voucher.getActive())) {
      throw new AppException(ErrorCode.DISCOUNT_NOT_ACTIVE);
    }
    if (voucher.getMinValueOrder() != null
        && orderTotal.compareTo(voucher.getMinValueOrder()) < 0) {
      throw new AppException(
          ErrorCode.INVALID_INPUT, "Order total does not meet minimum amount for voucher");
    }
    // Total usage limit
    if (voucher.getUsageLimit() != null) {
      Integer totalUsed = voucherRepository.sumTotalUsage(voucher.getId());
      if (totalUsed != null && totalUsed >= voucher.getUsageLimit()) {
        throw new AppException(ErrorCode.DISCOUNT_USAGE_LIMIT_EXCEEDED);
      }
    }
    // Per-user usage limit
    if (userId != null && voucher.getUsagePerUser() != null) {
      Integer usedByUser =
          userVoucherRepository.sumUsageCountByUserAndVoucher(userId, voucher.getId());

      if (usedByUser != null && usedByUser >= voucher.getUsagePerUser()) {
        throw new AppException(ErrorCode.DISCOUNT_USAGE_LIMIT_EXCEEDED);
      }
    }

    BigDecimal discount = calculateDiscount(orderTotal, voucher);
    if (discount.compareTo(BigDecimal.ZERO) <= 0) {
      throw new AppException(ErrorCode.INVALID_INPUT, "Calculated discount is not positive");
    }
    if (discount.compareTo(orderTotal) > 0) {
      discount = orderTotal;
    }
    return new VoucherApplyResult(voucher, discount.setScale(2, RoundingMode.HALF_UP));
  }

  private BigDecimal calculateDiscount(BigDecimal orderTotal, Voucher voucher) {
    DiscountType type = voucher.getDiscountType();
    BigDecimal value = voucher.getDiscountValue();
    if (type == null || value == null) {
      throw new AppException(ErrorCode.DISCOUNT_INVALID_VALUE);
    }
    BigDecimal discount;
    if (type == DiscountType.PERCENT) {
      discount =
          orderTotal.multiply(value).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
      if (voucher.getMaxDiscountValue() != null
          && discount.compareTo(voucher.getMaxDiscountValue()) > 0) {
        discount = voucher.getMaxDiscountValue();
      }
    } else { // FIXED
      discount = value;
    }
    return discount;
  }

  @Override
  @Transactional
  public void recordUsage(Long userId, Long voucherId) {
    if (userId == null || voucherId == null) return;
    UserVoucher uv =
        userVoucherRepository
            .findByUser_IdAndVoucher_Id(userId, voucherId)
            .orElseGet(
                () ->
                    UserVoucher.builder()
                        .voucher(Voucher.builder().id(voucherId).build())
                        .user(iuh.fit.se.entities.User.builder().id(userId).build())
                        .usageCount(0)
                        .build());
    uv.setUsageCount(uv.getUsageCount() + 1);
    userVoucherRepository.save(uv);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<VoucherResponse> getAllVouchersForUser(
      Long userId, String keyword, int page, int size) {
    if (userId == null) {
      throw new AppException(ErrorCode.INVALID_INPUT, "User ID is required");
    }

    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));
    Page<Voucher> voucherPage =
        voucherRepository.findAllAvailableForUser(userId, keyword, pageable);

    return voucherPage.map(voucherMapper::toVoucherResponse);
  }

  @Override
  @Transactional(readOnly = true)
  public List<VoucherResponse> getSuitableVouchersListForOrderAmount(
      Long userId, BigDecimal orderAmount) {
    if (userId == null) {
      throw new AppException(ErrorCode.INVALID_INPUT, "User ID is required");
    }
    if (orderAmount == null || orderAmount.compareTo(BigDecimal.ZERO) <= 0) {
      throw new AppException(ErrorCode.INVALID_INPUT, "Order amount must be positive");
    }

    List<Voucher> vouchers =
        voucherRepository.findSuitableVouchersListForOrderAmount(userId, orderAmount);

    return vouchers.stream().map(voucherMapper::toVoucherResponse).collect(Collectors.toList());
  }

  @Override
  @Transactional
  public VoucherResponse createVoucher(CreateVoucherRequest request) {
    // Validate voucher code uniqueness
    if (voucherRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new AppException(ErrorCode.VOUCHER_ALREADY_EXISTS);
    }

    // Validate date range
    if (request.getStartDate() != null
        && request.getEndDate() != null
        && request.getEndDate().isBefore(request.getStartDate())) {
      throw new AppException(ErrorCode.VOUCHER_INVALID_DATE_RANGE);
    }

    // Parse discount type
    DiscountType discountType;
    try {
      discountType = DiscountType.valueOf(request.getDiscountType().toUpperCase());
    } catch (IllegalArgumentException e) {
      throw new AppException(ErrorCode.INVALID_INPUT, "Invalid discount type");
    }

    // Validate discount value based on discount type
    validateDiscountValue(discountType, request.getDiscountValue());

    // Create voucher entity
    Voucher voucher =
        Voucher.builder()
            .code(request.getCode().toUpperCase())
            .description(request.getDescription())
            .discountType(discountType)
            .discountValue(request.getDiscountValue())
            .minValueOrder(request.getMinimumOrderAmount())
            .maxDiscountValue(request.getMaximumDiscountAmount())
            .usageLimit(request.getUsageLimit())
            .usagePerUser(request.getUsageLimitPerUser())
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .active(true)
            .build();

    voucher = voucherRepository.save(voucher);

    // Create UserVoucher entries for eligible users
    if (request.getEligibleUserIds() != null && !request.getEligibleUserIds().isEmpty()) {
      for (Long userId : request.getEligibleUserIds()) {
        User user =
            userRepository
                .findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserVoucher userVoucher =
            UserVoucher.builder()
                .user(user)
                .voucher(voucher)
                .usageCount(0)
                .acquiredAt(LocalDateTime.now())
                .build();

        userVoucherRepository.save(userVoucher);
      }
    }

    return voucherMapper.toVoucherResponse(voucher);
  }

  @Override
  @Transactional
  public VoucherResponse updateVoucher(Long id, UpdateVoucherRequest request) {
    Voucher voucher =
        voucherRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

    // Validate voucher code uniqueness if changed
    if (request.getCode() != null
        && !request.getCode().equalsIgnoreCase(voucher.getCode())
        && voucherRepository.existsByCodeIgnoreCase(request.getCode())) {
      throw new AppException(ErrorCode.VOUCHER_ALREADY_EXISTS);
    }

    // Validate date range if both dates are provided
    LocalDateTime startDate =
        request.getStartDate() != null ? request.getStartDate() : voucher.getStartDate();
    LocalDateTime endDate =
        request.getEndDate() != null ? request.getEndDate() : voucher.getEndDate();

    if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
      throw new AppException(ErrorCode.VOUCHER_INVALID_DATE_RANGE);
    }

    // Update fields if provided
    if (request.getCode() != null) {
      voucher.setCode(request.getCode().toUpperCase());
    }
    if (request.getDescription() != null) {
      voucher.setDescription(request.getDescription());
    }
    if (request.getDiscountType() != null) {
      try {
        voucher.setDiscountType(DiscountType.valueOf(request.getDiscountType().toUpperCase()));
      } catch (IllegalArgumentException e) {
        throw new AppException(ErrorCode.INVALID_INPUT, "Invalid discount type");
      }
    }
    if (request.getDiscountValue() != null) {
      voucher.setDiscountValue(request.getDiscountValue());
    }

    // Validate discount value after updating type and/or value
    if (request.getDiscountType() != null || request.getDiscountValue() != null) {
      validateDiscountValue(voucher.getDiscountType(), voucher.getDiscountValue());
    }

    if (request.getMinimumOrderAmount() != null) {
      voucher.setMinValueOrder(request.getMinimumOrderAmount());
    }
    if (request.getMaximumDiscountAmount() != null) {
      voucher.setMaxDiscountValue(request.getMaximumDiscountAmount());
    }
    if (request.getUsageLimit() != null) {
      voucher.setUsageLimit(request.getUsageLimit());
    }
    if (request.getUsageLimitPerUser() != null) {
      voucher.setUsagePerUser(request.getUsageLimitPerUser());
    }
    if (request.getStartDate() != null) {
      voucher.setStartDate(request.getStartDate());
    }
    if (request.getEndDate() != null) {
      voucher.setEndDate(request.getEndDate());
    }
    if (request.getActive() != null) {
      voucher.setActive(request.getActive());
    }

    voucher = voucherRepository.save(voucher);

    // Update UserVoucher entries if eligible users are specified
    if (request.getEligibleUserIds() != null) {
      // Remove existing user vouchers for this voucher that are not in the new list
      List<UserVoucher> existingUserVouchers =
          userVoucherRepository.findAll().stream()
              .filter(uv -> uv.getVoucher().getId().equals(id))
              .collect(Collectors.toList());

      for (UserVoucher uv : existingUserVouchers) {
        if (!request.getEligibleUserIds().contains(uv.getUser().getId())) {
          // Only delete if usage count is 0
          if (uv.getUsageCount() == 0) {
            userVoucherRepository.delete(uv);
          }
        }
      }

      // Add new user vouchers
      for (Long userId : request.getEligibleUserIds()) {
        boolean exists =
            existingUserVouchers.stream().anyMatch(uv -> uv.getUser().getId().equals(userId));

        if (!exists) {
          User user =
              userRepository
                  .findById(userId)
                  .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

          UserVoucher userVoucher =
              UserVoucher.builder()
                  .user(user)
                  .voucher(voucher)
                  .usageCount(0)
                  .acquiredAt(LocalDateTime.now())
                  .build();

          userVoucherRepository.save(userVoucher);
        }
      }
    }

    return voucherMapper.toVoucherResponse(voucher);
  }

  @Override
  @Transactional
  public void deleteVoucher(Long id) {
    Voucher voucher =
        voucherRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

    // Check if voucher has been used
    Integer totalUsage = voucherRepository.sumTotalUsage(id);
    if (totalUsage != null && totalUsage > 0) {
      throw new AppException(ErrorCode.VOUCHER_IN_USE);
    }

    // Delete all associated UserVoucher records first
    List<UserVoucher> userVouchers =
        userVoucherRepository.findAll().stream()
            .filter(uv -> uv.getVoucher().getId().equals(id))
            .collect(Collectors.toList());

    userVoucherRepository.deleteAll(userVouchers);

    // Delete the voucher
    voucherRepository.delete(voucher);
  }

  @Override
  @Transactional(readOnly = true)
  public VoucherResponse getVoucherById(Long id) {
    Voucher voucher =
        voucherRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

    return voucherMapper.toVoucherResponse(voucher);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<VoucherResponse> getAllVouchers(
      String keyword, String discountType, int page, int size, String sortBy, String sortDir) {
    Sort.Direction direction =
        sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

    // Parse discountType string to enum
    DiscountType discountTypeEnum = null;
    if (discountType != null && !discountType.trim().isEmpty()) {
      try {
        discountTypeEnum = DiscountType.valueOf(discountType.toUpperCase());
      } catch (IllegalArgumentException e) {
        throw new AppException(ErrorCode.INVALID_INPUT, "Invalid discount type: " + discountType);
      }
    }

    Page<Voucher> voucherPage =
        voucherRepository.findAllWithKeyword(keyword, discountTypeEnum, pageable);

    return voucherPage.map(voucherMapper::toVoucherResponse);
  }

  /**
   * Validate discount value based on discount type PERCENT: must be between 0.01 and 100 FIXED:
   * must be greater than 0 (no upper limit)
   */
  private void validateDiscountValue(DiscountType discountType, BigDecimal discountValue) {
    if (discountValue == null) {
      return; // Will be caught by @NotNull validation
    }

    if (discountType == DiscountType.PERCENT) {
      // For percentage: must be between 0.01 and 100
      if (discountValue.compareTo(new BigDecimal("0.01")) < 0
          || discountValue.compareTo(new BigDecimal("100")) > 0) {
        throw new AppException(ErrorCode.VOUCHER_INVALID_DISCOUNT_VALUE);
      }
    } else if (discountType == DiscountType.FIXED) {
      // For fixed amount: must be greater than 0 (no upper limit)
      if (discountValue.compareTo(BigDecimal.ZERO) <= 0) {
        throw new AppException(ErrorCode.VOUCHER_INVALID_DISCOUNT_VALUE);
      }
    }
  }

  @Override
  @Transactional(readOnly = true)
  public Long getTotalValidVouchersCountByUser(Long userId) {
    if (userId == null) {
      throw new AppException(ErrorCode.INVALID_INPUT, "User ID is required");
    }

    // Verify user exists
    if (!userRepository.existsById(userId)) {
      throw new AppException(ErrorCode.INVALID_INPUT, "User not found: " + userId);
    }

    return voucherRepository.countValidVouchersByUserId(userId);
  }
}
