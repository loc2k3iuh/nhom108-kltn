package iuh.fit.se.dtos.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartResponse {
  Long id;
  LocalDateTime createdDate;
  LocalDateTime updatedDate;
  UserResponse user;
  List<CartItemResponse> cartItems;
  Double totalAmount;
  Integer totalItems;
}
