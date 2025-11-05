package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.ResenOtpRequest;
import iuh.fit.se.dtos.requests.VerifyOtpRequest;
import iuh.fit.se.dtos.requests.VerifyRegistrationRequest;
import iuh.fit.se.dtos.responses.OrderResponse;
import iuh.fit.se.entities.User;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.IEmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailServiceImpl implements IEmailService {

  JavaMailSender mailSender;
  StringRedisTemplate stringRedisTemplate;
  TemplateEngine templateEngine;
  UserRepository userRepository;
  Random random = new Random();

  @NonFinal
  @Value("${vite.front-end.admin.url}")
  String FRONTEND_ADMIN_URL;

  @NonFinal
  @Value("${vite.front-end.client.url}")
  String FRONTEND_CLIENT_URL;

  private String generateToken() {
    SecureRandom secureRandom = new SecureRandom();
    Base64.Encoder baEncoder = Base64.getUrlEncoder().withoutPadding();
    byte[] randomBytes = new byte[32];
    secureRandom.nextBytes(randomBytes);
    return baEncoder.encodeToString(randomBytes);
  }

  private void sendWithHtmlMailFormat(
      String to, String subject, String templateName, Map<String, Object> variables)
      throws MessagingException {
    Context context = new Context();
    context.setVariables(variables);
    String htmlContent = templateEngine.process(templateName, context);
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    helper.setTo(to);
    helper.setSubject(subject);
    helper.setText(htmlContent, true);
    mailSender.send(message);
  }

  @Override
  public void sendEmail(User user) throws MessagingException {
    String key = "verify:email=" + user.getEmail();
    Long ttl = stringRedisTemplate.getExpire(key, TimeUnit.SECONDS);
    if (ttl != null && ttl > 0) {
      long minutes = ttl / 60;
      long seconds = ttl % 60;
      throw new AppException(
          ErrorCode.TOKEN_NOT_EXPIRED,
          String.format(
              "You only send mail after %d minutes %d seconds or check your mail !",
              minutes, seconds));
    }

    String token = generateToken();

    stringRedisTemplate.opsForValue().set(key, token, Duration.ofMinutes(15));

    Map<String, Object> variables =
        Map.of(
            "username",
            user.getUsername(),
            "verificationLink",
            FRONTEND_CLIENT_URL
                + "/register-success"
                + "?email="
                + user.getEmail()
                + "&token="
                + token);

    sendWithHtmlMailFormat(user.getEmail(), "Verify Account", "register-mail", variables);
  }

  @Override
  @Async("emailTaskExecutor")
  public void sentOtp(User user)  {
    try {
      String otp = String.format("%06d", random.nextInt(1_000_000));
      stringRedisTemplate
          .opsForValue()
          .set("otp:email=" + user.getEmail(), otp, Duration.ofMinutes(5));
      Map<String, Object> variables = Map.of("username", user.getUsername(), "otp", otp);
      sendWithHtmlMailFormat(user.getEmail(), "Your Otp Code", "otp-mail", variables);
      log.info("OTP sent asynchronously to {}", user.getEmail());
    } catch (MessagingException me) {
      // MessagingException is checked; log and rethrow inside async thread if desired
      log.error("Failed to send OTP email to {}", user.getEmail(), me);
      // don't rethrow to avoid uncaught exceptions in async executor
    } catch (Exception e) {
      log.error("Unexpected error while sending OTP to {}", user.getEmail(), e);
    }
  }

  @Override
  public void resendOtp(ResenOtpRequest resenOtpRequest) throws MessagingException {
    User user =
        userRepository
            .findByEmail(resenOtpRequest.getEmail())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    String otpKey = "OTP: " + resenOtpRequest.getEmail();
    String counterKey = "OTP_COUNTER: " + resenOtpRequest.getEmail();

    String counterStr = stringRedisTemplate.opsForValue().get(counterKey);
    int counter = counterStr != null ? Integer.parseInt(counterStr) : 0;

    if (counter >= 3) {
      throw new AppException(ErrorCode.MAX_OTP);
    }
    String otp = String.format("%06d", random.nextInt(1_00_00));

    stringRedisTemplate.opsForValue().set(otpKey, otp, Duration.ofMinutes(5));

    stringRedisTemplate
        .opsForValue()
        .set(counterKey, String.valueOf(counter + 1), Duration.ofMinutes(10));

    Map<String, Object> variables = Map.of("username", user.getUsername(), "otp", otp);
    sendWithHtmlMailFormat(user.getEmail(), "Your Otp Code", "otp-mail", variables);
  }

  @Override
  public void sendForgotPasswordToken(String email, boolean isAdminPage) throws MessagingException {

    User user =
        userRepository
            .findByEmail(email)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    String key = "reset:token:userId=" + user.getId();

    Long ttl = stringRedisTemplate.getExpire(key, TimeUnit.SECONDS);
    if (ttl != null && ttl > 0) {
      long minutes = ttl / 60;
      long seconds = ttl % 60;
      throw new AppException(
          ErrorCode.TOKEN_NOT_EXPIRED,
          String.format("You only send mail after %d minutes %d seconds.", minutes, seconds));
    }
    String token = generateToken();

    stringRedisTemplate.opsForValue().set(key, token, Duration.ofMinutes(15));

    Map<String, Object> variables =
        Map.of(
            "username",
            user.getUsername(),
            "resetLink",
            (isAdminPage ? FRONTEND_ADMIN_URL : FRONTEND_CLIENT_URL)
                + "/reset-password"
                + "?email="
                + user.getEmail()
                + "&reset_token="
                + token);

    sendWithHtmlMailFormat(
        user.getEmail(), "Your Reset Password", "reset-password-mail", variables);
  }

  @Override
  public boolean verifyOtp(VerifyOtpRequest verifyOtpRequest) {
    String key = "otp:email=" + verifyOtpRequest.getEmail();
    return verifyToken(key, verifyOtpRequest.getOptToken());
  }

  @Override
  public boolean verifyRegistration(VerifyRegistrationRequest verifyRegistrationRequest) {
    String key = "verify:email=" + verifyRegistrationRequest.getEmail();
    return verifyToken(key, verifyRegistrationRequest.getToken());
  }

  private boolean verifyToken(String key, String token) {
    return Optional.ofNullable(stringRedisTemplate.opsForValue().get(key))
        .filter(cachedToken -> cachedToken.equals(token))
        .map(
            validToken -> {
              stringRedisTemplate.delete(key);
              return true;
            })
        .orElse(false);
  }

  @Override
  @Async("emailTaskExecutor")
  public void sendOrderConfirmation(OrderResponse orderResponse) throws MessagingException {
    if (orderResponse == null || orderResponse.getUserId() == null) {
      log.error("Cannot send order confirmation: order response or user ID is null");
      return;
    }

    try {
      // Get user info
      User user =
          userRepository
              .findById(orderResponse.getUserId())
              .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

      // Format order items for email
      List<Map<String, Object>> orderItems = new ArrayList<>();
      if (orderResponse.getOrderDetails() != null) {
        orderItems =
            orderResponse.getOrderDetails().stream()
                .map(
                    item -> {
                      Map<String, Object> itemMap = new HashMap<>();
                      itemMap.put("productName", item.getProductName());
                      itemMap.put("quantity", item.getQuantity());
                      itemMap.put("price", item.getPrice());
                      itemMap.put(
                          "imageUrl",
                          item.getImageUrl() != null
                              ? item.getImageUrl()
                              : "https://via.placeholder.com/80");
                      return itemMap;
                    })
                .collect(Collectors.toList());
      }

      // Format full address
      String fullAddress =
          String.format(
              "%s, %s, %s, %s",
              orderResponse.getAddress() != null ? orderResponse.getAddress() : "",
              orderResponse.getWard() != null ? orderResponse.getWard() : "",
              orderResponse.getDistrict() != null ? orderResponse.getDistrict() : "",
              orderResponse.getCity() != null ? orderResponse.getCity() : "");

      // Prepare email variables
      Map<String, Object> variables = new HashMap<>();
      variables.put(
          "customerName",
          orderResponse.getFullName() != null ? orderResponse.getFullName() : user.getUsername());
      variables.put("orderId", orderResponse.getId());
      variables.put("orderDate", orderResponse.getOrderDate());
      variables.put("orderStatus", formatOrderStatus(orderResponse.getStatus()));
      variables.put("voucherCode", orderResponse.getDiscountCode());
      variables.put("orderItems", orderItems);
      variables.put("receiverName", orderResponse.getFullName());
      variables.put("receiverPhone", orderResponse.getPhoneNumber());
      variables.put("fullAddress", fullAddress);
      variables.put("shippingMethod", formatShippingMethod(orderResponse.getShippingMethod()));
      variables.put("note", orderResponse.getNote());
      variables.put(
          "totalAmount",
          orderResponse.getTotalAmount() != null
              ? orderResponse.getTotalAmount()
              : BigDecimal.ZERO);
      variables.put(
          "shippingCost",
          orderResponse.getShippingCost() != null ? orderResponse.getShippingCost() : 0L);
      variables.put(
          "discountAmount",
          orderResponse.getDiscountAmount() != null
              ? orderResponse.getDiscountAmount()
              : BigDecimal.ZERO);
      variables.put(
          "finalAmount",
          orderResponse.getFinalAmount() != null
              ? orderResponse.getFinalAmount()
              : BigDecimal.ZERO);
      variables.put("paymentMethod", formatPaymentMethod(orderResponse.getPaymentMethod()));
      variables.put("trackingUrl", FRONTEND_CLIENT_URL + "/orders");

      // Send email
      sendWithHtmlMailFormat(
          user.getEmail(),
          "Xác nhận đơn hàng #" + orderResponse.getId(),
          "order-confirmation-mail",
          variables);

      log.info(
          "Order confirmation email sent to: {} for order: {}",
          user.getEmail(),
          orderResponse.getId());
    } catch (Exception e) {
      log.error("Failed to send order confirmation email for order: {}", orderResponse.getId(), e);
      // Don't rethrow - this is async, we don't want to break the thread
    }
  }

  private String formatOrderStatus(String status) {
    if (status == null) return "Đang xử lý";
    switch (status.toUpperCase()) {
      case "PENDING":
        return "Đang xử lý";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PROCESSING":
        return "Đang chuẩn bị";
      case "SHIPPED":
        return "Đang giao";
      case "DELIVERED":
        return "Đã giao";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  }

  private String formatShippingMethod(String method) {
    if (method == null) return "Giao hàng tiêu chuẩn";
    switch (method.toUpperCase()) {
      case "STANDARD":
        return "Giao hàng tiêu chuẩn";
      case "EXPRESS":
        return "Giao hàng nhanh";
      case "SAME_DAY":
        return "Giao hàng trong ngày";
      default:
        return method;
    }
  }

  private String formatPaymentMethod(String method) {
    if (method == null) return "COD - Thanh toán khi nhận hàng";
    switch (method.toUpperCase()) {
      case "COD":
        return "COD - Thanh toán khi nhận hàng";
      case "CREDIT_CARD":
        return "Thẻ tín dụng/Ghi nợ";
      case "BANK_TRANSFER":
        return "Chuyển khoản ngân hàng";
      case "MOMO":
        return "Ví MoMo";
      case "ZALOPAY":
        return "Ví ZaloPay";
      default:
        return method;
    }
  }
}
