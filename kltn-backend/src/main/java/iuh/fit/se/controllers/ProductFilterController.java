package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.ProductFilterRequest;
import iuh.fit.se.dtos.responses.ProductDetailResponse;
import iuh.fit.se.dtos.responses.ProductStatisticsResponse;
import iuh.fit.se.services.interfaces.IProductFilterService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/products/filter")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Product Advanced Filtering", description = "APIs for advanced product filtering and search")
public class ProductFilterController {

    IProductFilterService productFilterService;

    @PostMapping
    @Operation(summary = "Filter products with multiple criteria")
    public APIResponse<Page<ProductDetailResponse>> filterProducts(
            @Valid @RequestBody ProductFilterRequest filterRequest) {
        log.info("Filtering products with complex criteria");
        
        // Set user ID from security context if user is authenticated
        try {
            String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!"anonymousUser".equals(currentUser) && filterRequest.getUserId() == null) {
                // Extract user ID from token or set appropriately
                // filterRequest.setUserId(extractUserIdFromContext());
            }
        } catch (Exception e) {
            log.debug("User not authenticated for filtering");
        }
        
        Page<ProductDetailResponse> response = productFilterService.filterProducts(filterRequest);
        
        return APIResponse.<Page<ProductDetailResponse>>builder()
            .result(response)
            .message("Products filtered successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product detail by ID")
    public APIResponse<ProductDetailResponse> getProductDetailById(
            @Parameter(description = "Product ID") @PathVariable Long id) {

        log.info("Getting product detail for ID: {}", id);

        ProductDetailResponse response = productFilterService.getProductDetailById(id);

        return APIResponse.<ProductDetailResponse>builder()
                .result(response)
                .message("Product detail retrieved successfully")
                .code(HttpStatus.OK.value())
                .build();
    }


