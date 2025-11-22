package iuh.fit.se.dtos.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductResponse {
  Long id;
  String name;
  String description;
  Double basePrice;
  String status;
  CategoryResponse category;
  BrandResponse brand;
  List<ProductImageResponse> images;
  List<ProductVariantResponse> variants;
  Double averageRating;
  Integer totalReviews;
}
