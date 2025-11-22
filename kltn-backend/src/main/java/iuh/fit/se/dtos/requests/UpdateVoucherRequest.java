package iuh.fit.se.dtos.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Schema(description = "Request to update a voucher")
public class UpdateVoucherRequest {

  @Size(min = 3, max = 20, message = "Voucher code must be between 3 and 20 characters")
  @Schema(description = "Unique voucher code", example = "SUMMER2024")
  String code;

  @Size(max = 500, message = "Description cannot exceed 500 characters")
  @Schema(description = "Voucher description", example = "Summer sale voucher with 20% discount")
  String description;

  @Schema(description = "Type of discount (PERCENT or FIXED)", example = "PERCENT")
  String discountType;

  @DecimalMin(value = "0.01", message = "Discount value must be greater than 0")
  @Schema(
      description = "Discount value (percentage: 0.01-100, fixed amount: any positive value)",
      example = "20.0")
  BigDecimal discountValue;

  @DecimalMin(value = "0", message = "Minimum order amount cannot be negative")
  @Schema(description = "Minimum order amount to apply voucher", example = "100000")
  BigDecimal minimumOrderAmount;

  @DecimalMin(value = "0", message = "Maximum discount amount cannot be negative")
  @Schema(description = "Maximum discount amount (for percentage type)", example = "200000")
  BigDecimal maximumDiscountAmount;

  @Schema(description = "Total usage limit for this voucher", example = "1000")
  Integer usageLimit;

  @Schema(description = "Usage limit per user", example = "1")
  Integer usageLimitPerUser;

  @Schema(description = "Voucher start date", example = "2024-06-01T00:00:00")
  LocalDateTime startDate;

  @Schema(description = "Voucher end date", example = "2024-08-31T23:59:59")
  LocalDateTime endDate;

  @Schema(description = "Whether voucher is active", example = "true")
  Boolean active;

  @Schema(description = "List of user IDs who can use this voucher (empty for all users)")
  List<Long> eligibleUserIds;

  @Schema(description = "List of product IDs this voucher applies to (empty for all products)")
  List<Long> applicableProductIds;

  @Schema(description = "List of category IDs this voucher applies to")
  List<Long> applicableCategoryIds;
}
