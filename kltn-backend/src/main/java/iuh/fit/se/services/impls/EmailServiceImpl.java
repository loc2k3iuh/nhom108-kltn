package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.VerifyOtpRequestion;
import iuh.fit.se.entities.User;
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
  Random random = new Random();

  @Async
  @Override
  public void sendEmail(String to, String link) {
    SimpleMailMessage mailMessage = new SimpleMailMessage();
    mailMessage.setTo(to);
    mailMessage.setSubject("PLease confirm your email");
    mailMessage.setText("Click on the following link to reset your password: " + link);
    mailSender.send(mailMessage);
  }

  @Override
  public void sentOtp(User user) throws MessagingException {
    String otp = String.format("%06d", random.nextInt(1_000_000));

    stringRedisTemplate.opsForValue().set("OTP: " + user.getEmail(), otp, Duration.ofMinutes(5));

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
  public boolean verifyOtp(VerifyOtpRequestion verifyOtpRequestion) {
    String key = "OTP: " + verifyOtpRequestion.getEmail();
    return Optional.ofNullable(stringRedisTemplate.opsForValue().get(key))
        .filter(cachedOtp -> cachedOtp.equals(verifyOtpRequestion.getOptToken()))
        .map(
            validOtp -> {
              stringRedisTemplate.delete(validOtp);
              return true;
            })
        .orElse(false);
  }
}
