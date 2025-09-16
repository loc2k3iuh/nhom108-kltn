package iuh.fit.se.services.impls;

import com.nimbusds.jose.JOSEException;
import iuh.fit.se.dtos.requests.IntrospectRequest;
import iuh.fit.se.dtos.requests.LoginRequest;
import iuh.fit.se.dtos.responses.LoginResponse;
import iuh.fit.se.entities.RefreshToken;
import iuh.fit.se.entities.User;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.IAuthenticationService;

import java.text.ParseException;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

import iuh.fit.se.services.interfaces.IJwtService;
import iuh.fit.se.services.interfaces.IRefreshTokenService;
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

  private boolean isGmailAddress(String email) {
    String regex = "^[A-Za-z0-9._%+-]+@gmail\\.com$";
    return email != null && email.matches(regex);
  }

  @Override
  public LoginResponse authenticate(LoginRequest loginRequest) throws JOSEException {
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

    String accessToken = iJwtService.generateToken(user);
    RefreshToken refreshToken = iRefreshTokenService.createRefreshToken(user.getId());

    return LoginResponse.builder()
            .authenticated(true)
            .refreshToken(refreshToken.getToken())
            .token(accessToken)
            .build();
  }

  @Override
  public boolean introspect(IntrospectRequest introspectRequest) throws JOSEException, ParseException {
    String token = introspectRequest.getToken();
    try{
      iJwtService.verifyToken(token);
      return true;
    } catch (AppException e) {
      return false;
    }
  }
}
