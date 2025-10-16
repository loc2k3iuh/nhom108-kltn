package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.*;
import iuh.fit.se.dtos.responses.UserResponse;
import java.io.IOException;

public interface IUserService {
  boolean createUser(RegisterUserRequest createUserRequest) throws Exception;

  void confirmToken(VerifyRegistrationRequest verifyRegistrationRequest);

  void resendConfirmationToken(ResendTokenRequest resendTokenRequest);

  UserResponse getUserDetailsFromToken();

  void changePassword(ChangePasswordRequest changePasswordRequest);

  UserResponse updateUser(Long id, UpdateUserRequest updateUserRequest) throws IOException;
}
