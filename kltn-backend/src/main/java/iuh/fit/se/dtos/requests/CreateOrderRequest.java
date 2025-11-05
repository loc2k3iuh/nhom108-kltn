package iuh.fit.se.dtos.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import iuh.fit.se.enums.PaymentMethod;
import iuh.fit.se.enums.ShippingMethod;
import java.math.BigDecimal;
import java.util.List;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderRequest {

  @JsonProperty("user_id")
  Long userId;

  // Receiver & address info
  @JsonProperty("receiver_name")
  String receiverName;

  @JsonProperty("receiver_phone")
  String receiverPhone;

  String city;
  String district;
  String ward;
  String address;

  @JsonProperty("shipping_method")
  ShippingMethod shippingMethod;

  @JsonProperty("shipping_cost")
  BigDecimal shippingFee;

  @JsonProperty("payment_method")
  PaymentMethod paymentMethod;

  String note;

  @JsonProperty("discount_code")
  String discountCode;

  List<CreateOrderItemRequest> items;
}
