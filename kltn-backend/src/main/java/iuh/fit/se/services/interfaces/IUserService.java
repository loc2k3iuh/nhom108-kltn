package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.RegisterUserRequest;
import iuh.fit.se.dtos.responses.UserResponse;

public interface IUserService {
  boolean createUser(RegisterUserRequest createUserRequest) throws Exception;

  UserResponse confirmToken(String token);
}
