package iuh.fit.se.repositories;

import iuh.fit.se.entities.UserVoucher;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserVoucherRepository extends JpaRepository<UserVoucher, Long> {
  Optional<UserVoucher> findByUser_IdAndVoucher_Id(Long userId, Long voucherId);

  int countByUser_IdAndVoucher_Id(Long userId, Long voucherId);

  @Query(
      "SELECT COALESCE(SUM(uv.usageCount), 0) FROM UserVoucher uv "
          + "WHERE uv.user.id = :userId AND uv.voucher.id = :voucherId")
  Integer sumUsageCountByUserAndVoucher(
      @Param("userId") Long userId, @Param("voucherId") Long voucherId);
}
