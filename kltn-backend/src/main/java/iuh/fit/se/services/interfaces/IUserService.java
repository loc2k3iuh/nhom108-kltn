package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.RegisterUserRequest;
import iuh.fit.se.dtos.requests.ResendTokenRequest;
import iuh.fit.se.dtos.requests.TokenRequest;
import iuh.fit.se.dtos.requests.UpdateUserRequest;
import iuh.fit.se.dtos.responses.UserResponse;
import java.io.IOException;

public interface IUserService {
  boolean createUser(RegisterUserRequest createUserRequest) throws Exception;

  UserResponse confirmToken(TokenRequest tokenRequest);

  void resendConfirmationToken(ResendTokenRequest resendTokenRequest);

  UserResponse getUserDetailsFromToken();

  UserResponse updateUser(Long id, UpdateUserRequest updateUserRequest) throws IOException;
}
