package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.ResenOtpRequest;
import iuh.fit.se.dtos.requests.VerifyOtpRequest;
import iuh.fit.se.dtos.requests.VerifyRegistrationRequest;
import iuh.fit.se.dtos.responses.OrderResponse;
import iuh.fit.se.entities.User;
import jakarta.mail.MessagingException;

public interface IEmailService {
  void sendEmail(User user) throws MessagingException;

  void sentOtp(User user) throws MessagingException;

  void resendOtp(ResenOtpRequest resenOtpRequest) throws MessagingException;

  void sendForgotPasswordToken(String email, boolean isAdminPage) throws MessagingException;

  boolean verifyOtp(VerifyOtpRequest verifyOtpRequest);

  boolean verifyRegistration(VerifyRegistrationRequest verifyRegistrationRequest);

  void sendOrderConfirmation(OrderResponse orderResponse) throws MessagingException;

  /**
   * Generate PDF bytes for an order without sending email.
   *
   * @param orderResponse the order response data
   * @return PDF as byte array
   */
  byte[] generateOrderPdfBytes(OrderResponse orderResponse);
}
