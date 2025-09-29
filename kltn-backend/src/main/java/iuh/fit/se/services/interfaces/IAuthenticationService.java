package iuh.fit.se.services.interfaces;

import com.nimbusds.jose.JOSEException;
import iuh.fit.se.dtos.requests.IntrospectRequest;
import iuh.fit.se.dtos.requests.LoginRequest;
import iuh.fit.se.dtos.requests.LogoutRequest;
import iuh.fit.se.dtos.requests.VerifyOtpRequestion;
import iuh.fit.se.dtos.responses.LoginResponse;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import java.text.ParseException;

public interface IAuthenticationService {

  void authenticate(LoginRequest loginRequest) throws JOSEException, MessagingException;

  LoginResponse verifyOtp(
      VerifyOtpRequestion verifyOtpRequestion, HttpServletResponse httpServletResponse)
      throws JOSEException;

  boolean introspect(IntrospectRequest introspectRequest) throws JOSEException, ParseException;

  void logout(LogoutRequest logoutRequest, String refreshToken)
      throws ParseException, JOSEException;
}
