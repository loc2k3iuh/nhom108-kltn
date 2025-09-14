package iuh.fit.se.controllers;

import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.RegisterUserRequest;
import iuh.fit.se.dtos.responses.UserResponse;
import iuh.fit.se.services.interfaces.IUserService;
import jakarta.validation.Valid;
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

  @PostMapping("")
  public APIResponse<Boolean> registerUser(
      @Valid @ModelAttribute RegisterUserRequest registerUserRequest) throws Exception {
    boolean isEditedUser = iUserService.createUser(registerUserRequest);
    return APIResponse.<Boolean>builder()
        .result(isEditedUser)
        .message(
            isEditedUser
                ? "We sent an email message to your email !"
                : "We updated your information and sent an email message to your email again !")
        .build();
  }

  @GetMapping("/confirm_user")
  public APIResponse<UserResponse> confirmUser(@RequestParam("token") String token) {
    return APIResponse.<UserResponse>builder()
        .result(iUserService.confirmToken(token))
        .message("Your account has been confirmed !")
        .build();
  }
}
