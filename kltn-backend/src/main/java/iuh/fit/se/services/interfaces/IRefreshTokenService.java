package iuh.fit.se.services.interfaces;

import iuh.fit.se.entities.RefreshToken;
import iuh.fit.se.entities.User;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Optional;

public interface IRefreshTokenService {
  RefreshToken createRefreshToken(Long userId, boolean isChecked);

  boolean isTokenExpired(RefreshToken token);

  boolean deleteByToken(String token);

  Optional<RefreshToken> findByToken(String token);

  boolean deleteAllByUser(User user);

  void createRefreshTokenCookie(
      HttpServletResponse httpServletResponse, boolean isChecked, String refreshToken);
}
