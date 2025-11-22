package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.ApplyDiscountRequest;
import iuh.fit.se.dtos.requests.CreateDiscountRequest;
import iuh.fit.se.dtos.requests.UpdateDiscountRequest;
import iuh.fit.se.dtos.responses.DiscountResponse;
import iuh.fit.se.dtos.responses.ProductDiscountResponse;
import iuh.fit.se.enums.DiscountType;
import iuh.fit.se.services.interfaces.IDiscountService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/discounts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(
    name = "Discount Management",
    description = "APIs for managing discounts and product discounts")
public class DiscountController {

  IDiscountService discountService;

  @PostMapping
  @Operation(
      summary = "Create new discount",
      description = "Create a new discount with specified details. Requires ADMIN role.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<DiscountResponse> createDiscount(
      @Valid @RequestBody CreateDiscountRequest request) {
    log.info("REST request to create discount: {}", request.getName());

    DiscountResponse response = discountService.createDiscount(request);
    return APIResponse.<DiscountResponse>builder()
        .result(response)
        .message("Tạo discount thành công")
        .build();
  }

  @PutMapping("/{id}")
  @Operation(
      summary = "Update discount",
      description = "Update an existing discount by ID. Requires ADMIN role.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<DiscountResponse> updateDiscount(
      @Parameter(description = "Discount ID") @PathVariable Long id,
      @Valid @RequestBody UpdateDiscountRequest request) {
    log.info("REST request to update discount with ID: {}", id);

    DiscountResponse response = discountService.updateDiscount(id, request);
    return APIResponse.<DiscountResponse>builder()
        .result(response)
        .message("Cập nhật discount thành công")
        .build();
  }

  @DeleteMapping("/{id}")
  @Operation(
      summary = "Delete discount",
      description =
          "Delete a discount by ID. Cannot delete if discount is being used. Requires ADMIN role.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Void> deleteDiscount(
      @Parameter(description = "Discount ID") @PathVariable Long id) {
    log.info("REST request to delete discount with ID: {}", id);

    discountService.deleteDiscount(id);
    return APIResponse.<Void>builder().message("Xóa discount thành công").build();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get discount by ID", description = "Retrieve discount details by ID")
  public APIResponse<DiscountResponse> getDiscountById(
      @Parameter(description = "Discount ID") @PathVariable Long id) {
    log.info("REST request to get discount with ID: {}", id);

    DiscountResponse response = discountService.getDiscountById(id);
    return APIResponse.<DiscountResponse>builder()
        .result(response)
        .message("Lấy thông tin discount thành công")
        .build();
  }

  @GetMapping
  @Operation(
      summary = "Get all discounts with pagination",
      description = "Retrieve all discounts with pagination and sorting")
  public APIResponse<Page<DiscountResponse>> getAllDiscounts(
      @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
      @Parameter(description = "Sort by field") @RequestParam(defaultValue = "id") String sortBy,
      @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "desc")
          String sortDirection) {
    log.info("REST request to get all discounts - page: {}, size: {}", page, size);

    Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
    Pageable pageable = PageRequest.of(page, size, sort);

    Page<DiscountResponse> response = discountService.getAllDiscounts(pageable);
    return APIResponse.<Page<DiscountResponse>>builder()
        .result(response)
        .message("Lấy danh sách discount thành công")
        .build();
  }

  @GetMapping("/active")
  @Operation(
      summary = "Get active discounts",
      description = "Retrieve all currently active discounts")
  public APIResponse<List<DiscountResponse>> getActiveDiscounts() {
    log.info("REST request to get active discounts");

    List<DiscountResponse> response = discountService.getActiveDiscounts();
    return APIResponse.<List<DiscountResponse>>builder()
        .result(response)
        .message("Lấy danh sách discount đang hoạt động thành công")
        .build();
  }

  @GetMapping("/type/{type}")
  @Operation(
      summary = "Get discounts by type",
      description = "Retrieve discounts filtered by type (PERCENT or FIXED)")
  public APIResponse<List<DiscountResponse>> getDiscountsByType(
      @Parameter(description = "Discount type") @PathVariable DiscountType type) {
    log.info("REST request to get discounts by type: {}", type);

    List<DiscountResponse> response = discountService.getDiscountsByType(type);
    return APIResponse.<List<DiscountResponse>>builder()
        .result(response)
        .message("Lấy danh sách discount theo loại thành công")
        .build();
  }

  @GetMapping("/expiring-soon")
  @Operation(
      summary = "Get expiring soon discounts",
      description = "Retrieve discounts that will expire within specified days")
  public APIResponse<List<DiscountResponse>> getExpiringSoonDiscounts(
      @Parameter(description = "Days ahead to check for expiration")
          @RequestParam(defaultValue = "7")
          int daysAhead) {
    log.info("REST request to get discounts expiring in {} days", daysAhead);

    List<DiscountResponse> response = discountService.getExpiringSoonDiscounts(daysAhead);
    return APIResponse.<List<DiscountResponse>>builder()
        .result(response)
        .message("Lấy danh sách discount sắp hết hạn thành công")
        .build();
  }

  @GetMapping("/date-range")
  @Operation(
      summary = "Get discounts by date range",
      description = "Retrieve discounts within specified date range")
  public APIResponse<Page<DiscountResponse>> getDiscountsByDateRange(
      @Parameter(description = "Start date (ISO format)")
          @RequestParam
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
          LocalDateTime startDate,
      @Parameter(description = "End date (ISO format)")
          @RequestParam
          @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
          LocalDateTime endDate,
      @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
    log.info("REST request to get discounts by date range: {} to {}", startDate, endDate);

    Pageable pageable = PageRequest.of(page, size, Sort.by("startDate").descending());
    Page<DiscountResponse> response =
        discountService.getDiscountsByDateRange(startDate, endDate, pageable);

    return APIResponse.<Page<DiscountResponse>>builder()
        .result(response)
        .message("Lấy danh sách discount theo khoảng thời gian thành công")
        .build();
  }

