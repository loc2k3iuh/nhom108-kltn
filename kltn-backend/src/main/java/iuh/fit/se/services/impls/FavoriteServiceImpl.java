package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.AddFavoriteRequest;
import iuh.fit.se.dtos.requests.RemoveFavoriteRequest;
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
  public FavoriteResponse addToFavorites(AddFavoriteRequest request) {
    log.info("Adding product {} to favorites for user {}", request.getProductId(), request.getUserId());

    User user = userRepository.findById(request.getUserId())
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    Product product = productRepository.findById(request.getProductId())
        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

    if (favoriteRepository.existsByUserIdAndProductId(request.getUserId(), request.getProductId())) {
      throw new AppException(ErrorCode.PRODUCT_ALREADY_IN_FAVORITES);
    }

    Favorite favorite = Favorite.builder().user(user).product(product).build();
    Favorite savedFavorite = favoriteRepository.save(favorite);

    log.info("Successfully added product {} to favorites for user {}", request.getProductId(), request.getUserId());
    return favoriteMapper.toFavoriteResponse(savedFavorite);
  }

  @Override
  @Transactional
  public void removeFromFavorites(RemoveFavoriteRequest request) {
    log.info("Removing product {} from favorites for user {}", request.getProductId(), request.getUserId());

    Favorite favorite = favoriteRepository.findByUserIdAndProductId(request.getUserId(), request.getProductId())
        .orElseThrow(() -> new AppException(ErrorCode.FAVORITE_NOT_FOUND));

    favoriteRepository.delete(favorite);
    log.info("Successfully removed product {} from favorites for user {}", request.getProductId(), request.getUserId());
  }

  @Override
  @Transactional(readOnly = true)
  public Page<FavoriteResponse> getUserFavorites(Long userId, Pageable pageable) {
    log.info("Getting favorites for user {} with pagination", userId);
    if (!userRepository.existsById(userId)) {
      throw new AppException(ErrorCode.USER_NOT_EXISTED);
    }
    Page<Favorite> favorites = favoriteRepository.findByUserIdOrderByCreatedDateDesc(userId, pageable);
    return favorites.map(favoriteMapper::toFavoriteResponse);
  }

  @Override
  @Transactional(readOnly = true)
  public List<FavoriteResponse> getUserFavoritesList(Long userId) {
    log.info("Getting all favorites for user {}", userId);
    if (!userRepository.existsById(userId)) {
      throw new AppException(ErrorCode.USER_NOT_EXISTED);
    }
    List<Favorite> favorites = favoriteRepository.findByUserIdOrderByCreatedDateDesc(userId);
    return favorites.stream().map(favoriteMapper::toFavoriteResponse).toList();
  }

  @Override
  @Transactional(readOnly = true)
  public boolean isProductFavorited(Long productId, Long userId) {
    log.info("Checking if product {} is favorited by user {}", productId, userId);
    return favoriteRepository.existsByUserIdAndProductId(userId, productId);
  }

  @Override
  @Transactional(readOnly = true)
  public long getUserFavoritesCount(Long userId) {
    log.info("Counting favorites for user {}", userId);
    return favoriteRepository.countByUserId(userId);
  }
}
