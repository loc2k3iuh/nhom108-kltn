package iuh.fit.se.dtos.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetailRequest {
  @JsonProperty("order_id")
  private Long orderId;

  @JsonProperty("product_id")
  private Long productId;

  @JsonProperty("product_name")
  private String productName;

  @JsonProperty("quantity")
  private Long quantity;

  @JsonProperty("price")
  private Long price;

  @JsonProperty("image_url")
  private String imageUrl;

  @JsonProperty("stock_quantity")
  private Long stockQuantity;
}
