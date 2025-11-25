package iuh.fit.se.dtos.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import iuh.fit.se.dtos.requests.OrderDetailRequest;
import java.math.BigDecimal;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
  Long id;

  @JsonProperty("user_id")
  Long userId;

  @JsonProperty("full_name")
  String fullName;

  @JsonProperty("email")
  String email;

  @JsonProperty("phone_number")
  String phoneNumber;

  @JsonProperty("city")
  String city;

  @JsonProperty("district")
  String district;

  @JsonProperty("ward")
  String ward;

  @JsonProperty("address")
  String address;

  @JsonProperty("shipping_method")
  String shippingMethod;

  @JsonProperty("shipping_cost")
  Long shippingCost;

  @JsonProperty("payment_method")
  String paymentMethod;

  @JsonProperty("payment_status")
  String paymentStatus;

  @JsonProperty("discount_code")
  String discountCode;

  @JsonProperty("total_amount")
  BigDecimal totalAmount;

  @JsonProperty("discount_amount")
  BigDecimal discountAmount;

  @JsonProperty("final_amount")
  BigDecimal finalAmount;

  @JsonProperty("note")
  String note;

  @JsonProperty("status")
  String status;

  @JsonProperty("order_date")
  String orderDate;

  @JsonProperty("invoice_url")
  String invoiceUrl;

  @JsonProperty("order_details")
  private List<OrderDetailRequest> orderDetails;
}
