package iuh.fit.se.dtos.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderItemRequest {

  @JsonProperty("product_variant_id")
  Long productVariantId;

  @JsonProperty("quantity")
  Integer quantity;
}
