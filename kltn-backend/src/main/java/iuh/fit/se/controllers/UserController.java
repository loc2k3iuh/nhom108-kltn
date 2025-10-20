package iuh.fit.se.controllers;

import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.*;
import iuh.fit.se.dtos.responses.UserListResponse;
import iuh.fit.se.dtos.responses.UserResponse;
import iuh.fit.se.services.interfaces.IUserService;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/users")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

  IUserService iUserService;
  SimpMessagingTemplate messagingTemplate;

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
  public APIResponse<Void> confirmUser(
      @Valid @RequestBody VerifyRegistrationRequest verifyRegistrationRequest) {
    iUserService.confirmToken(verifyRegistrationRequest);
    return APIResponse.<Void>builder().message("Your account has been confirmed !").build();
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
  public APIResponse<UserResponse> updateMyInfo(
      @PathVariable String userId, @Valid @ModelAttribute UpdateUserRequest updateUserRequest)
      throws IOException {
    return APIResponse.<UserResponse>builder()
        .result(iUserService.updateMyInfo(Long.valueOf(userId), updateUserRequest))
        .message("Updated user successfully !")
        .build();
  }

  @PutMapping("/client/{userId}")
  public APIResponse<UserResponse> updateClient(
      @PathVariable String userId, @Valid @ModelAttribute UpdateUserRequest updateUserRequest) {
    return APIResponse.<UserResponse>builder()
        .result(iUserService.updateClient(Long.valueOf(userId), updateUserRequest))
        .message("Update client successfully !")
        .build();
  }

  @PostMapping("/change-password")
  public APIResponse<Void> changePassword(
      @Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
    iUserService.changePassword(changePasswordRequest);
    return APIResponse.<Void>builder().message("Change password successfully !").build();
  }

  @GetMapping("")
  public APIResponse<UserListResponse> getAllCustomers(
      @RequestParam(value = "keyword", required = false) String keyword,
      @RequestParam(value = "state", required = false) Boolean state,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int limit) {
    PageRequest pageRequest = PageRequest.of(page, limit, Sort.by("id").ascending());
    Page<UserResponse> userPage = iUserService.getAllCustomers(keyword, state, pageRequest);
    int totalPage = userPage.getTotalPages();
    List<UserResponse> users = userPage.getContent();
    return APIResponse.<UserListResponse>builder()
        .result(UserListResponse.builder().users(users).totalPage(totalPage).build())
        .build();
  }

  @MessageMapping("/users/update-client")
  public void sendUpdatedClientInformation(@Payload String username) throws Exception {
    log.info("Change User Websocket {}", username);
    UserResponse userResponse = iUserService.getUserDetails(username);
    log.info("Sending user data: {}", userResponse);
    messagingTemplate.convertAndSend("/topic/user-updated/" + username, userResponse);
  }
}
