package iuh.fit.se.repositories;

import iuh.fit.se.entities.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    @Query("SELECT COUNT(od) FROM OrderDetail od WHERE od.productVariant.product.id = :productId")
    Long countByProductId(@Param("productId") Long productId);
}
