package iuh.fit.se.mapper;

import iuh.fit.se.dtos.responses.ReviewResponse;
import iuh.fit.se.entities.Review;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-11-18T07:28:15+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 24.0.2 (Oracle Corporation)")
@Component
public class ReviewMapperImpl implements ReviewMapper {

  @Autowired private ProductMapper productMapper;
  @Autowired private UserMapper userMapper;

  @Override
  public ReviewResponse toReviewResponse(Review review) {
    if (review == null) {
      return null;
    }

    ReviewResponse.ReviewResponseBuilder reviewResponse = ReviewResponse.builder();

    reviewResponse.createdDate(review.getCreatedDate());
    reviewResponse.updatedDate(review.getUpdatedDate());
    reviewResponse.id(review.getId());
    reviewResponse.rating(review.getRating());
    reviewResponse.comment(review.getComment());
    reviewResponse.product(productMapper.toProductDetailResponse(review.getProduct()));
    reviewResponse.user(userMapper.toUserResponse(review.getUser()));

    return reviewResponse.build();
  }
}
