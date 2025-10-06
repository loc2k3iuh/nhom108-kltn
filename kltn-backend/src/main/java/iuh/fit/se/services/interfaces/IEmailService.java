package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.ResenOtpRequest;
import iuh.fit.se.dtos.requests.VerifyOtpRequest;
import iuh.fit.se.entities.User;
import jakarta.mail.MessagingException;

public interface IEmailService {
  void sendEmail(String to, String link);

  void sentOtp(User user) throws MessagingException;

  void resendOtp(ResenOtpRequest resenOtpRequest) throws MessagingException;

  void sendForgotPasswordToken(String email, boolean isAdminPage) throws MessagingException;

  boolean verifyOtp(VerifyOtpRequest verifyOtpRequest);
}