    @GetMapping("/root-category/{categoryId}")
    @Operation(summary = "Get products by root category")
    public APIResponse<Page<ProductDetailResponse>> getProductsByRootCategory(
            @Parameter(description = "Root category ID") @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        log.info("Getting products by root category: {}", categoryId);
        
        Page<ProductDetailResponse> response = productFilterService
            .getProductsByRootCategory(categoryId, page, size, sortBy, sortDirection);
        
        return APIResponse.<Page<ProductDetailResponse>>builder()
            .result(response)
            .message("Products by root category retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @GetMapping("/subcategory/{categoryId}")
    @Operation(summary = "Get products by subcategory")
    public APIResponse<Page<ProductDetailResponse>> getProductsBySubCategory(
            @Parameter(description = "Subcategory ID") @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        log.info("Getting products by subcategory: {}", categoryId);
        
        Page<ProductDetailResponse> response = productFilterService
            .getProductsBySubCategory(categoryId, page, size, sortBy, sortDirection);
        
        return APIResponse.<Page<ProductDetailResponse>>builder()
            .result(response)
            .message("Products by subcategory retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @PostMapping("/brand/{brandId}")
    @Operation(summary = "Get products by brand with additional filters")
    public APIResponse<Page<ProductDetailResponse>> getProductsByBrand(
            @Parameter(description = "Brand ID") @PathVariable Long brandId,
            @RequestBody(required = false) ProductFilterRequest additionalFilters) {
        
        log.info("Getting products by brand: {} with additional filters", brandId);
        
        if (additionalFilters == null) {
            additionalFilters = ProductFilterRequest.builder().build();
        }
        
        Page<ProductDetailResponse> response = productFilterService
            .getProductsByBrand(brandId, additionalFilters);
        
        return APIResponse.<Page<ProductDetailResponse>>builder()
            .result(response)
            .message("Products by brand retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @PostMapping("/size/{sizeId}")
    @Operation(summary = "Get products by size with additional filters")
    public APIResponse<Page<ProductDetailResponse>> getProductsBySize(
            @Parameter(description = "Size ID") @PathVariable Long sizeId,
            @RequestBody(required = false) ProductFilterRequest additionalFilters) {
        
        log.info("Getting products by size: {} with additional filters", sizeId);
        
        if (additionalFilters == null) {
            additionalFilters = ProductFilterRequest.builder().build();
        }
        
        Page<ProductDetailResponse> response = productFilterService
            .getProductsBySize(sizeId, additionalFilters);
        
        return APIResponse.<Page<ProductDetailResponse>>builder()
            .result(response)
            .message("Products by size retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @PostMapping("/color/{colorId}")
    @Operation(summary = "Get products by color with additional filters")
    public APIResponse<Page<ProductDetailResponse>> getProductsByColor(
            @Parameter(description = "Color ID") @PathVariable Long colorId,
            @RequestBody(required = false) ProductFilterRequest additionalFilters) {
        
        log.info("Getting products by color: {} with additional filters", colorId);
        
        if (additionalFilters == null) {
            additionalFilters = ProductFilterRequest.builder().build();
        }
        
        Page<ProductDetailResponse> response = productFilterService
            .getProductsByColor(colorId, additionalFilters);
        
        return APIResponse.<Page<ProductDetailResponse>>builder()
            .result(response)
            .message("Products by color retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @GetMapping("/discount")
    @Operation(summary = "Get products with discount")
    public APIResponse<Page<ProductDetailResponse>> getProductsWithDiscount(
            @RequestParam(required = false) Double minDiscountPercent,
            @RequestParam(required = false) Double maxDiscountPercent,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        log.info("Getting products with discount range: {} - {}", minDiscountPercent, maxDiscountPercent);
        
        Page<ProductDetailResponse> response = productFilterService
            .getProductsWithDiscount(minDiscountPercent, maxDiscountPercent, page, size, sortBy, sortDirection);
        
        return APIResponse.<Page<ProductDetailResponse>>builder()
            .result(response)
            .message("Products with discount retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @GetMapping("/favorites")
    @Operation(summary = "Get favorite products", security = @SecurityRequirement(name = "bearerAuth"))
    public APIResponse<Page<ProductDetailResponse>> getFavoriteProducts(
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        // If userId is not provided, get from security context
        if (userId == null) {
            // userId = extractUserIdFromSecurityContext();
            log.warn("User ID should be extracted from security context");
        }
        
        log.info("Getting favorite products for user: {}", userId);
        
        Page<ProductDetailResponse> response = productFilterService
            .getFavoriteProducts(userId, page, size, sortBy, sortDirection);
        
        return APIResponse.<Page<ProductDetailResponse>>builder()
            .result(response)
            .message("Favorite products retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @GetMapping("/price-range")
    @Operation(summary = "Get products by price range")
    public APIResponse<Page<ProductDetailResponse>> getProductsByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "basePrice") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {
        
        log.info("Getting products by price range: {} - {}", minPrice, maxPrice);
        
        Page<ProductDetailResponse> response = productFilterService
            .getProductsByPriceRange(minPrice, maxPrice, page, size, sortBy, sortDirection);
        
        return APIResponse.<Page<ProductDetailResponse>>builder()
            .result(response)
            .message("Products by price range retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @PostMapping("/count")
    @Operation(summary = "Count products by filter criteria")
    public APIResponse<Long> countProductsByFilter(@Valid @RequestBody ProductFilterRequest filterRequest) {
        log.info("Counting products with filter criteria");
        
        Long count = productFilterService.countProductsByFilter(filterRequest);
        
        return APIResponse.<Long>builder()
            .result(count)
            .message("Product count retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get product statistics")
    public APIResponse<ProductStatisticsResponse> getProductStatistics() {
        log.info("Getting product statistics");
        
        ProductStatisticsResponse response = productFilterService.getProductStatistics();
        
        return APIResponse.<ProductStatisticsResponse>builder()
            .result(response)
            .message("Product statistics retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @PostMapping("/statistics")
    @Operation(summary = "Get product statistics by filter")
    public APIResponse<ProductStatisticsResponse> getProductStatisticsByFilter(
            @Valid @RequestBody ProductFilterRequest filterRequest) {
        log.info("Getting product statistics by filter");
        
        ProductStatisticsResponse response = productFilterService.getProductStatisticsByFilter(filterRequest);
        
        return APIResponse.<ProductStatisticsResponse>builder()
            .result(response)
            .message("Filtered product statistics retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @GetMapping("/new")
    @Operation(summary = "Get new products (within last 30 days)")
    public APIResponse<Page<ProductDetailResponse>> getNewProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        log.info("Getting new products");
        
        Page<ProductDetailResponse> response = productFilterService
            .getNewProducts(page, size, sortBy, sortDirection);
        
        return APIResponse.<Page<ProductDetailResponse>>builder()
            .result(response)
            .message("New products retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @GetMapping("/best-sellers")
    @Operation(summary = "Get best seller products")
    public APIResponse<Page<ProductDetailResponse>> getBestSellerProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        log.info("Getting best seller products");
        
        Page<ProductDetailResponse> response = productFilterService
            .getBestSellerProducts(page, size);
        
        return APIResponse.<Page<ProductDetailResponse>>builder()
            .result(response)
            .message("Best seller products retrieved successfully")
            .code(HttpStatus.OK.value())
            .build();
    }

    @PostMapping("/search/advanced")
    @Operation(summary = "Advanced search with filters")
    public APIResponse<Page<ProductDetailResponse>> searchProductsAdvanced(
            @RequestParam String keyword,
            @RequestBody(required = false) ProductFilterRequest additionalFilters) {
        
        log.info("Advanced search for products with keyword: {}", keyword);
        
        if (additionalFilters == null) {
            additionalFilters = ProductFilterRequest.builder().build();
        }
        
        Page<ProductDetailResponse> response = productFilterService
            .searchProductsAdvanced(keyword, additionalFilters);
        
        return APIResponse.<Page<ProductDetailResponse>>builder()
            .result(response)
            .message("Advanced search completed successfully")
            .code(HttpStatus.OK.value())
            .build();
    }
}