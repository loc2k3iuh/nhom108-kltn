package iuh.fit.se.services.interfaces;

import com.nimbusds.jose.JOSEException;
import iuh.fit.se.dtos.requests.*;
import iuh.fit.se.dtos.responses.LoginResponse;
import iuh.fit.se.dtos.responses.PreLoginResponse;
import iuh.fit.se.dtos.responses.TokenResponse;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import java.text.ParseException;

public interface IAuthenticationService {

  PreLoginResponse authenticate(LoginRequest loginRequest) throws JOSEException, MessagingException;

  LoginResponse verifyOtp(
      VerifyOtpRequest verifyOtpRequest, boolean isChecked, HttpServletResponse httpServletResponse)
      throws JOSEException;

  void resendOtp(ResenOtpRequest resenOtpRequest) throws MessagingException;

  boolean introspect(IntrospectRequest introspectRequest) throws JOSEException, ParseException;

  void logout(LogoutRequest logoutRequest, String refreshToken)
      throws ParseException, JOSEException;

  TokenResponse refreshAccessToken(RefreshRequest refreshRequest, String userId)
      throws JOSEException;

  void deleteRefreshTokenFromRedis(String userId);

  void sendForgotPassword(String email, boolean isAdminPage) throws MessagingException;

  void verifyResetToken(VerifyResetTokenRequest verifyResetTokenRequest);
}
