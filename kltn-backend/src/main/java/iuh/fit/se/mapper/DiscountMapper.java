package iuh.fit.se.mapper;

import iuh.fit.se.dtos.requests.CreateDiscountRequest;
import iuh.fit.se.dtos.requests.UpdateDiscountRequest;
import iuh.fit.se.dtos.responses.DiscountResponse;
import iuh.fit.se.entities.Discount;
import iuh.fit.se.enums.DiscountType;
import java.time.LocalDateTime;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DiscountMapper {

  @Mapping(target = "id", ignore = true)
  Discount toDiscount(CreateDiscountRequest request);

  @Mapping(target = "isActive", expression = "java(isDiscountActive(discount))")
  @Mapping(
      target = "formattedValue",
      expression = "java(formatDiscountValue(discount.getDiscountType(), discount.getValue()))")
  DiscountResponse toDiscountResponse(Discount discount);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  void updateDiscountFromRequest(UpdateDiscountRequest request, @MappingTarget Discount discount);

  default boolean isDiscountActive(Discount discount) {
    LocalDateTime now = LocalDateTime.now();
    return discount.getStartDate() != null
        && discount.getEndDate() != null
        && now.isAfter(discount.getStartDate())
        && now.isBefore(discount.getEndDate());
  }

  default String formatDiscountValue(DiscountType discountType, Double value) {
    if (value == null) return "";

    if (discountType == DiscountType.PERCENT) {
      return String.format("%.0f%%", value);
    } else {
      return String.format("%.0f VND", value);
    }
  }
}
