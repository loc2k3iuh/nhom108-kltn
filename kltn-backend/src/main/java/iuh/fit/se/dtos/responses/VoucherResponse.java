package iuh.fit.se.dtos.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Schema(description = "Response containing voucher information")
public class VoucherResponse {

  @Schema(description = "Voucher ID", example = "1")
  Long id;

  @Schema(description = "Voucher code", example = "SUMMER2024")
  String code;

  @Schema(description = "Voucher description")
  String description;

  @Schema(description = "Discount type")
  String discountType;

  @Schema(description = "Discount value")
  BigDecimal discountValue;

  @Schema(description = "Minimum order amount")
  BigDecimal minimumOrderAmount;

  @Schema(description = "Maximum discount amount")
  BigDecimal maximumDiscountAmount;

  @Schema(description = "Total usage limit")
  Integer usageLimit;

  @Schema(description = "Current usage count")
  Integer usedCount;

  @Schema(description = "Usage limit per user")
  Integer usageLimitPerUser;

  @Schema(description = "Voucher start date")
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  LocalDateTime startDate;

  @Schema(description = "Voucher end date")
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  LocalDateTime endDate;

  @Schema(description = "Whether voucher is active")
  Boolean isActive;

  @Schema(description = "Creation date")
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  LocalDateTime createdDate;
}
