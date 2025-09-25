package iuh.fit.se.services.impls;

import iuh.fit.se.services.interfaces.IEmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailServiceImpl implements IEmailService {

  JavaMailSender mailSender;

  @Async
  @Override
  public void sendEmail(String to, String link) {
    SimpleMailMessage mailMessage = new SimpleMailMessage();
    mailMessage.setTo(to);
    mailMessage.setSubject("PLease confirm your email");
    mailMessage.setText("Click on the following link to reset your password: " + link);
    mailSender.send(mailMessage);
  }
}
