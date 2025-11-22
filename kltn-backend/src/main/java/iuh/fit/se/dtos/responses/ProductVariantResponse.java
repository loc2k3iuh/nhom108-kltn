package iuh.fit.se.dtos.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductVariantResponse {
  Long id;
  String sku;
  Double price;
  Integer stockQuantity;
  String material;
  String imageUrl;
  SizeResponse size;
  ColorResponse color;
}
