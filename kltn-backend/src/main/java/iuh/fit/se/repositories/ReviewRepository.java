package iuh.fit.se.repositories;

import iuh.fit.se.entities.Review;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

  Page<Review> findByProductId(Long productId, Pageable pageable);

  Page<Review> findByUserId(Long userId, Pageable pageable);

  Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

  boolean existsByUserIdAndProductId(Long userId, Long productId);

  @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
  Double getAverageRatingByProductId(@Param("productId") Long productId);

  @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
  Long countByProductId(@Param("productId") Long productId);

  @Query("SELECT r FROM Review r WHERE r.product.id = :productId AND r.rating = :rating")
  List<Review> findByProductIdAndRating(
      @Param("productId") Long productId, @Param("rating") Long rating);

  List<Review> findByProductId(Long productId);
}
