package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.ApplyDiscountRequest;
import iuh.fit.se.dtos.requests.CreateDiscountRequest;
import iuh.fit.se.dtos.requests.UpdateDiscountRequest;
import iuh.fit.se.dtos.responses.DiscountResponse;
import iuh.fit.se.dtos.responses.ProductDiscountResponse;
import iuh.fit.se.entities.Discount;
import iuh.fit.se.entities.Product;
import iuh.fit.se.entities.ProductDiscount;
import iuh.fit.se.enums.DiscountType;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.DiscountMapper;
import iuh.fit.se.mapper.ProductDiscountMapper;
import iuh.fit.se.repositories.DiscountRepository;
import iuh.fit.se.repositories.ProductDiscountRepository;
import iuh.fit.se.repositories.ProductRepository;
import iuh.fit.se.services.interfaces.IDiscountService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class DiscountServiceImpl implements IDiscountService {

  DiscountRepository discountRepository;
  ProductDiscountRepository productDiscountRepository;
  ProductRepository productRepository;
  DiscountMapper discountMapper;
  ProductDiscountMapper productDiscountMapper;

  @Override
  public DiscountResponse createDiscount(CreateDiscountRequest request) {
    log.info("Creating new discount with name: {}", request.getName());

    // Validate business rules
    validateDiscountRequest(request);

    // Check if discount name already exists
    if (discountRepository.findByName(request.getName()).isPresent()) {
      throw new AppException(ErrorCode.DISCOUNT_ALREADY_EXISTS);
    }

    // Validate date range
    if (request.getEndDate().isBefore(request.getStartDate())) {
      throw new AppException(ErrorCode.DISCOUNT_INVALID_DATE_RANGE);
    }

    Discount discount = discountMapper.toDiscount(request);
    discount = discountRepository.save(discount);

    log.info("Successfully created discount with ID: {}", discount.getId());
    return discountMapper.toDiscountResponse(discount);
  }

  @Override
  public DiscountResponse updateDiscount(Long id, UpdateDiscountRequest request) {
    log.info("Updating discount with ID: {}", id);

    Discount discount = findDiscountById(id);

    // Validate business rules if updating critical fields
    if (request.getDiscountType() != null && request.getValue() != null) {
      validateDiscountValue(request.getDiscountType(), request.getValue());
    }

    // Validate date range if both dates are provided
    if (request.getStartDate() != null && request.getEndDate() != null) {
      if (request.getEndDate().isBefore(request.getStartDate())) {
        throw new AppException(ErrorCode.DISCOUNT_INVALID_DATE_RANGE);
      }
    }

    discountMapper.updateDiscountFromRequest(request, discount);
    discount = discountRepository.save(discount);

    log.info("Successfully updated discount with ID: {}", id);
    return discountMapper.toDiscountResponse(discount);
  }

  @Override
  public void deleteDiscount(Long id) {
    log.info("Deleting discount with ID: {}", id);

    Discount discount = findDiscountById(id);

    // Check if discount is being used
    if (discountRepository.isDiscountInUse(id)) {
      throw new AppException(ErrorCode.DISCOUNT_IN_USE);
    }

    discountRepository.delete(discount);
    log.info("Successfully deleted discount with ID: {}", id);
  }

  @Override
  @Transactional(readOnly = true)
  public DiscountResponse getDiscountById(Long id) {
    log.info("Getting discount with ID: {}", id);

    Discount discount = findDiscountById(id);
    return discountMapper.toDiscountResponse(discount);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<DiscountResponse> getAllDiscounts(Pageable pageable) {
    log.info("Getting all discounts with pageable: {}", pageable);

    return discountRepository.findAll(pageable).map(discountMapper::toDiscountResponse);
  }

  @Override
  @Transactional(readOnly = true)
  public List<DiscountResponse> getActiveDiscounts() {
    log.info("Getting active discounts");

    LocalDateTime now = LocalDateTime.now();
    return discountRepository.findActiveDiscounts(now).stream()
        .map(discountMapper::toDiscountResponse)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<DiscountResponse> getDiscountsByType(DiscountType discountType) {
    log.info("Getting discounts by type: {}", discountType);

    return discountRepository.findByDiscountType(discountType).stream()
        .map(discountMapper::toDiscountResponse)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<DiscountResponse> getExpiringSoonDiscounts(int daysAhead) {
    log.info("Getting discounts expiring in {} days", daysAhead);

    LocalDateTime now = LocalDateTime.now();
    LocalDateTime endTime = now.plusDays(daysAhead);

    return discountRepository.findExpiringSoon(now, endTime).stream()
        .map(discountMapper::toDiscountResponse)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public Page<DiscountResponse> getDiscountsByDateRange(
      LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
    log.info("Getting discounts by date range: {} to {}", startDate, endDate);

    if (endDate.isBefore(startDate)) {
      throw new AppException(ErrorCode.DISCOUNT_INVALID_DATE_RANGE);
    }

    return discountRepository
        .findByDateRange(startDate, endDate, pageable)
        .map(discountMapper::toDiscountResponse);
  }

  @Override
  public void applyDiscountToProducts(ApplyDiscountRequest request) {
    log.info(
        "Applying discount {} to {} products",
        request.getDiscountId(),
        request.getProductIds().size());

    Discount discount = findDiscountById(request.getDiscountId());

    for (Long productId : request.getProductIds()) {
      Product product = findProductById(productId);

      // Check if product already has this discount
      if (productDiscountRepository.existsByProductIdAndDiscountId(
          productId, request.getDiscountId())) {
        log.warn(
            "Product {} already has discount {}, skipping", productId, request.getDiscountId());
        continue;
      }

      ProductDiscount productDiscount =
          ProductDiscount.builder().product(product).discount(discount).build();

      productDiscountRepository.save(productDiscount);
      log.debug("Applied discount {} to product {}", request.getDiscountId(), productId);
    }

    log.info("Successfully applied discount to products");
  }

  @Override
  public void removeDiscountFromProducts(Long discountId, List<Long> productIds) {
    log.info("Removing discount {} from {} products", discountId, productIds.size());

    findDiscountById(discountId); // Validate discount exists

    for (Long productId : productIds) {
      findProductById(productId); // Validate product exists

      productDiscountRepository.deleteById(
          new iuh.fit.se.entities.ProductDiscountId(productId, discountId));
      log.debug("Removed discount {} from product {}", discountId, productId);
    }

    log.info("Successfully removed discount from products");
  }

  @Override
  public void removeAllDiscountsFromProduct(Long productId) {
    log.info("Removing all discounts from product: {}", productId);

    findProductById(productId); // Validate product exists

    productDiscountRepository.deleteByProductId(productId);
    log.info("Successfully removed all discounts from product: {}", productId);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ProductDiscountResponse> getProductDiscounts(Long productId) {
    log.info("Getting discounts for product: {}", productId);

    findProductById(productId); // Validate product exists

    LocalDateTime now = LocalDateTime.now();
    return productDiscountRepository.findActiveDiscountsByProductId(productId, now).stream()
        .map(productDiscountMapper::toProductDiscountResponse)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public List<ProductDiscountResponse> getDiscountProducts(Long discountId) {
    log.info("Getting products with discount: {}", discountId);

    findDiscountById(discountId); // Validate discount exists

    return productDiscountRepository.findByDiscountId(discountId).stream()
        .map(productDiscountMapper::toProductDiscountResponse)
        .collect(Collectors.toList());
  }

  @Override
  @Transactional(readOnly = true)
  public boolean isDiscountActive(Long discountId) {
    Discount discount = findDiscountById(discountId);
    LocalDateTime now = LocalDateTime.now();
    return now.isAfter(discount.getStartDate()) && now.isBefore(discount.getEndDate());
  }

  @Override
  @Transactional(readOnly = true)
  public Double calculateDiscountedPrice(Double originalPrice, Long discountId) {
    if (originalPrice == null || originalPrice <= 0) {
      return originalPrice;
    }

    Discount discount = findDiscountById(discountId);

    if (!isDiscountActive(discountId)) {
      return originalPrice;
    }

    if (discount.getDiscountType() == DiscountType.PERCENT) {
      return originalPrice - (originalPrice * discount.getValue() / 100);
    } else {
      return Math.max(0, originalPrice - discount.getValue());
    }
  }

  @Override
  @Transactional(readOnly = true)
  public boolean isDiscountInUse(Long discountId) {
    return discountRepository.isDiscountInUse(discountId);
  }

  @Override
  @Transactional(readOnly = true)
  public DiscountResponse findByName(String name) {
    log.info("Finding discount by name: {}", name);

    return discountRepository
        .findByName(name)
        .map(discountMapper::toDiscountResponse)
        .orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_FOUND));
  }

  // Private helper methods
  private Discount findDiscountById(Long id) {
    return discountRepository
        .findById(id)
        .orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_FOUND));
  }

  private Product findProductById(Long id) {
    return productRepository
        .findById(id)
        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
  }

  private void validateDiscountRequest(CreateDiscountRequest request) {
    validateDiscountValue(request.getDiscountType(), request.getValue());
  }

  private void validateDiscountValue(DiscountType discountType, Double value) {
    if (discountType == DiscountType.PERCENT && (value < 0 || value > 100)) {
      throw new AppException(ErrorCode.DISCOUNT_INVALID_VALUE);
    }

    if (discountType == DiscountType.FIXED && value < 0) {
      throw new AppException(ErrorCode.DISCOUNT_INVALID_VALUE);
    }
  }
}
