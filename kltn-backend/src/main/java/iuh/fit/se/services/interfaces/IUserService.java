package iuh.fit.se.services.interfaces;
import iuh.fit.se.dtos.requests.ChangePasswordRequest;
import iuh.fit.se.dtos.requests.RegisterUserRequest;
import iuh.fit.se.dtos.requests.ResendTokenRequest;
import iuh.fit.se.dtos.requests.TokenRequest;
import iuh.fit.se.dtos.requests.UpdateUserRequest;
import iuh.fit.se.dtos.responses.UserResponse;
import java.io.IOException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface IUserService {
  boolean createUser(RegisterUserRequest createUserRequest) throws Exception;

  UserResponse confirmToken(TokenRequest tokenRequest);

  void resendConfirmationToken(ResendTokenRequest resendTokenRequest);

  UserResponse getUserDetailsFromToken();

  void changePassword(ChangePasswordRequest changePasswordRequest);

  Page<UserResponse> getAllCustomers(String keyword, Boolean isActive, PageRequest pageRequest);

  UserResponse updateMyInfo(Long id, UpdateUserRequest updateUserRequest) throws IOException;

  UserResponse updateClient(Long id, UpdateUserRequest updateUserRequest);

  UserResponse getUserDetails(String username) throws Exception;
}
