package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.CreateProductRequest;
import iuh.fit.se.dtos.requests.UpdateProductRequest;
import iuh.fit.se.dtos.responses.ProductResponse;
import iuh.fit.se.enums.ProductStatus;
import iuh.fit.se.services.interfaces.IProductService;
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
@RequestMapping("${api.prefix}/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Product Management", description = "APIs for managing products")
public class ProductController {

  IProductService productService;

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Create new product", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<ProductResponse> createProduct(
      @Valid @ModelAttribute CreateProductRequest request) {
    log.info("Creating product with name: {}", request.getName());
    ProductResponse response = productService.createProduct(request);
    return APIResponse.<ProductResponse>builder()
        .result(response)
        .message("Product created successfully")
        .code(HttpStatus.CREATED.value())
        .build();
  }

  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Update product", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<ProductResponse> updateProduct(
      @PathVariable Long id, @Valid @ModelAttribute UpdateProductRequest request) {
    log.info("Updating product with ID: {}", id);
    ProductResponse response = productService.updateProduct(id, request);
    return APIResponse.<ProductResponse>builder()
        .result(response)
        .message("Product updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete product", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Void> deleteProduct(@PathVariable Long id) {
    log.info("Deleting product with ID: {}", id);
    productService.deleteProduct(id);
    return APIResponse.<Void>builder()
        .message("Product deleted successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get product by ID")
  public APIResponse<ProductResponse> getProductById(@PathVariable Long id) {
    log.info("Getting product with ID: {}", id);
    ProductResponse response = productService.getProductById(id);
    return APIResponse.<ProductResponse>builder()
        .result(response)
        .message("Product retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping
  @Operation(summary = "Get all products with pagination and filtering")
  public APIResponse<Page<ProductResponse>> getAllProducts(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir,
      @RequestParam(required = false) String status,
      @RequestParam(required = false) Long categoryId,
      @RequestParam(required = false) Long brandId,
      @RequestParam(required = false) String keyword,
      @RequestParam(required = false) Double minPrice,
      @RequestParam(required = false) Double maxPrice) {

    Sort sort =
        sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<ProductResponse> response;

    // Apply filters based on parameters
    if (keyword != null && !keyword.trim().isEmpty()) {
      response = productService.searchProducts(keyword, pageable);
    } else if (minPrice != null && maxPrice != null) {
      response = productService.getProductsByPriceRange(minPrice, maxPrice, pageable);
    } else if (status != null) {
      ProductStatus productStatus = ProductStatus.valueOf(status.toUpperCase());
      response = productService.getProductsByStatus(productStatus, pageable);
    } else if (categoryId != null) {
      response = productService.getProductsByCategory(categoryId, pageable);
    } else if (brandId != null) {
      response = productService.getProductsByBrand(brandId, pageable);
    } else {
      response = productService.getAllProducts(pageable);
    }

    return APIResponse.<Page<ProductResponse>>builder()
        .result(response)
        .message("Products retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/available")
  @Operation(summary = "Get available products (in stock)")
  public APIResponse<Page<ProductResponse>> getAvailableProducts(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir) {

    Sort sort =
        sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<ProductResponse> response = productService.getAvailableProducts(pageable);

    return APIResponse.<Page<ProductResponse>>builder()
        .result(response)
        .message("Available products retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/latest")
  @Operation(summary = "Get latest products")
  public APIResponse<List<ProductResponse>> getLatestProducts(
      @RequestParam(defaultValue = "10") int limit) {
    log.info("Getting latest {} products", limit);
    List<ProductResponse> response = productService.getLatestProducts(limit);
    return APIResponse.<List<ProductResponse>>builder()
        .result(response)
        .message("Latest products retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/category/{categoryId}")
  @Operation(summary = "Get products by category")
  public APIResponse<Page<ProductResponse>> getProductsByCategory(
      @PathVariable Long categoryId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir) {

    Sort sort =
        sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<ProductResponse> response = productService.getProductsByCategory(categoryId, pageable);

    return APIResponse.<Page<ProductResponse>>builder()
        .result(response)
        .message("Products by category retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/brand/{brandId}")
  @Operation(summary = "Get products by brand")
  public APIResponse<Page<ProductResponse>> getProductsByBrand(
      @PathVariable Long brandId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir) {

    Sort sort =
        sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<ProductResponse> response = productService.getProductsByBrand(brandId, pageable);

    return APIResponse.<Page<ProductResponse>>builder()
        .result(response)
        .message("Products by brand retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/search")
  @Operation(summary = "Search products by keyword")
  public APIResponse<Page<ProductResponse>> searchProducts(
      @RequestParam String keyword,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir) {

    Sort sort =
        sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<ProductResponse> response = productService.searchProducts(keyword, pageable);

    return APIResponse.<Page<ProductResponse>>builder()
        .result(response)
        .message("Search results retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @PatchMapping("/{id}/status")
  @Operation(
      summary = "Update product status",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<Void> updateProductStatus(@PathVariable Long id, @RequestParam String status) {
    log.info("Updating product status with ID: {} to status: {}", id, status);
    ProductStatus productStatus = ProductStatus.valueOf(status.toUpperCase());
    productService.updateProductStatus(id, productStatus);
    return APIResponse.<Void>builder()
        .message("Product status updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }
}
