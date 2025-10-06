package iuh.fit.se.services.impls;

import com.nimbusds.jose.JOSEException;
import iuh.fit.se.dtos.requests.*;
import iuh.fit.se.dtos.responses.LoginResponse;
import iuh.fit.se.dtos.responses.PreLoginResponse;
import iuh.fit.se.dtos.responses.TokenResponse;
import iuh.fit.se.entities.InvalidatedToken;
import iuh.fit.se.entities.RefreshToken;
import iuh.fit.se.entities.User;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.UserMapper;
import iuh.fit.se.repositories.InvalidatedTokenRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.IAuthenticationService;
import iuh.fit.se.services.interfaces.IEmailService;
import iuh.fit.se.services.interfaces.IJwtService;
import iuh.fit.se.services.interfaces.IRefreshTokenService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements IAuthenticationService {

  UserMapper userMapper;
  IJwtService iJwtService;
  IEmailService iEmailService;
  UserRepository userRepository;
  StringRedisTemplate stringRedisTemplate;
  IRefreshTokenService iRefreshTokenService;
  InvalidatedTokenRepository invalidatedTokenRepository;

  private boolean isGmailAddress(String email) {
    String regex = "^[A-Za-z0-9._%+-]+@gmail\\.com$";
    return email != null && email.matches(regex);
  }

  @Override
  public PreLoginResponse authenticate(LoginRequest loginRequest) throws MessagingException {
    User user =
        (!isGmailAddress(loginRequest.getUsername())
                ? userRepository.findByUsername(loginRequest.getUsername())
                : userRepository.findByEmail(loginRequest.getUsername()))
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    List<Map.Entry<Predicate<User>, ErrorCode>> rules =
        List.of(
            Map.entry(
                u -> passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()),
                ErrorCode.UNAUTHENTICATED),
            Map.entry(User::getEnabled, ErrorCode.USER_DISABLED),
            Map.entry(User::getIsActive, ErrorCode.USER_INACTIVATED));

    rules.stream()
        .filter(rule -> !rule.getKey().test(user))
        .findFirst()
        .ifPresent(
            rule -> {
              throw new AppException(rule.getValue());
            });

    iEmailService.sentOtp(user);
    return userMapper.toPreLoginResponse(user);
  }

  @Override
  public LoginResponse verifyOtp(
      VerifyOtpRequest verifyOtpRequest, boolean isChecked, HttpServletResponse httpServletResponse)
      throws JOSEException {
    boolean isValidOtp = iEmailService.verifyOtp(verifyOtpRequest);
    if (!isValidOtp) {
      throw new AppException(ErrorCode.OTP_NOT_FOUND);
    }
    User user =
        userRepository
            .findByEmail(verifyOtpRequest.getEmail())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    String accessToken = iJwtService.generateToken(user);
    RefreshToken refreshToken = iRefreshTokenService.createRefreshToken(user.getId(), isChecked);

    iRefreshTokenService.createRefreshTokenCookie(
        httpServletResponse, isChecked, refreshToken.getToken());
    return LoginResponse.builder().authenticated(true).accessToken(accessToken).build();
  }

  @Override
  public void resendOtp(ResenOtpRequest resenOtpRequest) throws MessagingException {
    iEmailService.resendOtp(resenOtpRequest);
  }

  @Override
  public boolean introspect(IntrospectRequest request) throws JOSEException, ParseException {
    var token = request.getToken();
    boolean isValid = true;
    try {
      iJwtService.verifyToken(token);
    } catch (AppException e) {
      isValid = false;
    }

    return isValid;
  }

  @Override
  @Transactional
  public void logout(LogoutRequest logoutRequest, String refreshToken)
      throws ParseException, JOSEException {
    try {
      var signToken = iJwtService.verifyToken(logoutRequest.getToken());
      String jit = signToken.getJWTClaimsSet().getJWTID();
      Date expiryDate = signToken.getJWTClaimsSet().getExpirationTime();

      invalidatedTokenRepository.save(
          InvalidatedToken.builder().expiryTime(expiryDate).id(jit).build());

      Optional.ofNullable(refreshToken).ifPresent(iRefreshTokenService::deleteByToken);

      String userId = "refresh-token: " + signToken.getJWTClaimsSet().getLongClaim("userId");
      if (stringRedisTemplate.opsForValue().get(userId) != null) {
        stringRedisTemplate.delete(userId);
      }

    } catch (AppException e) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }
  }

  @Override
  @Transactional
  public TokenResponse refreshAccessToken(RefreshRequest refreshRequest, String userId)
      throws JOSEException {
    Optional<RefreshToken> refreshToken =
        iRefreshTokenService.findByToken(refreshRequest.getRefreshToken());

    if (refreshToken.isPresent()) {
      if (iRefreshTokenService.isTokenExpired(refreshToken.get())) {
        iRefreshTokenService.deleteByToken(refreshRequest.getRefreshToken());
        throw new AppException(ErrorCode.REFRESH_TOKEN_INVALID);
      }
      return TokenResponse.builder()
          .token(iJwtService.generateToken(refreshToken.get().getUser()))
          .build();
    } else {
      User user =
          userRepository
              .findById(Long.valueOf(userId))
              .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
      String refreshTokenRedis =
          stringRedisTemplate.opsForValue().get(String.valueOf(user.getId()));
      assert refreshTokenRedis != null;
      if (!refreshTokenRedis.equals(refreshRequest.getRefreshToken())) {
        throw new AppException(ErrorCode.REFRESH_TOKEN_INVALID);
      }
      return TokenResponse.builder().token(iJwtService.generateToken(user)).build();
    }
  }

  @Override
  public void deleteRefreshTokenFromRedis(String userId) {
    String userIdKey = "refresh-token: " + userId;
    if (stringRedisTemplate.opsForValue().get(userIdKey) != null) {
      stringRedisTemplate.delete(userIdKey);
    }
  }

  @Override
  public void sendForgotPassword(String email, boolean isAdminPage) throws MessagingException {
    iEmailService.sendForgotPasswordToken(email, isAdminPage);
  }

  @Override
  @Transactional
  public void verifyResetToken(VerifyResetTokenRequest verifyResetTokenRequest) {
    User existUser =
        userRepository
            .findByEmail(verifyResetTokenRequest.getEmail())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    String resetToken = stringRedisTemplate.opsForValue().get("reset-token: " + existUser.getId());

    if (resetToken == null || resetToken.isBlank()) {
      throw new AppException(ErrorCode.TOKEN_EXPIRED);
    }
    if (!resetToken.equals(verifyResetTokenRequest.getResetToken())) {
      throw new AppException(ErrorCode.TOKEN_INVALID);
    }
    PasswordEncoder encoder = new BCryptPasswordEncoder(10);
    existUser.setPassword(encoder.encode(verifyResetTokenRequest.getPassword()));
    userRepository.save(existUser);
    
    stringRedisTemplate.delete("reset-token: " + existUser.getId());
  }
}
