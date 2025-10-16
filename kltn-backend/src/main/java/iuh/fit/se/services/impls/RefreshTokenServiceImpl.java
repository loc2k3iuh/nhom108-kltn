package iuh.fit.se.services.impls;

import iuh.fit.se.entities.RefreshToken;
import iuh.fit.se.entities.User;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.repositories.RefreshTokenRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.IRefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RefreshTokenServiceImpl implements IRefreshTokenService {

  RefreshTokenRepository refreshTokenRepository;
  UserRepository userRepository;
  StringRedisTemplate stringRedisTemplate;

  @NonFinal
  @Value("${jwt.refresh-token.expiration-in-s}")
  protected int VALID_REFRESH_TOKEN_DURATION;

  @Override
  public RefreshToken createRefreshToken(Long userId, boolean isChecked) {
    SecureRandom random = new SecureRandom();
    byte[] bytes = new byte[64];
    random.nextBytes(bytes);
    String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    if (isChecked) {
      RefreshToken refreshToken = new RefreshToken();
      refreshToken.setUser(
          userRepository
              .findById(userId)
              .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
      Calendar calendar = Calendar.getInstance();
      calendar.add(Calendar.SECOND, VALID_REFRESH_TOKEN_DURATION);
      refreshToken.setExpiryDate(calendar.getTime());
      refreshToken.setToken(token);
      return refreshTokenRepository.save(refreshToken);
    } else {
      stringRedisTemplate.opsForValue().set("refresh-token: " + userId, token);
      return RefreshToken.builder().token(token).build();
    }
  }

  @Override
  public boolean isTokenExpired(RefreshToken token) {
    return token.getExpiryDate().before(new Date());
  }

  @Override
  public boolean deleteByToken(String token) {
    return refreshTokenRepository.deleteByToken(token) > 0;
  }

  @Override
  public Optional<RefreshToken> findByToken(String token) {
    return refreshTokenRepository.findByToken(token);
  }

  @Override
  public boolean deleteAllByUser(User user) {
    return refreshTokenRepository.deleteAllByUser(user) > 0;
  }

  @Override
  public void createRefreshTokenCookie(
      HttpServletResponse httpServletResponse, boolean isChecked, String refreshToken) {
    Cookie cookie = new Cookie("refresh_token", refreshToken);
    cookie.setHttpOnly(true);
    cookie.setSecure(true);
    cookie.setPath("/");
    if (isChecked) {
      cookie.setMaxAge(VALID_REFRESH_TOKEN_DURATION);
    }
    httpServletResponse.addCookie(cookie);
  }
}
