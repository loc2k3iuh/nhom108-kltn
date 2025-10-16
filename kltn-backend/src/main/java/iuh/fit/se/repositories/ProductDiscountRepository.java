package iuh.fit.se.repositories;

import iuh.fit.se.entities.ProductDiscount;
import iuh.fit.se.entities.ProductDiscountId;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDiscountRepository
    extends JpaRepository<ProductDiscount, ProductDiscountId> {

  @Query("SELECT pd FROM ProductDiscount pd WHERE pd.product.id = :productId")
  List<ProductDiscount> findByProductId(@Param("productId") Long productId);

  @Query("SELECT pd FROM ProductDiscount pd WHERE pd.discount.id = :discountId")
  List<ProductDiscount> findByDiscountId(@Param("discountId") Long discountId);

  @Query(
      "SELECT pd FROM ProductDiscount pd WHERE pd.product.id = :productId "
          + "AND pd.discount.startDate <= :now AND pd.discount.endDate >= :now")
  List<ProductDiscount> findActiveDiscountsByProductId(
      @Param("productId") Long productId, @Param("now") LocalDateTime now);

  @Query("SELECT pd FROM ProductDiscount pd WHERE pd.product.id = :productId " +
         "AND pd.discount.startDate <= CURRENT_TIMESTAMP AND pd.discount.endDate >= CURRENT_TIMESTAMP " +
         "ORDER BY pd.discount.value DESC")
  List<ProductDiscount> findTopActiveDiscountsByProductId(@Param("productId") Long productId, Pageable pageable);

  default Optional<ProductDiscount> findActiveDiscountByProductId(Long productId) {
    List<ProductDiscount> discounts = findTopActiveDiscountsByProductId(productId,
        org.springframework.data.domain.PageRequest.of(0, 1));
    return discounts.isEmpty() ? Optional.empty() : Optional.of(discounts.get(0));
  }

  // Xóa tất cả discount của một product
  @Modifying
  @Query("DELETE FROM ProductDiscount pd WHERE pd.product.id = :productId")
  void deleteByProductId(@Param("productId") Long productId);

  // Xóa tất cả product có discount cụ thể
  @Modifying
  @Query("DELETE FROM ProductDiscount pd WHERE pd.discount.id = :discountId")
  void deleteByDiscountId(@Param("discountId") Long discountId);

  // Kiểm tra xem product đã có discount này chưa
  boolean existsByProductIdAndDiscountId(Long productId, Long discountId);
}
