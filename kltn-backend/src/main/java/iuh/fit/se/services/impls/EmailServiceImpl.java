package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.ResenOtpRequest;
import iuh.fit.se.dtos.requests.VerifyOtpRequestion;
import iuh.fit.se.entities.User;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.IEmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.Duration;
import java.util.Optional;
import java.util.Random;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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

  @Override
  public void sendEmail(String to, String link) {
    SimpleMailMessage mailMessage = new SimpleMailMessage();
    mailMessage.setTo(to);
    mailMessage.setSubject("PLease confirm your email");
    mailMessage.setText("Click on the following link to reset your password: " + link);
    mailSender.send(mailMessage);
  }

  private void sendOtpWithHtmlFormatMail(User user, String otp) throws MessagingException {
    Context context = new Context();
    context.setVariable("username", user.getUsername());
    context.setVariable("otp", otp);
    String htmlContent = templateEngine.process("otp-mail", context);
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(message, true, "UTF-8");
    mimeMessageHelper.setTo(user.getEmail());
    mimeMessageHelper.setSubject("Your OTP Code");
    mimeMessageHelper.setText(htmlContent, true);
    mailSender.send(message);
  }

  @Override
  public void sentOtp(User user) throws MessagingException {
    String otp = String.format("%06d", random.nextInt(1_000_000));
    stringRedisTemplate.opsForValue().set("OTP: " + user.getEmail(), otp, Duration.ofMinutes(5));
    sendOtpWithHtmlFormatMail(user, otp);
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

    sendOtpWithHtmlFormatMail(user, otp);
  }

  @Override
  public boolean verifyOtp(VerifyOtpRequestion verifyOtpRequestion) {
    String key = "OTP: " + verifyOtpRequestion.getEmail();
    return Optional.ofNullable(stringRedisTemplate.opsForValue().get(key))
        .filter(cachedOtp -> cachedOtp.equals(verifyOtpRequestion.getOptToken()))
        .map(
            validOtp -> {
              stringRedisTemplate.delete(key);
              return true;
            })
        .orElse(false);
  }
}
