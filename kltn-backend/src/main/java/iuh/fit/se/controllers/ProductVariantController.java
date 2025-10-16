package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.CreateProductVariantRequest;
import iuh.fit.se.dtos.requests.UpdateProductVariantRequest;
import iuh.fit.se.dtos.responses.ProductVariantResponse;
import iuh.fit.se.services.interfaces.IProductVariantService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/product-variants")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Product Variant Management", description = "APIs for managing product variants")
public class ProductVariantController {

  IProductVariantService productVariantService;

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(
      summary = "Create new product variant",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<ProductVariantResponse> createProductVariant(
      @Valid @ModelAttribute CreateProductVariantRequest request) {
    log.info("Creating product variant for product ID: {}", request.getProductId());
    ProductVariantResponse response = productVariantService.createProductVariant(request);
    return APIResponse.<ProductVariantResponse>builder()
        .result(response)
        .message("Product variant created successfully")
        .code(HttpStatus.CREATED.value())
        .build();
  }

  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(
      summary = "Update product variant",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<ProductVariantResponse> updateProductVariant(
      @Parameter(description = "Product variant ID", required = true) @PathVariable Long id,
      @Valid @ModelAttribute UpdateProductVariantRequest request) {
    log.info("Updating product variant with ID: {}", id);
    ProductVariantResponse response = productVariantService.updateProductVariant(id, request);
    return APIResponse.<ProductVariantResponse>builder()
        .result(response)
        .message("Product variant updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @DeleteMapping("/{id}")
  @Operation(
      summary = "Delete product variant",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Void> deleteProductVariant(
      @Parameter(description = "Product variant ID", required = true) @PathVariable Long id) {
    log.info("Deleting product variant with ID: {}", id);
    productVariantService.deleteProductVariant(id);
    return APIResponse.<Void>builder()
        .message("Product variant deleted successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get product variant by ID")
  public APIResponse<ProductVariantResponse> getProductVariantById(
      @Parameter(description = "Product variant ID", required = true) @PathVariable Long id) {
    log.info("Getting product variant with ID: {}", id);
    ProductVariantResponse response = productVariantService.getProductVariantById(id);
    return APIResponse.<ProductVariantResponse>builder()
        .result(response)
        .message("Product variant retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping
  @Operation(summary = "Get all product variants with pagination")
  public APIResponse<Page<ProductVariantResponse>> getAllProductVariants(
      @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
      @Parameter(description = "Sort field") @RequestParam(defaultValue = "id") String sortBy,
      @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "desc")
          String sortDir) {
    log.info(
        "Getting all product variants - page: {}, size: {}, sortBy: {}, sortDir: {}",
        page,
        size,
        sortBy,
        sortDir);

    Sort.Direction direction =
        sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

    Page<ProductVariantResponse> response = productVariantService.getAllProductVariants(pageable);
    return APIResponse.<Page<ProductVariantResponse>>builder()
        .result(response)
        .message("Product variants retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/product/{productId}")
  @Operation(summary = "Get all variants for a specific product")
  public APIResponse<List<ProductVariantResponse>> getVariantsByProductId(
      @Parameter(description = "Product ID", required = true) @PathVariable Long productId) {
    log.info("Getting variants for product ID: {}", productId);
    List<ProductVariantResponse> response =
        productVariantService.getProductVariantsByProductId(productId);
    return APIResponse.<List<ProductVariantResponse>>builder()
        .result(response)
        .message("Product variants retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/product/{productId}/available")
  @Operation(summary = "Get available variants for a specific product (stock > 0)")
  public APIResponse<List<ProductVariantResponse>> getAvailableVariantsByProductId(
      @Parameter(description = "Product ID", required = true) @PathVariable Long productId) {
    log.info("Getting available variants for product ID: {}", productId);
    List<ProductVariantResponse> response =
        productVariantService.getAvailableVariantsByProduct(productId);
    return APIResponse.<List<ProductVariantResponse>>builder()
        .result(response)
        .message("Available product variants retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @PutMapping("/{id}/stock")
  @Operation(
      summary = "Update product variant stock",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<Void> updateStock(
      @Parameter(description = "Product variant ID", required = true) @PathVariable Long id,
      @Parameter(description = "New stock quantity", required = true) @RequestParam
          Integer quantity) {
    log.info("Updating stock for product variant ID: {} to quantity: {}", id, quantity);
    productVariantService.updateStock(id, quantity);
    return APIResponse.<Void>builder()
        .message("Stock updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }
}
