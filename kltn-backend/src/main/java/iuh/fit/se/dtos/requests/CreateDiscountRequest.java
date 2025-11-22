package iuh.fit.se.dtos.requests;

import iuh.fit.se.enums.DiscountType;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateDiscountRequest {

  @NotBlank(message = "Tên discount không được để trống")
  @Size(min = 3, max = 100, message = "Tên discount phải từ 3 đến 100 ký tự")
  String name;

  @NotNull(message = "Loại discount không được để trống")
  DiscountType discountType;

  @NotNull(message = "Giá trị discount không được để trống")
  @DecimalMin(value = "0.0", inclusive = false, message = "Giá trị discount phải lớn hơn 0")
  @DecimalMax(
      value = "100.0",
      message = "Giá trị discount phần trăm không được vượt quá 100%",
      groups = PercentValidation.class)
  Double value;

  @NotNull(message = "Ngày bắt đầu không được để trống")
  LocalDateTime startDate;

  @NotNull(message = "Ngày kết thúc không được để trống")
  LocalDateTime endDate;

  // Interface để group validation
  public interface PercentValidation {}
}
