package iuh.fit.se.dtos.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TopProductResponse {
  Long productId;
  String productName;
  String imageUrl;
  Long totalQuantitySold;
  Double basePrice;
  String categoryName;
  String brandName;
}
