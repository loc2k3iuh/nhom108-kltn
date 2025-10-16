package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.CartItemResponse;
import iuh.fit.se.entities.CartItem;
import iuh.fit.se.services.interfaces.IPriceService;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {ProductMapper.class, ProductVariantMapper.class, IPriceService.class})
public interface CartItemMapper {

  @Mapping(target = "product", source = "product")
  @Mapping(target = "productVariant", source = "productVariant")
  @Mapping(target = "itemTotal", expression = "java(calculateItemTotal(cartItem, priceService))")
  CartItemResponse toCartItemResponse(CartItem cartItem, @Context IPriceService priceService);

  @Named("calculateItemTotal")
  default Double calculateItemTotal(CartItem cartItem, @Context IPriceService priceService) {
    if (cartItem == null || cartItem.getQuantity() == null) {
      return 0.0;
    }

    double finalPrice = priceService.getFinalPrice(cartItem.getProduct(), cartItem.getProductVariant());

    return finalPrice * cartItem.getQuantity();
  }
}
