package iuh.fit.se.repositories;

import iuh.fit.se.entities.RefreshToken;
import iuh.fit.se.entities.User;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
  Optional<RefreshToken> findByUser(User user);

  Optional<RefreshToken> findByToken(String token);

  List<RefreshToken> findAllByUser(User user);

  int deleteByToken(String token);

  int deleteAllByUser(User user);

  int deleteByExpiryDateBefore(Date now);
}
