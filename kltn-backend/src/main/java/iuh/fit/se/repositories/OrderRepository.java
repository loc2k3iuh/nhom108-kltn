package iuh.fit.se.repositories;

import iuh.fit.se.entities.Order;
import iuh.fit.se.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository
    extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

  Page<Order> findByUserId(Long userId, Pageable pageable);

  // Count orders by status and date range
  Long countByOrderStatusAndCreatedAtBetween(
      OrderStatus status, LocalDateTime startDate, LocalDateTime endDate);

  // Count orders by date range
  Long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

  // Get total revenue (finalAmount) for completed orders in date range
  @Query(
      "SELECT COALESCE(SUM(o.finalAmount), 0) FROM Order o "
          + "WHERE o.orderStatus = 'COMPLETED' "
          + "AND o.createdAt BETWEEN :startDate AND :endDate")
  BigDecimal getTotalRevenue(
      @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

  // Get total discount amount in date range
  @Query(
      "SELECT COALESCE(SUM(o.discountAmount), 0) FROM Order o "
          + "WHERE o.orderStatus = 'COMPLETED' "
          + "AND o.createdAt BETWEEN :startDate AND :endDate")
  BigDecimal getTotalDiscount(
      @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

  // Get total shipping cost in date range
  @Query(
      "SELECT COALESCE(SUM(s.shippingCost), 0) FROM Shipping s "
          + "WHERE s.order.orderStatus = 'COMPLETED' "
          + "AND s.order.createdAt BETWEEN :startDate AND :endDate")
  BigDecimal getTotalShippingCost(
      @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

  // Get revenue by day
  @Query(
      "SELECT DATE(o.createdAt) as date, COALESCE(SUM(o.finalAmount), 0) as revenue, "
          + "COUNT(o) as orderCount FROM Order o "
          + "WHERE o.orderStatus = 'COMPLETED' "
          + "AND o.createdAt BETWEEN :startDate AND :endDate "
          + "GROUP BY DATE(o.createdAt) "
          + "ORDER BY DATE(o.createdAt)")
  List<Object[]> getRevenueByDay(
      @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

  // Get revenue by month
  @Query(
      "SELECT YEAR(o.createdAt) as year, MONTH(o.createdAt) as month, "
          + "COALESCE(SUM(o.finalAmount), 0) as revenue, COUNT(o) as orderCount FROM Order o "
          + "WHERE o.orderStatus = 'COMPLETED' "
          + "AND o.createdAt BETWEEN :startDate AND :endDate "
          + "GROUP BY YEAR(o.createdAt), MONTH(o.createdAt) "
          + "ORDER BY YEAR(o.createdAt), MONTH(o.createdAt)")
  List<Object[]> getRevenueByMonth(
      @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

  // Get revenue by year
  @Query(
      "SELECT YEAR(o.createdAt) as year, COALESCE(SUM(o.finalAmount), 0) as revenue, "
          + "COUNT(o) as orderCount FROM Order o "
          + "WHERE o.orderStatus = 'COMPLETED' "
          + "AND o.createdAt BETWEEN :startDate AND :endDate "
          + "GROUP BY YEAR(o.createdAt) "
          + "ORDER BY YEAR(o.createdAt)")
  List<Object[]> getRevenueByYear(
      @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

  // Get total amount spent by user for completed orders
  @Query(
      "SELECT COALESCE(SUM(o.finalAmount), 0) FROM Order o "
          + "WHERE o.user.id = :userId "
          + "AND o.orderStatus = 'COMPLETED'")
  BigDecimal getTotalAmountByUserIdAndCompletedStatus(@Param("userId") Long userId);

  // Count total orders by user excluding cancelled orders
  @Query(
      "SELECT COUNT(o) FROM Order o "
          + "WHERE o.user.id = :userId "
          + "AND o.orderStatus != 'CANCELLED'")
  Long countOrdersByUserIdExcludingCancelled(@Param("userId") Long userId);
}
