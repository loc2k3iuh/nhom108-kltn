package iuh.fit.se.dtos.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductStatisticsResponse {
    
    // Total counts
    Long totalProducts;
    Long totalActiveProducts;
    Long totalInStockProducts;
    Long totalOutOfStockProducts;
    
    // Category statistics
    Map<String, Long> productCountByCategory;
    Map<String, Long> productCountByRootCategory;
    
    // Brand statistics
    Map<String, Long> productCountByBrand;
    
    // Price range statistics
    Double minPrice;
    Double maxPrice;
    Double averagePrice;
    Map<String, Long> productCountByPriceRange; // "0-100", "100-500", "500-1000", "1000+"
    
    // Size and Color statistics
    Map<String, Long> productCountBySize;
    Map<String, Long> productCountByColor;
    
    // Discount statistics
    Long productsWithDiscount;
    Long productsWithoutDiscount;
    Double averageDiscountPercent;
    
    // Stock statistics
    Long totalStock;
    Double averageStockPerProduct;
    
    // Filter availability
    List<FilterOptionResponse> availableCategories;
    List<FilterOptionResponse> availableBrands;
    List<FilterOptionResponse> availableSizes;
    List<FilterOptionResponse> availableColors;
    List<FilterOptionResponse> availableMaterials;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class FilterOptionResponse {
        Long id;
        String name;
        String value;
        Long count;
        Boolean available;
    }
}