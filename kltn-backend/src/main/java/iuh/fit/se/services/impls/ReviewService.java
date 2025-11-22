package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.CreateReviewRequest;
import iuh.fit.se.dtos.responses.ReviewResponse;
import iuh.fit.se.entities.Product;
import iuh.fit.se.entities.Review;
import iuh.fit.se.entities.User;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.ReviewMapper;
import iuh.fit.se.repositories.ProductRepository;
import iuh.fit.se.repositories.ReviewRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.IReviewService;
import java.util.List;
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
public class ReviewService implements IReviewService {

  ReviewRepository reviewRepository;
  UserRepository userRepository;
  ProductRepository productRepository;
  ReviewMapper reviewMapper;

  @Override
  @Transactional
  public ReviewResponse createReview(CreateReviewRequest request) {
    log.info(
        "Creating review for product ID: {} by user ID: {}",
        request.getProductId(),
        request.getUserId());

    // Validate user
    User user =
        userRepository
            .findById(request.getUserId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    // Validate product
    Product product =
        productRepository
            .findById(request.getProductId())
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

    // Check if user already reviewed this product
    if (reviewRepository.existsByUserIdAndProductId(request.getUserId(), request.getProductId())) {
      throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
    }

    Review review =
        Review.builder()
            .rating(request.getRating())
            .comment(request.getComment())
            .product(product)
            .user(user)
            .build();

    Review savedReview = reviewRepository.save(review);
    log.info("Review created successfully with ID: {}", savedReview.getId());

    return reviewMapper.toReviewResponse(savedReview);
  }

  @Override
  @Transactional
  public ReviewResponse updateReview(Long id, CreateReviewRequest request) {
    log.info("Updating review with ID: {}", id);

    Review review =
        reviewRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

    // Check if the user owns this review
    if (!review.getUser().getId().equals(request.getUserId())) {
      throw new AppException(ErrorCode.ACCESS_DENIED);
    }

    review.setRating(request.getRating());
    review.setComment(request.getComment());

    Review savedReview = reviewRepository.save(review);
    log.info("Review updated successfully with ID: {}", savedReview.getId());

    return reviewMapper.toReviewResponse(savedReview);
  }

  @Override
  @Transactional
  public void deleteReview(Long id) {
    log.info("Deleting review with ID: {}", id);

    if (!reviewRepository.existsById(id)) {
      throw new AppException(ErrorCode.REVIEW_NOT_FOUND);
    }

    reviewRepository.deleteById(id);
    log.info("Review deleted successfully with ID: {}", id);
  }

  @Override
  public ReviewResponse getReviewById(Long id) {
    log.info("Getting review with ID: {}", id);

    Review review =
        reviewRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));

    return reviewMapper.toReviewResponse(review);
  }

  @Override
  public Page<ReviewResponse> getReviewsByProduct(Long productId, Pageable pageable) {
    log.info("Getting reviews for product ID: {}", productId);

    Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);
    return reviews.map(reviewMapper::toReviewResponse);
  }

  @Override
  public Page<ReviewResponse> getReviewsByUser(Long userId, Pageable pageable) {
    log.info("Getting reviews for user ID: {}", userId);

    Page<Review> reviews = reviewRepository.findByUserId(userId, pageable);
    return reviews.map(reviewMapper::toReviewResponse);
  }

  @Override
  public Double getAverageRatingByProduct(Long productId) {
    log.info("Getting average rating for product ID: {}", productId);

    Double averageRating = reviewRepository.getAverageRatingByProductId(productId);
    return averageRating != null ? averageRating : 0.0;
  }

  @Override
  public Long getTotalReviewsByProduct(Long productId) {
    log.info("Getting total reviews count for product ID: {}", productId);

    return reviewRepository.countByProductId(productId);
  }

  @Override
  public boolean hasUserReviewedProduct(Long userId, Long productId) {
    log.info("Checking if user ID: {} has reviewed product ID: {}", userId, productId);

    return reviewRepository.existsByUserIdAndProductId(userId, productId);
  }

  @Override
  public List<ReviewResponse> getReviewsByProductAndRating(Long productId, Long rating) {
    log.info("Getting reviews for product ID: {} with rating: {}", productId, rating);

    List<Review> reviews = reviewRepository.findByProductIdAndRating(productId, rating);
    return reviews.stream().map(reviewMapper::toReviewResponse).toList();
  }
}
