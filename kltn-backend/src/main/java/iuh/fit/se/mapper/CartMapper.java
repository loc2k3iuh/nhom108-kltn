package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.CartResponse;
import iuh.fit.se.entities.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {UserMapper.class, CartItemMapper.class})
public interface CartMapper {
  @Mapping(target = "cartItems", ignore = true)
  @Mapping(target = "totalAmount", ignore = true)
  @Mapping(target = "totalItems", ignore = true)
  CartResponse toCartResponse(Cart cart);
}
