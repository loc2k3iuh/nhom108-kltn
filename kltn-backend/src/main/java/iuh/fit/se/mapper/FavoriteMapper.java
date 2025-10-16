package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.FavoriteResponse;
import iuh.fit.se.entities.Favorite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
    componentModel = "spring",
    uses = {ProductMapper.class})
public interface FavoriteMapper {

  @Mapping(source = "user.id", target = "userId")
  @Mapping(source = "product", target = "product")
  FavoriteResponse toFavoriteResponse(Favorite favorite);
}
