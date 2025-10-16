package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.Min;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductFilterRequest {
    
    // Category filters
    Long categoryId;
    List<Long> categoryIds;
    String categoryType; // ROOT, SUBCATEGORY
    
    // Brand filter
    List<Long> brandIds;
    
    // Size and Color filters
    List<Long> sizeIds;
    List<Long> colorIds;
    
    // Price range
    Double minPrice;
    Double maxPrice;
    
    // Discount filters
    Boolean hasDiscount;
    Double minDiscountPercent;
    Double maxDiscountPercent;
    
    // Status filters
    String status; // ACTIVE, INACTIVE, OUT_OF_STOCK
    Boolean inStock;
    
    // Search keyword
    String keyword;
    
    // Favorite filter (for logged in users)
    Boolean isFavorite;
    Long userId; // for favorite filtering
    
    // Sorting options
    String sortBy; // price, name, createdDate, discount, popularity
    String sortDirection; // ASC, DESC
    
    // Pagination
    @Min(0)
    Integer page = 0;
    
    @Min(1)
    Integer size = 10;
    
    // Additional filters
    String material;
    Boolean isNew; // products created in last 30 days
    Boolean isBestSeller; // products with high sales
    Double minRating; // minimum average rating
    // New aggregate filters (thresholds)
    Integer minFavoriteCount; // minimum number of favorites
    Integer minReviewCount; // minimum number of reviews
    Integer minOrderCount; // minimum number of orders
    Double minAverageRating; // minimum average rating (alias of minRating if provided)
}