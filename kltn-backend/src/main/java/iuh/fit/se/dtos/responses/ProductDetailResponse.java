package iuh.fit.se.dtos.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDetailResponse {
    
    Long id;
    String name;
    String description;
    Double basePrice;
    String status;
    
    // Category information
    CategoryResponse category;
    CategoryResponse rootCategory;
    List<CategoryResponse> categoryPath; // Full path from root to current category
    
    // Brand information
    BrandResponse brand;
    
    // Product variants with all combinations
    List<ProductVariantResponse> variants;
    
    // Available sizes and colors
    List<SizeResponse> availableSizes;
    List<ColorResponse> availableColors;
    List<String> availableMaterials;
    
    // Price information
    Double minPrice;
    Double maxPrice;
    Double currentDiscountPercent;
    Double discountedPrice;
    
    // Stock information
    Integer totalStock;
    Boolean inStock;
    
    // Images
    List<String> imageUrls;
    String primaryImageUrl;

    // Additional metadata
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    Boolean isNew;
    Integer favoriteCount;
    Integer reviewCount;
    Integer orderCount;
    Double averageRating;
    
    // SEO and additional info
    String slug;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class CategoryResponse {
        Long id;
        String name;
        String description;
        Long parentId;
        String parentName;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class BrandResponse {
        Long id;
        String name;
        String description;
        String logoUrl;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ProductVariantResponse {
        Long id;
        String sku;
        Double price;
        Integer stockQuantity;
        String material;
        String imageUrl;
        SizeResponse size;
        ColorResponse color;
        Boolean inStock;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class SizeResponse {
        Long id;
        String name;
        String description;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ColorResponse {
        Long id;
        String name;
        String hexCode;
        String description;
    }
}