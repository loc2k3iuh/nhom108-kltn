package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.VoucherResponse;
import iuh.fit.se.entities.Voucher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VoucherMapper {
  @Mapping(target = "discountType", expression = "java(voucher.getDiscountType().name())")
  @Mapping(target = "minimumOrderAmount", source = "minValueOrder")
  @Mapping(target = "maximumDiscountAmount", source = "maxDiscountValue")
  @Mapping(target = "usageLimitPerUser", source = "usagePerUser")
  @Mapping(target = "isActive", source = "active")
  @Mapping(target = "usedCount", constant = "0")
  VoucherResponse toVoucherResponse(Voucher voucher);
}
