package iuh.fit.se.repositories;

import iuh.fit.se.entities.Discount;
import iuh.fit.se.enums.DiscountType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long> {

  Optional<Discount> findByName(String name);

  @Query("SELECT d FROM Discount d WHERE d.startDate <= :now AND d.endDate >= :now")
  List<Discount> findActiveDiscounts(@Param("now") LocalDateTime now);

  List<Discount> findByDiscountType(DiscountType discountType);

  @Query("SELECT d FROM Discount d WHERE d.startDate >= :startDate AND d.endDate <= :endDate")
  Page<Discount> findByDateRange(
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate,
      Pageable pageable);

  @Query(
      "SELECT CASE WHEN COUNT(pd) > 0 THEN true ELSE false END FROM ProductDiscount pd WHERE pd.discount.id = :discountId")
  boolean isDiscountInUse(@Param("discountId") Long discountId);

  @Query("SELECT d FROM Discount d WHERE d.endDate BETWEEN :now AND :endTime")
  List<Discount> findExpiringSoon(
      @Param("now") LocalDateTime now, @Param("endTime") LocalDateTime endTime);
}
