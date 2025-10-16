package iuh.fit.se.services.impls;

import iuh.fit.se.entities.ConfirmationToken;
import iuh.fit.se.entities.User;
import iuh.fit.se.repositories.ConfirmationTokenRepository;
import iuh.fit.se.services.interfaces.IConfirmationTokenService;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConfirmationTokenServiceImpl implements IConfirmationTokenService {

  ConfirmationTokenRepository confirmationTokenRepository;

  // Implementation of the methods defined in ConfirmationTokenService interface
  @Override
  public Optional<ConfirmationToken> getToken(String token) {
    return confirmationTokenRepository.findByToken(token);
  }

  @Override
  public void saveToken(ConfirmationToken token) {
    confirmationTokenRepository.save(token);
  }

  @Override
  public void setConfirmedAt(String token) {
    ConfirmationToken t = getToken(token).orElseThrow();
    t.setConfirmedAt(new Date());
    confirmationTokenRepository.save(t);
  }

  @Override
  public void deleteTokensByUser(User user) {
    confirmationTokenRepository.deleteAllByUser(user);
  }

  @Override
  public String createConfirmationToken(User user) {
    String token = UUID.randomUUID().toString();
    Date now = new Date();
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(now);
    calendar.add(Calendar.MINUTE, 15);

    ConfirmationToken confirmationToken =
        ConfirmationToken.builder()
            .token(token)
            .user(user)
            .createdAt(now)
            .expiresAt(calendar.getTime())
            .build();
    confirmationTokenRepository.save(confirmationToken);
    return token;
  }
}
