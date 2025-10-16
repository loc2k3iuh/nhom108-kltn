package iuh.fit.se.repositories;

import iuh.fit.se.entities.Favorite;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

  Page<Favorite> findByUserId(Long userId, Pageable pageable);

  Page<Favorite> findByUserIdOrderByCreatedDateDesc(Long userId, Pageable pageable);

  Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId);

  boolean existsByUserIdAndProductId(Long userId, Long productId);

  void deleteByUserIdAndProductId(Long userId, Long productId);

  long countByUserId(Long userId);

  @Query("SELECT COUNT(f) FROM Favorite f WHERE f.product.id = :productId")
  Long countByProductId(@Param("productId") Long productId);

  @Query("SELECT f FROM Favorite f WHERE f.user.id = :userId ORDER BY f.createdDate DESC")
  List<Favorite> findByUserIdOrderByCreatedDateDesc(@Param("userId") Long userId);
}
