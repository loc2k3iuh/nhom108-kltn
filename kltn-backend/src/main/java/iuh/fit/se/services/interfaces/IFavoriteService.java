package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.AddFavoriteRequest;
import iuh.fit.se.dtos.requests.RemoveFavoriteRequest;
import iuh.fit.se.dtos.responses.FavoriteResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IFavoriteService {

  /**
   * Adds a product to a user's favorites list.
   * @param request The request containing user and product IDs.
   * @return The created favorite entry.
   */
  FavoriteResponse addToFavorites(AddFavoriteRequest request);

  /**
   * Removes a product from a user's favorites list.
   * @param request The request containing user and product IDs.
   */
  void removeFromFavorites(RemoveFavoriteRequest request);

  /**
   * Retrieves a paginated list of a user's favorite products.
   * @param userId The ID of the user.
   * @param pageable Pagination information.
   * @return A page of favorite responses.
   */
  Page<FavoriteResponse> getUserFavorites(Long userId, Pageable pageable);

  /**
   * Retrieves a full list of a user's favorite products.
   * @param userId The ID of the user.
   * @return A list of favorite responses.
   */
  List<FavoriteResponse> getUserFavoritesList(Long userId);

  /**
   * Checks if a product is in a user's favorites list.
   * @param productId The ID of the product.
   * @param userId The ID of the user.
   * @return True if the product is favorited, false otherwise.
   */
  boolean isProductFavorited(Long productId, Long userId);

  /**
   * Counts the number of favorite products for a user.
   * @param userId The ID of the user.
   * @return The total count of favorites.
   */
  long getUserFavoritesCount(Long userId);
}
