package iuh.fit.se.controllers;

import com.nimbusds.jose.JOSEException;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.*;
import iuh.fit.se.dtos.responses.LoginResponse;
import iuh.fit.se.dtos.responses.PreLoginResponse;
import iuh.fit.se.dtos.responses.TokenResponse;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.services.interfaces.IAuthenticationService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.text.ParseException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/auth")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {

  IAuthenticationService iAuthenticationService;

  @PostMapping("/login")
  public APIResponse<PreLoginResponse> login(@Valid @RequestBody LoginRequest loginRequest)
      throws JOSEException, MessagingException {
    return APIResponse.<PreLoginResponse>builder()
        .result(iAuthenticationService.authenticate(loginRequest))
        .message("We sent an OTP CODE to your email !")
        .build();
  }

  @PostMapping("/verify-otp")
  public APIResponse<LoginResponse> verifyToken(
      @RequestParam("isChecked") boolean isChecked,
      @Valid @RequestBody VerifyOtpRequest verifyOtpRequest,
      HttpServletResponse httpServletResponse)
      throws JOSEException {
    return APIResponse.<LoginResponse>builder()
        .result(iAuthenticationService.verifyOtp(verifyOtpRequest, isChecked, httpServletResponse))
        .message("Login successfully !")
        .build();
  }

  @PostMapping("/resend-otp")
  public APIResponse<Void> resendOtp(@Valid @RequestBody ResenOtpRequest resenOtpRequest)
      throws MessagingException {
    iAuthenticationService.resendOtp(resenOtpRequest);
    return APIResponse.<Void>builder().message("We resent an OTP CODE to your email !").build();
  }

  @GetMapping("/introspect")
  public APIResponse<Boolean> introspectToken(
      @Valid @RequestBody IntrospectRequest introspectRequest)
      throws ParseException, JOSEException {
    return APIResponse.<Boolean>builder()
        .result(iAuthenticationService.introspect(introspectRequest))
        .message("Token valid !")
        .build();
  }

  @PostMapping("/refresh-token/{userId}")
  public APIResponse<TokenResponse> refreshToken(
      @CookieValue(name = "refresh_token", required = false) String refreshToken,
      @PathVariable String userId)
      throws JOSEException {
    if (refreshToken.isBlank()) {
      throw new AppException(ErrorCode.REFRESH_TOKEN_REQUIRED);
    }
    return APIResponse.<TokenResponse>builder()
        .result(
            iAuthenticationService.refreshAccessToken(
                RefreshRequest.builder().refreshToken(refreshToken).build(), userId))
        .build();
  }

  @PostMapping("/logout")
  public ResponseEntity<APIResponse<Void>> logout(
      @Valid @RequestBody LogoutRequest logoutRequest,
      @CookieValue(name = "refresh_token", required = false) String refreshToken)
      throws ParseException, JOSEException {
    ResponseCookie deleteCookie =
        ResponseCookie.from("refresh_token", "")
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(0)
            .build();
    iAuthenticationService.logout(logoutRequest, refreshToken);
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
        .body(APIResponse.<Void>builder().message("Logged out successfully !").build());
  }

  @PostMapping("/delete-refresh-token-from-redis/{userId}")
  public APIResponse<Void> deleteReFreshTokenFromRedis(@PathVariable String userId) {
    iAuthenticationService.deleteRefreshTokenFromRedis(userId);
    return APIResponse.<Void>builder()
        .message("Deleted refresh token from redis successfully !")
        .build();
  }

  @PostMapping("/send-forgot-password")
  public APIResponse<Void> sendForgotPassword(
      @RequestParam("email") String email, @RequestParam("is_admin") boolean isAdminPage)
      throws MessagingException {
    iAuthenticationService.sendForgotPassword(email, isAdminPage);
    return APIResponse.<Void>builder()
        .message("We sent a forgot password token to your email !")
        .build();
  }

  @PostMapping("/verify-reset-token")
  public APIResponse<Void> verifyResetToken(
      @Valid @RequestBody VerifyResetTokenRequest verifyResetTokenRequest) {
    iAuthenticationService.verifyResetToken(verifyResetTokenRequest);
    return APIResponse.<Void>builder().message("Your password changed successfully !").build();
  }
}
