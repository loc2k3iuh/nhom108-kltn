package iuh.fit.se.repositories;

import iuh.fit.se.entities.ConfirmationToken;
import iuh.fit.se.entities.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {
  Optional<ConfirmationToken> findByToken(String token);

  @Modifying
  @Transactional
  void deleteAllByUser(User user);

  @Modifying
  @Query("DELETE FROM ConfirmationToken t WHERE t.user.id = :userId")
  void deleteAllByUserId(@Param("userId") Long userId);
}
