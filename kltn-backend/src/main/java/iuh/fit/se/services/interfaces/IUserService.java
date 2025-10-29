package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.*;
import iuh.fit.se.dtos.responses.UserResponse;
import java.io.IOException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface IUserService {
    boolean createUser(RegisterUserRequest createUserRequest) throws Exception;

    void confirmToken(VerifyRegistrationRequest verifyRegistrationRequest);

    void resendConfirmationToken(ResendTokenRequest resendTokenRequest);

    UserResponse getUserDetailsFromToken();

    void changePassword(ChangePasswordRequest changePasswordRequest);

    Page<UserResponse> getAllCustomers(String keyword, Boolean isActive, PageRequest pageRequest);

    UserResponse updateMyInfo(Long id, UpdateUserRequest updateUserRequest) throws IOException;

    UserResponse updateClient(Long id, UpdateUserRequest updateUserRequest);

    UserResponse getUserDetails(String username) throws Exception;
}