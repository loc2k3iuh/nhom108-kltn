package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.ResenOtpRequest;
import iuh.fit.se.dtos.requests.VerifyOtpRequest;
import iuh.fit.se.dtos.requests.VerifyRegistrationRequest;
import iuh.fit.se.entities.User;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.IEmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
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

    @NonFinal
    @Value("${vite.frontend.admin.url}")
    String FRONTEND_ADMIN_URL;

    @NonFinal
    @Value("${vite.frontend.client.url}")
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
    public void sentOtp(User user) throws MessagingException {
        String otp = String.format("%06d", random.nextInt(1_000_000));
        stringRedisTemplate
                .opsForValue()
                .set("otp:email=" + user.getEmail(), otp, Duration.ofMinutes(5));
        Map<String, Object> variables = Map.of("username", user.getUsername(), "otp", otp);
        sendWithHtmlMailFormat(user.getEmail(), "Your Otp Code", "otp-mail", variables);
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
}