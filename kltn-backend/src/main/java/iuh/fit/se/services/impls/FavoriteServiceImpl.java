package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.AddFavoriteRequest;
import iuh.fit.se.dtos.responses.FavoriteResponse;
import iuh.fit.se.entities.Favorite;
import iuh.fit.se.entities.Product;
import iuh.fit.se.entities.User;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.FavoriteMapper;
import iuh.fit.se.repositories.FavoriteRepository;
import iuh.fit.se.repositories.ProductRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.IFavoriteService;
import java.util.List;
import java.util.Optional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FavoriteServiceImpl implements IFavoriteService {

  FavoriteRepository favoriteRepository;
  UserRepository userRepository;
  ProductRepository productRepository;
  FavoriteMapper favoriteMapper;

  @Override
  @Transactional
  public FavoriteResponse addToFavorites(AddFavoriteRequest request, Long userId) {
    log.info("Adding product {} to favorites for user {}", request.getProductId(), userId);

    // Check if user exists
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    // Check if product exists
    Product product =
        productRepository
            .findById(request.getProductId())
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

    // Check if already in favorites
    Optional<Favorite> existingFavorite =
        favoriteRepository.findByUserIdAndProductId(userId, request.getProductId());
    if (existingFavorite.isPresent()) {
      throw new AppException(ErrorCode.PRODUCT_ALREADY_IN_FAVORITES);
    }

    // Create new favorite
    Favorite favorite = Favorite.builder().user(user).product(product).build();

    Favorite savedFavorite = favoriteRepository.save(favorite);
    log.info(
        "Successfully added product {} to favorites for user {}", request.getProductId(), userId);

    return favoriteMapper.toFavoriteResponse(savedFavorite);
  }

  @Override
  @Transactional
  public void removeFromFavorites(Long productId, Long userId) {
    log.info("Removing product {} from favorites for user {}", productId, userId);

    Favorite favorite =
        favoriteRepository
            .findByUserIdAndProductId(userId, productId)
            .orElseThrow(() -> new AppException(ErrorCode.FAVORITE_NOT_FOUND));

    favoriteRepository.delete(favorite);
    log.info("Successfully removed product {} from favorites for user {}", productId, userId);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<FavoriteResponse> getUserFavorites(Long userId, Pageable pageable) {
    log.info("Getting favorites for user {} with pagination", userId);

    // Verify user exists
    if (!userRepository.existsById(userId)) {
      throw new AppException(ErrorCode.USER_NOT_EXISTED);
    }

    Page<Favorite> favorites =
        favoriteRepository.findByUserIdOrderByCreatedDateDesc(userId, pageable);
    return favorites.map(favoriteMapper::toFavoriteResponse);
  }

  @Override
  @Transactional(readOnly = true)
  public List<FavoriteResponse> getUserFavoritesList(Long userId) {
    log.info("Getting all favorites for user {}", userId);

    // Verify user exists
    if (!userRepository.existsById(userId)) {
      throw new AppException(ErrorCode.USER_NOT_EXISTED);
    }

    List<Favorite> favorites = favoriteRepository.findByUserIdOrderByCreatedDateDesc(userId);
    return favorites.stream().map(favoriteMapper::toFavoriteResponse).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public boolean isProductFavorited(Long productId, Long userId) {
    return favoriteRepository.existsByUserIdAndProductId(userId, productId);
  }

  @Override
  @Transactional(readOnly = true)
  public long getUserFavoritesCount(Long userId) {
    return favoriteRepository.countByUserId(userId);
  }
}
