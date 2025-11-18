package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.CartResponse;
import iuh.fit.se.entities.Cart;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-18T07:28:15+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 24.0.2 (Oracle Corporation)"
)
@Component
public class CartMapperImpl implements CartMapper {

    @Autowired
    private UserMapper userMapper;

    @Override
    public CartResponse toCartResponse(Cart cart) {
        if ( cart == null ) {
            return null;
        }

        CartResponse.CartResponseBuilder cartResponse = CartResponse.builder();

        cartResponse.id( cart.getId() );
        cartResponse.createdDate( cart.getCreatedDate() );
        cartResponse.updatedDate( cart.getUpdatedDate() );
        cartResponse.user( userMapper.toUserResponse( cart.getUser() ) );

        return cartResponse.build();
    }
}
