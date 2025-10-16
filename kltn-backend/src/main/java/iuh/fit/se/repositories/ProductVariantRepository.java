package iuh.fit.se.repositories;

import iuh.fit.se.entities.ProductVariant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

  List<ProductVariant> findByProductId(Long productId);

  List<ProductVariant> findByProductIdAndStockQuantityGreaterThan(
      Long productId, Integer stockQuantity);

  Optional<ProductVariant> findByProductIdAndSizeIdAndColorId(
      Long productId, Long sizeId, Long colorId);

  @Query(
      "SELECT pv FROM ProductVariant pv WHERE pv.product.id = :productId AND pv.stockQuantity > 0")
  List<ProductVariant> findAvailableVariantsByProductId(@Param("productId") Long productId);

  @Query("SELECT pv FROM ProductVariant pv WHERE pv.sku = :sku")
  Optional<ProductVariant> findBySku(@Param("sku") String sku);

  @Query("SELECT SUM(pv.stockQuantity) FROM ProductVariant pv WHERE pv.product.id = :productId")
  Integer getTotalStockByProductId(@Param("productId") Long productId);
}
