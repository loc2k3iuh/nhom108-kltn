package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.ProductDiscountResponse;
import iuh.fit.se.entities.ProductDiscount;
import iuh.fit.se.enums.DiscountType;
import org.mapstruct.*;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {DiscountMapper.class})
public interface ProductDiscountMapper {

  @Mapping(target = "productId", source = "product.id")
  @Mapping(target = "productName", source = "product.name")
  @Mapping(target = "originalPrice", source = "product.basePrice")
  @Mapping(
      target = "discountedPrice",
      expression = "java(calculateDiscountedPrice(productDiscount))")
  @Mapping(target = "savedAmount", expression = "java(calculateSavedAmount(productDiscount))")
  ProductDiscountResponse toProductDiscountResponse(ProductDiscount productDiscount);

  default Double calculateDiscountedPrice(ProductDiscount productDiscount) {
    Double originalPrice = productDiscount.getProduct().getBasePrice();
    if (originalPrice == null || productDiscount.getDiscount() == null) {
      return originalPrice;
    }

    Double discountValue = productDiscount.getDiscount().getValue();
    DiscountType discountType = productDiscount.getDiscount().getDiscountType();

    if (discountType == DiscountType.PERCENT) {
      return originalPrice - (originalPrice * discountValue / 100);
    } else {
      return Math.max(0, originalPrice - discountValue);
    }
  }

  default Double calculateSavedAmount(ProductDiscount productDiscount) {
    Double originalPrice = productDiscount.getProduct().getBasePrice();
    Double discountedPrice = calculateDiscountedPrice(productDiscount);

    if (originalPrice == null || discountedPrice == null) {
      return 0.0;
    }

    return originalPrice - discountedPrice;
  }
}
