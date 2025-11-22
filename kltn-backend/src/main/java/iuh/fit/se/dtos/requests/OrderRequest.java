package iuh.fit.se.dtos.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import iuh.fit.se.enums.OrderStatus;
import iuh.fit.se.enums.PaymentMethod;
import iuh.fit.se.enums.ShippingMethod;
import iuh.fit.se.enums.ShippingStatus;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {

  // Order status
  @JsonProperty("order_status")
  OrderStatus orderStatus;

  // Shipping information
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

  @JsonProperty("shipping_status")
  ShippingStatus shippingStatus;

  @JsonProperty("shipping_cost")
  BigDecimal shippingCost;

  @JsonProperty("tracking_code")
  String trackingCode;

  // Payment information
  @JsonProperty("payment_method")
  PaymentMethod paymentMethod;

  @JsonProperty("transaction_id")
  String transactionId;

  // Order note
  String note;

  // Note: We don't allow updating items or voucher code after order creation
  // Those require order cancellation and re-creation
}
