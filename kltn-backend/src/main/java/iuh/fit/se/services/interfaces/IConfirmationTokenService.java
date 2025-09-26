package iuh.fit.se.services.interfaces;

import iuh.fit.se.entities.ConfirmationToken;
import iuh.fit.se.entities.User;
import java.util.Optional;

public interface IConfirmationTokenService {
  Optional<ConfirmationToken> getToken(String token);

  void saveToken(ConfirmationToken token);

  void setConfirmedAt(String token);

  void deleteTokensByUser(User user);

  String createConfirmationToken(User user);
}
