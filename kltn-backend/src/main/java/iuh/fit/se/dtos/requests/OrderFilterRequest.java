package iuh.fit.se.dtos.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import iuh.fit.se.enums.OrderStatus;
import iuh.fit.se.enums.ShippingMethod;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderFilterRequest implements Serializable {

  Long id;

  List<OrderStatus> status;

  @JsonProperty("full_name")
  String fullName;

  @JsonProperty("phone_number")
  String phoneNumber;

  @JsonProperty("product_name")
  String productName;

  @JsonProperty("shipping_method")
  List<ShippingMethod> shippingMethod;

  @JsonProperty("shipped_date")
  LocalDateTime shippedDate;

  @JsonProperty("delivered_date")
  LocalDateTime deliveredDate;
}
