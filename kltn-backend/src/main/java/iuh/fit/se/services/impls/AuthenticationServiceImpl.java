package iuh.fit.se.services.impls;

import com.nimbusds.jose.JOSEException;
import iuh.fit.se.dtos.requests.IntrospectRequest;
import iuh.fit.se.dtos.requests.LoginRequest;
import iuh.fit.se.dtos.requests.LogoutRequest;
import iuh.fit.se.dtos.requests.VerifyOtpRequestion;
import iuh.fit.se.dtos.responses.LoginResponse;
import iuh.fit.se.entities.InvalidatedToken;
import iuh.fit.se.entities.RefreshToken;
import iuh.fit.se.entities.User;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements IAuthenticationService {

  IJwtService iJwtService;
  UserRepository userRepository;
  IRefreshTokenService iRefreshTokenService;
  InvalidatedTokenRepository invalidatedTokenRepository;
  IEmailService iEmailService;

  private boolean isGmailAddress(String email) {
    String regex = "^[A-Za-z0-9._%+-]+@gmail\\.com$";
    return email != null && email.matches(regex);
  }

  @Override
  public void authenticate(LoginRequest loginRequest) throws JOSEException, MessagingException {
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
  }

  @Override
  public LoginResponse verifyOtp(
      VerifyOtpRequestion verifyOtpRequestion, HttpServletResponse httpServletResponse)
      throws JOSEException {
    boolean isValidOtp = iEmailService.verifyOtp(verifyOtpRequestion);
    if (!isValidOtp) {
      throw new AppException(ErrorCode.OTP_NOT_FOUND);
    }
    User user =
        userRepository
            .findByEmail(verifyOtpRequestion.getEmail())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    String accessToken = iJwtService.generateToken(user);
    RefreshToken refreshToken = iRefreshTokenService.createRefreshToken(user.getId());

    iRefreshTokenService.createRefreshTokenCookie(httpServletResponse, refreshToken.getToken());
    return LoginResponse.builder().authenticated(true).accessToken(accessToken).build();
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
  public void logout(LogoutRequest logoutRequest, String refreshToken)
      throws ParseException, JOSEException {
    try {
      var signToken = iJwtService.verifyToken(logoutRequest.getToken());
      String jit = signToken.getJWTClaimsSet().getJWTID();
      Date expiryDate = signToken.getJWTClaimsSet().getExpirationTime();

      invalidatedTokenRepository.save(
          InvalidatedToken.builder().expiryTime(expiryDate).id(jit).build());

      Optional.ofNullable(refreshToken).ifPresent(iRefreshTokenService::deleteByToken);

    } catch (AppException e) {
      throw new AppException(ErrorCode.UNAUTHENTICATED);
    }
  }
}
