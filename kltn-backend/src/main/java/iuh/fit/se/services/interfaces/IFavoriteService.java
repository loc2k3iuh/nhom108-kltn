package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.AddFavoriteRequest;
import iuh.fit.se.dtos.responses.FavoriteResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IFavoriteService {

  FavoriteResponse addToFavorites(AddFavoriteRequest request, Long userId);

  void removeFromFavorites(Long productId, Long userId);

  Page<FavoriteResponse> getUserFavorites(Long userId, Pageable pageable);

  List<FavoriteResponse> getUserFavoritesList(Long userId);

  boolean isProductFavorited(Long productId, Long userId);

  long getUserFavoritesCount(Long userId);
}
