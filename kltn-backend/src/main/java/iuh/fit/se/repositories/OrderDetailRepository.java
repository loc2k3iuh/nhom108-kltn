package iuh.fit.se.repositories;

import iuh.fit.se.entities.OrderDetail;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

  @Query("SELECT COUNT(od) FROM OrderDetail od WHERE od.productVariant.product.id = :productId")
  Long countByProductId(@Param("productId") Long productId);

  List<OrderDetail> findByOrderId(Long orderId);

  @Query(
      "SELECT p.id, p.name, MIN(pv.imageUrl), SUM(od.quantity), p.basePrice, c.name, b.name "
          + "FROM OrderDetail od "
          + "JOIN od.productVariant pv "
          + "JOIN pv.product p "
          + "LEFT JOIN p.category c "
          + "LEFT JOIN p.brand b "
          + "JOIN od.order o "
          + "WHERE o.orderStatus = 'COMPLETED' "
          + "GROUP BY p.id, p.name, p.basePrice, c.name, b.name "
          + "ORDER BY SUM(od.quantity) DESC "
          + "LIMIT 10")
  List<Object[]> findTop10BestSellingProducts();
}
