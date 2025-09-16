package iuh.fit.se.services.interfaces;

import iuh.fit.se.entities.RefreshToken;
import iuh.fit.se.entities.User;
import java.util.Optional;

public interface IRefreshTokenService {
  RefreshToken createRefreshToken(Long userId);

  boolean isTokenExpired(RefreshToken token);

  boolean deleteByToken(String token);

  Optional<RefreshToken> findByToken(String token);

  boolean deleteAllByUser(User user);
}
