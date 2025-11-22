package iuh.fit.se.repositories;

import iuh.fit.se.entities.ProductImage;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

  List<ProductImage> findByProductIdOrderBySortOrder(Long productId);

  List<ProductImage> findByProductIdOrderByDisplayOrderAsc(Long productId);

  Optional<ProductImage> findByProductIdAndIsMainTrue(Long productId);

  @Query("SELECT pi FROM ProductImage pi WHERE pi.product.id = :productId AND pi.isMain = true")
  Optional<ProductImage> findMainImageByProductId(@Param("productId") Long productId);

  List<ProductImage> findByProductId(Long productId);

  Long countByProductId(Long productId);
}
