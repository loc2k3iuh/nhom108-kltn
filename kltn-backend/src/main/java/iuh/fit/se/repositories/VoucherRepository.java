package iuh.fit.se.repositories;

import iuh.fit.se.entities.Voucher;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {
  Optional<Voucher> findByCodeIgnoreCaseAndActiveIsTrue(String code);

  boolean existsByCodeIgnoreCase(String code);

  @Query(
      "SELECT COALESCE(SUM(uv.usageCount), 0) FROM UserVoucher uv WHERE uv.voucher.id = :voucherId")
  Integer sumTotalUsage(@Param("voucherId") Long voucherId);

  @Query(
      "SELECT v FROM Voucher v "
          + "WHERE (:keyword IS NULL OR :keyword = '' "
          + "OR LOWER(v.code) LIKE LOWER(CONCAT('%', :keyword, '%')) "
          + "OR LOWER(v.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) "
          + "AND (:discountType IS NULL OR v.discountType = :discountType)")
  Page<Voucher> findAllWithKeyword(
      @Param("keyword") String keyword,
      @Param("discountType") iuh.fit.se.enums.DiscountType discountType,
      Pageable pageable);

  @Query(
      "SELECT v FROM Voucher v "
          + "INNER JOIN UserVoucher uv ON uv.voucher.id = v.id "
          + "WHERE uv.user.id = :userId "
          + "AND v.active = true "
          + "AND (v.startDate IS NULL OR v.startDate <= CURRENT_TIMESTAMP) "
          + "AND (v.endDate IS NULL OR v.endDate >= CURRENT_TIMESTAMP) "
          + "AND (v.usagePerUser IS NULL OR v.usagePerUser > uv.usageCount) "
          + "AND (:keyword IS NULL OR :keyword = '' OR LOWER(v.code) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(v.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
  Page<Voucher> findAllAvailableForUser(
      @Param("userId") Long userId, @Param("keyword") String keyword, Pageable pageable);

  @Query(
      "SELECT v FROM Voucher v "
          + "WHERE v.active = true "
          + "AND (v.startDate IS NULL OR v.startDate <= CURRENT_TIMESTAMP) "
          + "AND (v.endDate IS NULL OR v.endDate >= CURRENT_TIMESTAMP) "
          + "AND (v.minValueOrder IS NULL OR v.minValueOrder <= :orderAmount) "
          + "AND (v.usageLimit IS NULL OR v.usageLimit > (SELECT COALESCE(SUM(uv_inner.usageCount), 0) FROM UserVoucher uv_inner WHERE uv_inner.voucher.id = v.id)) "
          + "AND (v.usagePerUser IS NULL OR v.usagePerUser > (SELECT COALESCE(SUM(uv_user.usageCount), 0) FROM UserVoucher uv_user WHERE uv_user.voucher.id = v.id AND uv_user.user.id = :userId)) "
          + "ORDER BY v.createdDate DESC")
  List<Voucher> findSuitableVouchersListForOrderAmount(
      @Param("userId") Long userId, @Param("orderAmount") java.math.BigDecimal orderAmount);
}
