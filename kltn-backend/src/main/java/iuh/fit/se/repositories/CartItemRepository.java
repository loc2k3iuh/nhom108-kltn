package iuh.fit.se.repositories;

import iuh.fit.se.entities.CartItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

  List<CartItem> findByCartId(Long cartId);

  Optional<CartItem> findByCartIdAndProductIdAndProductVariantId(
      Long cartId, Long productId, Long productVariantId);

  Optional<CartItem> findByCartIdAndProductIdAndProductVariantIsNull(Long cartId, Long productId);

  @Query("SELECT ci FROM CartItem ci WHERE ci.cart.user.id = :userId")
  List<CartItem> findByUserId(@Param("userId") Long userId);

  @Query("SELECT COALESCE(SUM(ci.quantity), 0) FROM CartItem ci WHERE ci.cart.id = :cartId")
  Long countItemsByCartId(@Param("cartId") Long cartId);

  @Query(
      "SELECT COALESCE(SUM(ci.quantity * "
          + "CASE WHEN ci.productVariant IS NOT NULL THEN ci.productVariant.price "
          + "ELSE ci.product.basePrice END), 0.0) "
          + "FROM CartItem ci WHERE ci.cart.id = :cartId")
  Double calculateCartTotal(@Param("cartId") Long cartId);

  void deleteByCartId(Long cartId);

  Long countByCartId(Long cartId);

  boolean existsByCartIdAndProductIdAndProductVariantId(
      Long cartId, Long productId, Long productVariantId);

  boolean existsByCartIdAndProductIdAndProductVariantIsNull(Long cartId, Long productId);
}
