package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.CreateReviewRequest;
import iuh.fit.se.dtos.responses.ReviewResponse;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IReviewService {
  ReviewResponse createReview(CreateReviewRequest request);

  ReviewResponse updateReview(Long id, CreateReviewRequest request);

  void deleteReview(Long id);

  ReviewResponse getReviewById(Long id);

  Page<ReviewResponse> getReviewsByProduct(Long productId, Pageable pageable);

  Page<ReviewResponse> getReviewsByUser(Long userId, Pageable pageable);

  Double getAverageRatingByProduct(Long productId);

  Long getTotalReviewsByProduct(Long productId);

  boolean hasUserReviewedProduct(Long userId, Long productId);

  List<ReviewResponse> getReviewsByProductAndRating(Long productId, Long rating);
}
