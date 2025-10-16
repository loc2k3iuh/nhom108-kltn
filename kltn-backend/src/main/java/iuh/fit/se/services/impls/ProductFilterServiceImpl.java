package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.ProductFilterRequest;
import iuh.fit.se.dtos.responses.ProductDetailResponse;
import iuh.fit.se.dtos.responses.ProductStatisticsResponse;
import iuh.fit.se.entities.Product;
import iuh.fit.se.enums.ProductStatus;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.ProductMapper;
import iuh.fit.se.repositories.*;
import iuh.fit.se.services.interfaces.IProductFilterService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductFilterServiceImpl implements IProductFilterService {

    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    BrandRepository brandRepository;
    SizeRepository sizeRepository;
    ColorRepository colorRepository;
    ProductMapper productMapper;

    @Override
    public Page<ProductDetailResponse> filterProducts(ProductFilterRequest filterRequest) {
        log.info("Filtering products with complex criteria");
        
        Pageable pageable = createPageable(filterRequest);
        
        // Convert filter request to parameters
        List<Long> categoryIds = filterRequest.getCategoryIds();
        List<Long> brandIds = filterRequest.getBrandIds();
        List<Long> sizeIds = filterRequest.getSizeIds();
        List<Long> colorIds = filterRequest.getColorIds();
        
        ProductStatus status = StringUtils.hasText(filterRequest.getStatus()) 
            ? ProductStatus.valueOf(filterRequest.getStatus().toUpperCase()) 
            : null;
        
        // Prepare additional params
        LocalDateTime newSinceDate = LocalDateTime.now().minusDays(30);
        Integer minFavoriteCount = filterRequest.getMinFavoriteCount();
        Integer minReviewCount = filterRequest.getMinReviewCount();
        Integer minOrderCount = filterRequest.getMinOrderCount();
        Double minAverageRating = filterRequest.getMinAverageRating() != null ? filterRequest.getMinAverageRating() : filterRequest.getMinRating();

        Page<Product> products;
        String sortBy = filterRequest.getSortBy() != null ? filterRequest.getSortBy() : "id";
        String sortDir = filterRequest.getSortDirection() != null ? filterRequest.getSortDirection() : "DESC";
        boolean isAggregateSort = "favoriteCount".equalsIgnoreCase(sortBy)
                || "reviewCount".equalsIgnoreCase(sortBy)
                || "orderCount".equalsIgnoreCase(sortBy)
                || "averageRating".equalsIgnoreCase(sortBy)
                || "basePrice".equalsIgnoreCase(sortBy)
                || "minPrice".equalsIgnoreCase(sortBy)
                || "maxPrice".equalsIgnoreCase(sortBy)
                || "currentDiscountPercent".equalsIgnoreCase(sortBy)
                || "discountedPrice".equalsIgnoreCase(sortBy)
                || "totalStock".equalsIgnoreCase(sortBy);

        if (isAggregateSort) {
            // Use custom ORDER BY with aggregates
            if ("ASC".equalsIgnoreCase(sortDir)) {
                products = productRepository.findProductsWithComplexFilterOrderByAggAsc(
                    categoryIds,
                    brandIds,
                    sizeIds,
                    colorIds,
                    filterRequest.getMinPrice(),
                    filterRequest.getMaxPrice(),
                    status,
                    filterRequest.getInStock(),
                    filterRequest.getHasDiscount(),
                    filterRequest.getKeyword(),
                    filterRequest.getMaterial(),
                    filterRequest.getIsFavorite(),
                    filterRequest.getUserId(),
                    filterRequest.getCategoryId(),
                    filterRequest.getIsNew(),
                    newSinceDate,
                    minFavoriteCount,
                    minReviewCount,
                    minOrderCount,
                    minAverageRating,
                    sortBy,
                    PageRequest.of(filterRequest.getPage(), filterRequest.getSize())
                );
            } else {
                products = productRepository.findProductsWithComplexFilterOrderByAggDesc(
                    categoryIds,
                    brandIds,
                    sizeIds,
                    colorIds,
                    filterRequest.getMinPrice(),
                    filterRequest.getMaxPrice(),
                    status,
                    filterRequest.getInStock(),
                    filterRequest.getHasDiscount(),
                    filterRequest.getKeyword(),
                    filterRequest.getMaterial(),
                    filterRequest.getIsFavorite(),
                    filterRequest.getUserId(),
                    filterRequest.getCategoryId(),
                    filterRequest.getIsNew(),
                    newSinceDate,
                    minFavoriteCount,
                    minReviewCount,
                    minOrderCount,
                    minAverageRating,
                    sortBy,
                    PageRequest.of(filterRequest.getPage(), filterRequest.getSize())
                );
            }
        } else {
            products = productRepository.findProductsWithComplexFilter(
                categoryIds,
                brandIds,
                sizeIds,
                colorIds,
                filterRequest.getMinPrice(),
                filterRequest.getMaxPrice(),
                status,
                filterRequest.getInStock(),
                filterRequest.getHasDiscount(),
                filterRequest.getKeyword(),
                filterRequest.getMaterial(),
                filterRequest.getIsFavorite(),
                filterRequest.getUserId(),
                filterRequest.getCategoryId(),
                filterRequest.getIsNew(),
                newSinceDate,
                minFavoriteCount,
                minReviewCount,
                minOrderCount,
                minAverageRating,
                pageable
            );
        }

        System.out.println("Filtered products count: " + products.getTotalElements());
        System.out.println("Filtered products count: " + products);

        
        return products.map(productMapper::toProductDetailResponse);
    }


    @Override
    public ProductDetailResponse getProductDetailById(Long id) {
        log.info("Getting product detail for ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return productMapper.toProductDetailResponse(product);
    }


    @Override
    public Page<ProductDetailResponse> getProductsByRootCategory(Long rootCategoryId, int page, int size, String sortBy, String sortDirection) {
        log.info("Getting products by root category: {}", rootCategoryId);
        
        if (!categoryRepository.existsById(rootCategoryId)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        
        Pageable pageable = createPageable(page, size, sortBy, sortDirection);
        Page<Product> products = productRepository.findByRootCategory(rootCategoryId, pageable);
        
        return products.map(productMapper::toProductDetailResponse);
    }

    @Override
    public Page<ProductDetailResponse> getProductsBySubCategory(Long subCategoryId, int page, int size, String sortBy, String sortDirection) {
        log.info("Getting products by subcategory: {}", subCategoryId);
        
        if (!categoryRepository.existsById(subCategoryId)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        
        Pageable pageable = createPageable(page, size, sortBy, sortDirection);
        Page<Product> products = productRepository.findByCategoryId(subCategoryId, pageable);
        
        return products.map(productMapper::toProductDetailResponse);
    }

    @Override
    public Page<ProductDetailResponse> getProductsByBrand(Long brandId, ProductFilterRequest additionalFilters) {
        log.info("Getting products by brand: {}", brandId);
        
        if (!brandRepository.existsById(brandId)) {
            throw new AppException(ErrorCode.BRAND_NOT_FOUND);
        }
        
        // Set brand filter
        if (additionalFilters.getBrandIds() == null) {
            additionalFilters.setBrandIds(List.of(brandId));
        } else if (!additionalFilters.getBrandIds().contains(brandId)) {
            additionalFilters.getBrandIds().add(brandId);
        }
        
        return filterProducts(additionalFilters);
    }

    @Override
    public Page<ProductDetailResponse> getProductsBySize(Long sizeId, ProductFilterRequest additionalFilters) {
        log.info("Getting products by size: {}", sizeId);
        
        if (!sizeRepository.existsById(sizeId)) {
            throw new AppException(ErrorCode.SIZE_NOT_FOUND);
        }
        
        // Set size filter
        if (additionalFilters.getSizeIds() == null) {
            additionalFilters.setSizeIds(List.of(sizeId));
        } else if (!additionalFilters.getSizeIds().contains(sizeId)) {
            additionalFilters.getSizeIds().add(sizeId);
        }
        
        return filterProducts(additionalFilters);
    }

    @Override
    public Page<ProductDetailResponse> getProductsByColor(Long colorId, ProductFilterRequest additionalFilters) {
        log.info("Getting products by color: {}", colorId);
        
        if (!colorRepository.existsById(colorId)) {
            throw new AppException(ErrorCode.COLOR_NOT_FOUND);
        }
        
        // Set color filter
        if (additionalFilters.getColorIds() == null) {
            additionalFilters.setColorIds(List.of(colorId));
        } else if (!additionalFilters.getColorIds().contains(colorId)) {
            additionalFilters.getColorIds().add(colorId);
        }
        
        return filterProducts(additionalFilters);
    }

    @Override
    public Page<ProductDetailResponse> getProductsWithDiscount(Double minDiscountPercent, Double maxDiscountPercent, int page, int size, String sortBy, String sortDirection) {
        log.info("Getting products with discount range: {} - {}", minDiscountPercent, maxDiscountPercent);
        
        Pageable pageable = createPageable(page, size, sortBy, sortDirection);
        Page<Product> products;
        
        if (minDiscountPercent != null && maxDiscountPercent != null) {
            products = productRepository.findProductsByDiscountRange(minDiscountPercent, maxDiscountPercent, pageable);
        } else {
            products = productRepository.findProductsWithActiveDiscount(pageable);
        }
        
        return products.map(productMapper::toProductDetailResponse);
    }

    @Override
    public Page<ProductDetailResponse> getFavoriteProducts(Long userId, int page, int size, String sortBy, String sortDirection) {
        log.info("Getting favorite products for user: {}", userId);
        
        Pageable pageable = createPageable(page, size, sortBy, sortDirection);
        Page<Product> products = productRepository.findFavoriteProductsByUserId(userId, pageable);
        
        return products.map(productMapper::toProductDetailResponse);
    }

    @Override
    public Page<ProductDetailResponse> getProductsByPriceRange(Double minPrice, Double maxPrice, int page, int size, String sortBy, String sortDirection) {
        log.info("Getting products by price range: {} - {}", minPrice, maxPrice);
        
        Pageable pageable = createPageable(page, size, sortBy, sortDirection);
        Page<Product> products = productRepository.findByPriceRange(minPrice, maxPrice, pageable);
        
        return products.map(productMapper::toProductDetailResponse);
    }

    @Override
    public Long countProductsByFilter(ProductFilterRequest filterRequest) {
        log.info("Counting products with filter criteria");
        
        // Use the same filter logic but count instead of paginate
        Pageable pageable = PageRequest.of(0, 1); // We only need count, not actual data
        
        // Prepare additional params
        LocalDateTime newSinceDate = LocalDateTime.now().minusDays(30);
        Integer minFavoriteCount = filterRequest.getMinFavoriteCount();
        Integer minReviewCount = filterRequest.getMinReviewCount();
        Integer minOrderCount = filterRequest.getMinOrderCount();
        Double minAverageRating = filterRequest.getMinAverageRating() != null ? filterRequest.getMinAverageRating() : filterRequest.getMinRating();

        Page<Product> products = productRepository.findProductsWithComplexFilter(
            filterRequest.getCategoryIds(),
            filterRequest.getBrandIds(),
            filterRequest.getSizeIds(),
            filterRequest.getColorIds(),
            filterRequest.getMinPrice(),
            filterRequest.getMaxPrice(),
            StringUtils.hasText(filterRequest.getStatus()) 
                ? ProductStatus.valueOf(filterRequest.getStatus().toUpperCase()) 
                : null,
            filterRequest.getInStock(),
            filterRequest.getHasDiscount(),
            filterRequest.getKeyword(),
            filterRequest.getMaterial(),
            filterRequest.getIsFavorite(),
            filterRequest.getUserId(),
            filterRequest.getCategoryId(),
            filterRequest.getIsNew(),
            newSinceDate,
            minFavoriteCount,
            minReviewCount,
            minOrderCount,
            minAverageRating,
            pageable
        );
        
        return products.getTotalElements();
    }

    @Override
    public ProductStatisticsResponse getProductStatistics() {
        log.info("Getting product statistics");
        
        // Basic counts
        Long totalProducts = productRepository.count();
        Long totalActiveProducts = productRepository.countByStatus(ProductStatus.ACTIVE);
        Long totalInStockProducts = productRepository.countInStockProducts();
        Long totalOutOfStockProducts = totalActiveProducts - totalInStockProducts;
        
        // Category statistics
        List<Object[]> categoryStats = productRepository.countProductsByCategory();
        Map<String, Long> productCountByCategory = categoryStats.stream()
            .collect(Collectors.toMap(
                row -> (String) row[0],
                row -> (Long) row[1]
            ));
        
        // Brand statistics
        List<Object[]> brandStats = productRepository.countProductsByBrand();
        Map<String, Long> productCountByBrand = brandStats.stream()
            .collect(Collectors.toMap(
                row -> (String) row[0],
                row -> (Long) row[1]
            ));
        
        // Size statistics
        List<Object[]> sizeStats = productRepository.countProductsBySize();
        Map<String, Long> productCountBySize = sizeStats.stream()
            .collect(Collectors.toMap(
                row -> (String) row[0],
                row -> (Long) row[1]
            ));
        
        // Color statistics
        List<Object[]> colorStats = productRepository.countProductsByColor();
        Map<String, Long> productCountByColor = colorStats.stream()
            .collect(Collectors.toMap(
                row -> (String) row[0],
                row -> (Long) row[1]
            ));
        
        // Price statistics
        Object[] priceStats = productRepository.getPriceStatistics();
        Double minPrice = (Double) priceStats[0];
        Double maxPrice = (Double) priceStats[1];
        Double averagePrice = (Double) priceStats[2];
        
        // Price range statistics
        Map<String, Long> priceRangeStats = calculatePriceRangeStatistics(minPrice, maxPrice);
        
        // Stock statistics
        Long totalStock = productRepository.getTotalStock();
        Double averageStockPerProduct = totalActiveProducts > 0 ? totalStock.doubleValue() / totalActiveProducts : 0.0;
        
        return ProductStatisticsResponse.builder()
            .totalProducts(totalProducts)
            .totalActiveProducts(totalActiveProducts)
            .totalInStockProducts(totalInStockProducts)
            .totalOutOfStockProducts(totalOutOfStockProducts)
            .productCountByCategory(productCountByCategory)
            .productCountByBrand(productCountByBrand)
            .productCountBySize(productCountBySize)
            .productCountByColor(productCountByColor)
            .minPrice(minPrice)
            .maxPrice(maxPrice)
            .averagePrice(averagePrice)
            .productCountByPriceRange(priceRangeStats)
            .totalStock(totalStock)
            .averageStockPerProduct(averageStockPerProduct)
            .build();
    }

    @Override
    public ProductStatisticsResponse getProductStatisticsByFilter(ProductFilterRequest filterRequest) {
        log.info("Getting product statistics by filter");
        
        // This would be a simplified version focusing on the filtered results
        Long filteredCount = countProductsByFilter(filterRequest);
        
        return ProductStatisticsResponse.builder()
            .totalProducts(filteredCount)
            .totalActiveProducts(filteredCount) // Assuming filtered results are active
            .build();
    }

    @Override
    public Page<ProductDetailResponse> getNewProducts(int page, int size, String sortBy, String sortDirection) {
        log.info("Getting new products");
        
        ProductFilterRequest filterRequest = ProductFilterRequest.builder()
            .isNew(true)
            .status("ACTIVE")
            .page(page)
            .size(size)
            .sortBy(sortBy)
            .sortDirection(sortDirection)
            .build();
        
        return filterProducts(filterRequest);
    }

    @Override
    public Page<ProductDetailResponse> getBestSellerProducts(int page, int size) {
        log.info("Getting best seller products");
        
        ProductFilterRequest filterRequest = ProductFilterRequest.builder()
            .isBestSeller(true)
            .status("ACTIVE")
            .page(page)
            .size(size)
            .sortBy("popularity")
            .sortDirection("DESC")
            .build();
        
        return filterProducts(filterRequest);
    }

    @Override
    public Page<ProductDetailResponse> searchProductsAdvanced(String keyword, ProductFilterRequest additionalFilters) {
        log.info("Advanced search for products with keyword: {}", keyword);
        
        additionalFilters.setKeyword(keyword);
        return filterProducts(additionalFilters);
    }

    // Helper methods
    private Pageable createPageable(ProductFilterRequest filterRequest) {
        return createPageable(
            filterRequest.getPage(),
            filterRequest.getSize(),
            filterRequest.getSortBy(),
            filterRequest.getSortDirection()
        );
    }

    private Pageable createPageable(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(sortBy != null ? sortBy : "id");
        if ("DESC".equalsIgnoreCase(sortDirection)) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }
        
        return PageRequest.of(page, size, sort);
    }

    private Map<String, Long> calculatePriceRangeStatistics(Double minPrice, Double maxPrice) {
        Map<String, Long> priceRangeStats = new HashMap<>();
        
        if (minPrice != null && maxPrice != null) {
            // Define price ranges based on min and max
            double range = (maxPrice - minPrice) / 4;
            
            priceRangeStats.put("0-" + String.format("%.0f", minPrice + range), 0L);
            priceRangeStats.put(String.format("%.0f", minPrice + range) + "-" + String.format("%.0f", minPrice + 2 * range), 0L);
            priceRangeStats.put(String.format("%.0f", minPrice + 2 * range) + "-" + String.format("%.0f", minPrice + 3 * range), 0L);
            priceRangeStats.put(String.format("%.0f", minPrice + 3 * range) + "+", 0L);
        }
        
        return priceRangeStats;
    }
}