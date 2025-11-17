package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.FavoriteResponse;
import iuh.fit.se.entities.Favorite;
import iuh.fit.se.entities.User;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-10T11:44:53+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 24.0.2 (Oracle Corporation)"
)
@Component
public class FavoriteMapperImpl implements FavoriteMapper {

    @Autowired
    private ProductMapper productMapper;

    @Override
    public FavoriteResponse toFavoriteResponse(Favorite favorite) {
        if ( favorite == null ) {
            return null;
        }

        FavoriteResponse.FavoriteResponseBuilder favoriteResponse = FavoriteResponse.builder();

        favoriteResponse.userId( favoriteUserId( favorite ) );
        favoriteResponse.product( productMapper.toProductResponse( favorite.getProduct() ) );
        favoriteResponse.id( favorite.getId() );
        favoriteResponse.createdDate( favorite.getCreatedDate() );

        return favoriteResponse.build();
    }

    private Long favoriteUserId(Favorite favorite) {
        User user = favorite.getUser();
        if ( user == null ) {
            return null;
        }
        return user.getId();
    }
}
