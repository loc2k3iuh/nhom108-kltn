package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.ApplyDiscountRequest;
import iuh.fit.se.dtos.requests.CreateDiscountRequest;
import iuh.fit.se.dtos.requests.UpdateDiscountRequest;
import iuh.fit.se.dtos.responses.DiscountResponse;
import iuh.fit.se.dtos.responses.ProductDiscountResponse;
import iuh.fit.se.enums.DiscountType;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IDiscountService {

  // CRUD operations
  DiscountResponse createDiscount(CreateDiscountRequest request);

  DiscountResponse updateDiscount(Long id, UpdateDiscountRequest request);

  void deleteDiscount(Long id);

  DiscountResponse getDiscountById(Long id);

  Page<DiscountResponse> getAllDiscounts(Pageable pageable);

  // Business operations
  List<DiscountResponse> getActiveDiscounts();

  List<DiscountResponse> getDiscountsByType(DiscountType discountType);

  List<DiscountResponse> getExpiringSoonDiscounts(int daysAhead);

  Page<DiscountResponse> getDiscountsByDateRange(
      LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

  // Product discount operations
  void applyDiscountToProducts(ApplyDiscountRequest request);

  void removeDiscountFromProducts(Long discountId, List<Long> productIds);

  void removeAllDiscountsFromProduct(Long productId);

  List<ProductDiscountResponse> getProductDiscounts(Long productId);

  List<ProductDiscountResponse> getDiscountProducts(Long discountId);

  // Utility methods
  boolean isDiscountActive(Long discountId);

  Double calculateDiscountedPrice(Double originalPrice, Long discountId);

  boolean isDiscountInUse(Long discountId);

  DiscountResponse findByName(String name);
}
