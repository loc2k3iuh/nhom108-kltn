package iuh.fit.se.dtos.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductDiscountResponse {

  Long productId;
  String productName;
  DiscountResponse discount;
  Double originalPrice;
  Double discountedPrice;
  Double savedAmount;
}
