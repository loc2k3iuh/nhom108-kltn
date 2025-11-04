package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.responses.VoucherResponse;
import iuh.fit.se.entities.UserVoucher;
import iuh.fit.se.entities.Voucher;
import iuh.fit.se.enums.DiscountType;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.VoucherMapper;
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

    return vouchers.stream()
        .map(voucherMapper::toVoucherResponse)
        .collect(Collectors.toList());
  }
}