  @GetMapping("/search")
  @Operation(summary = "Search discount by name", description = "Find discount by exact name")
  public APIResponse<DiscountResponse> findDiscountByName(
      @Parameter(description = "Discount name") @RequestParam String name) {
    log.info("REST request to search discount by name: {}", name);

    DiscountResponse response = discountService.findByName(name);
    return APIResponse.<DiscountResponse>builder()
        .result(response)
        .message("Tìm discount thành công")
        .build();
  }

  @PostMapping("/apply-to-products")
  @Operation(
      summary = "Apply discount to products",
      description = "Apply a discount to multiple products. Requires ADMIN role.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Void> applyDiscountToProducts(
      @Valid @RequestBody ApplyDiscountRequest request) {
    log.info("REST request to apply discount {} to products", request.getDiscountId());

    discountService.applyDiscountToProducts(request);
    return APIResponse.<Void>builder().message("Áp dụng discount cho sản phẩm thành công").build();
  }

  @DeleteMapping("/{discountId}/products")
  @Operation(
      summary = "Remove discount from products",
      description = "Remove a discount from specified products. Requires ADMIN role.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Void> removeDiscountFromProducts(
      @Parameter(description = "Discount ID") @PathVariable Long discountId,
      @Parameter(description = "List of product IDs") @RequestBody List<Long> productIds) {
    log.info("REST request to remove discount {} from {} products", discountId, productIds.size());

    discountService.removeDiscountFromProducts(discountId, productIds);
    return APIResponse.<Void>builder().message("Gỡ bỏ discount khỏi sản phẩm thành công").build();
  }

  @DeleteMapping("/products/{productId}/discounts")
  @Operation(
      summary = "Remove all discounts from product",
      description = "Remove all discounts from a specific product. Requires ADMIN role.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Void> removeAllDiscountsFromProduct(
      @Parameter(description = "Product ID") @PathVariable Long productId) {
    log.info("REST request to remove all discounts from product: {}", productId);

    discountService.removeAllDiscountsFromProduct(productId);
    return APIResponse.<Void>builder()
        .message("Gỡ bỏ tất cả discount khỏi sản phẩm thành công")
        .build();
  }

  @GetMapping("/products/{productId}")
  @Operation(
      summary = "Get product discounts",
      description = "Get all active discounts for a specific product")
  public APIResponse<List<ProductDiscountResponse>> getProductDiscounts(
      @Parameter(description = "Product ID") @PathVariable Long productId) {
    log.info("REST request to get discounts for product: {}", productId);

    List<ProductDiscountResponse> response = discountService.getProductDiscounts(productId);
    return APIResponse.<List<ProductDiscountResponse>>builder()
        .result(response)
        .message("Lấy danh sách discount của sản phẩm thành công")
        .build();
  }

  @GetMapping("/{discountId}/products")
  @Operation(
      summary = "Get discount products",
      description = "Get all products that have a specific discount applied")
  public APIResponse<List<ProductDiscountResponse>> getDiscountProducts(
      @Parameter(description = "Discount ID") @PathVariable Long discountId) {
    log.info("REST request to get products with discount: {}", discountId);

    List<ProductDiscountResponse> response = discountService.getDiscountProducts(discountId);
    return APIResponse.<List<ProductDiscountResponse>>builder()
        .result(response)
        .message("Lấy danh sách sản phẩm có discount thành công")
        .build();
  }

  @GetMapping("/{discountId}/active-status")
  @Operation(
      summary = "Check if discount is active",
      description = "Check whether a discount is currently active")
  public APIResponse<Boolean> isDiscountActive(
      @Parameter(description = "Discount ID") @PathVariable Long discountId) {
    log.info("REST request to check if discount {} is active", discountId);

    Boolean isActive = discountService.isDiscountActive(discountId);
    return APIResponse.<Boolean>builder()
        .result(isActive)
        .message("Kiểm tra trạng thái discount thành công")
        .build();
  }

  @GetMapping("/{discountId}/usage-status")
  @Operation(
      summary = "Check if discount is in use",
      description = "Check whether a discount is currently being used by products")
  public APIResponse<Boolean> isDiscountInUse(
      @Parameter(description = "Discount ID") @PathVariable Long discountId) {
    log.info("REST request to check if discount {} is in use", discountId);

    Boolean inUse = discountService.isDiscountInUse(discountId);
    return APIResponse.<Boolean>builder()
        .result(inUse)
        .message("Kiểm tra tình trạng sử dụng discount thành công")
        .build();
  }

  @GetMapping("/calculate-price")
  @Operation(
      summary = "Calculate discounted price",
      description = "Calculate the discounted price for a given original price and discount")
  public APIResponse<Double> calculateDiscountedPrice(
      @Parameter(description = "Original price") @RequestParam Double originalPrice,
      @Parameter(description = "Discount ID") @RequestParam Long discountId) {
    log.info("REST request to calculate discounted price for discount: {}", discountId);

    Double discountedPrice = discountService.calculateDiscountedPrice(originalPrice, discountId);
    return APIResponse.<Double>builder()
        .result(discountedPrice)
        .message("Tính toán giá sau discount thành công")
        .build();
  }
}
