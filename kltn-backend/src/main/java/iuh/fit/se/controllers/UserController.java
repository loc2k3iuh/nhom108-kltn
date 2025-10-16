package iuh.fit.se.controllers;

import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.RegisterUserRequest;
import iuh.fit.se.dtos.requests.ResendTokenRequest;
import iuh.fit.se.dtos.requests.TokenRequest;
import iuh.fit.se.dtos.requests.UpdateUserRequest;
import iuh.fit.se.dtos.responses.UserResponse;
import iuh.fit.se.services.interfaces.IUserService;
import jakarta.validation.Valid;
import java.io.IOException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

  IUserService iUserService;

  @PostMapping("/register")
  public APIResponse<Boolean> registerUser(
      @Valid @ModelAttribute RegisterUserRequest registerUserRequest) throws Exception {
    boolean isEditedUser = iUserService.createUser(registerUserRequest);
    return APIResponse.<Boolean>builder()
        .result(isEditedUser)
        .message(
            isEditedUser
                ? "We updated your information and sent an email message to your email again !"
                : "We sent an email message to your email !")
        .build();
  }

  @PostMapping("/confirm_user")
  public APIResponse<UserResponse> confirmUser(@Valid @RequestBody TokenRequest tokenRequest) {
    return APIResponse.<UserResponse>builder()
        .result(iUserService.confirmToken(tokenRequest))
        .message("Your account has been confirmed !")
        .build();
  }

  @GetMapping("/my-information")
  public APIResponse<UserResponse> getUserDetailsFromToken() {
    return APIResponse.<UserResponse>builder()
        .result(iUserService.getUserDetailsFromToken())
        .message("User retrieved successfully !")
        .build();
  }

  @PostMapping("/resend-token")
  public APIResponse<Void> resendToken(@Valid @RequestBody ResendTokenRequest resendTokenRequest) {
    iUserService.resendConfirmationToken(resendTokenRequest);
    return APIResponse.<Void>builder().message("We sent a token to your mail again !").build();
  }

  @PutMapping("/{userId}")
  public APIResponse<UserResponse> updateUser(
      @PathVariable String userId, @Valid @ModelAttribute UpdateUserRequest updateUserRequest)
      throws IOException {
    return APIResponse.<UserResponse>builder()
        .result(iUserService.updateUser(Long.valueOf(userId), updateUserRequest))
        .message("Updated user successfully !")
        .build();
  }
}
