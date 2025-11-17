package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.CartItemResponse;
import iuh.fit.se.entities.CartItem;
import iuh.fit.se.services.interfaces.IPriceService;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-10T11:44:53+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 24.0.2 (Oracle Corporation)"
)
@Component
public class CartItemMapperImpl implements CartItemMapper {

    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private ProductVariantMapper productVariantMapper;

    @Override
    public CartItemResponse toCartItemResponse(CartItem cartItem, IPriceService priceService) {
        if ( cartItem == null ) {
            return null;
        }

        CartItemResponse.CartItemResponseBuilder cartItemResponse = CartItemResponse.builder();

        cartItemResponse.product( productMapper.toProductResponse( cartItem.getProduct() ) );
        cartItemResponse.productVariant( productVariantMapper.toProductVariantResponse( cartItem.getProductVariant() ) );
        cartItemResponse.id( cartItem.getId() );
        cartItemResponse.quantity( cartItem.getQuantity() );

        cartItemResponse.itemTotal( calculateItemTotal(cartItem, priceService) );

        return cartItemResponse.build();
    }
}
