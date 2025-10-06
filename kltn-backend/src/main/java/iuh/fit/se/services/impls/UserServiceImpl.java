package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.RegisterUserRequest;
import iuh.fit.se.dtos.requests.ResendTokenRequest;
import iuh.fit.se.dtos.requests.TokenRequest;
import iuh.fit.se.dtos.requests.UpdateUserRequest;
import iuh.fit.se.dtos.responses.UserResponse;
import iuh.fit.se.entities.ConfirmationToken;
import iuh.fit.se.entities.Role;
import iuh.fit.se.entities.User;
import iuh.fit.se.enums.RoleType;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.UserMapper;
import iuh.fit.se.repositories.RoleRepository;
import iuh.fit.se.repositories.UserRepository;
import iuh.fit.se.services.interfaces.IConfirmationTokenService;
import iuh.fit.se.services.interfaces.IEmailService;
import iuh.fit.se.services.interfaces.IS3Service;
import iuh.fit.se.services.interfaces.IUserService;
import java.io.IOException;
import java.util.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements IUserService {

  UserRepository userRepository;
  RoleRepository roleRepository;
  IS3Service is3Service;
  IEmailService iEmailService;
  IConfirmationTokenService iConfirmationTokenService;
  UserMapper userMapper;

  @NonFinal
  @Value("${client.url}")
  String clientUrl;

  @Override
  @Transactional
  public boolean createUser(RegisterUserRequest request) throws Exception {

    Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());

    // Nếu đã có email rồi
    if (existingUserOpt.isPresent()) {
      User existingUser = existingUserOpt.get();

      if (existingUser.getEnabled()) {
        throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
      }

      // Cập nhật thông tin user chưa xác thực
      existingUser.setUsername(request.getUsername());
      existingUser.setFullName(request.getFullName());

      PasswordEncoder encoder = new BCryptPasswordEncoder(10);
      existingUser.setPassword(encoder.encode(request.getPassword()));

      MultipartFile file = request.getMultipartFile();
      if (file != null && !file.isEmpty()) {
        String avatarUrl = is3Service.uploadFile(file, existingUser.getUsername());
        existingUser.setAvatarUrl(avatarUrl);
      }

      existingUser.setCreatedDate(new Date());
      existingUser.setEnabled(false);
      existingUser.setIsActive(false);

      iConfirmationTokenService.deleteTokensByUser(existingUser);

      userRepository.save(existingUser);
      String token = iConfirmationTokenService.createConfirmationToken(existingUser);
      String link = clientUrl + "/user/register-success?token=" + token;
      iEmailService.sendEmail(request.getEmail(), link);
      return true;
    }

    // Nếu email chưa tồn tại => tạo user mới
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
    }

    Role defaultRole =
        roleRepository
            .findByName(RoleType.CUSTOMER)
            .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_FOUND));

    PasswordEncoder encoder = new BCryptPasswordEncoder(10);
    String encodedPassword = encoder.encode(request.getPassword());

    User user =
        User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(encodedPassword)
            .fullName(request.getFullName())
            .roles(Set.of(defaultRole))
            .isActive(false)
            .enabled(false)
            .build();

    MultipartFile file = request.getMultipartFile();
    if (file != null && !file.isEmpty()) {
      String avatarUrl = is3Service.uploadFile(file, user.getUsername());
      user.setAvatarUrl(avatarUrl);
    }

    userRepository.save(user);

    String token = iConfirmationTokenService.createConfirmationToken(user);
    String link = clientUrl + "/user/register-success?token=" + token;
    iEmailService.sendEmail(request.getEmail(), link);
    return false;
  }

  @Override
  public UserResponse confirmToken(TokenRequest tokenRequest) {

    ConfirmationToken confirmationToken =
        iConfirmationTokenService
            .getToken(tokenRequest.getToken())
            .orElseThrow(() -> new AppException(ErrorCode.TOKEN_NOT_FOUND));

    if (confirmationToken.getConfirmedAt() != null) {
      throw new AppException(ErrorCode.TOKEN_CONFIRMED);
    }

    if (confirmationToken.getExpiresAt().before(new Date())) {
      throw new AppException(ErrorCode.TOKEN_EXPIRED);
    }

    confirmationToken.setConfirmedAt(new Date());
    iConfirmationTokenService.saveToken(confirmationToken);

    User user = confirmationToken.getUser();

    user.setEnabled(true);
    user.setIsActive(true);
    userRepository.save(user);
    return userMapper.toUserResponse(user);
  }

  @Override
  public void resendConfirmationToken(ResendTokenRequest resendTokenRequest) {
    User existUser =
        userRepository
            .findByEmail(resendTokenRequest.getEmail())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    if (existUser.getEnabled()) {
      throw new AppException(ErrorCode.USER_ALREADY_CONFIRMED);
    }

    iConfirmationTokenService.deleteTokensByUser(existUser);

    String token = iConfirmationTokenService.createConfirmationToken(existUser);

    String link = clientUrl + "/user/register-success?token=" + token;
    iEmailService.sendEmail(resendTokenRequest.getEmail(), link);
  }

  @Override
  public UserResponse getUserDetailsFromToken() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new AppException(ErrorCode.UNAUTHORIZED);
    }
    String username = authentication.getName();

    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    return userMapper.toUserResponse(user);
  }

  @Override
  @Transactional
  @PostMapping("returnObject.username == authentication.username")
  public UserResponse updateUser(Long id, UpdateUserRequest updateUserRequest) {
    User existUser =
        userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    Optional.ofNullable(updateUserRequest.getFullName())
        .filter(fn -> !fn.isBlank())
        .ifPresent(existUser::setFullName);

    Optional.ofNullable(updateUserRequest.getPhoneNumber())
        .filter(pn -> !pn.isBlank())
        .ifPresent(existUser::setPhoneNumber);

    Optional.ofNullable(updateUserRequest.getDateOfBirth()).ifPresent(existUser::setDateOfBirth);

    Optional.ofNullable(updateUserRequest.getAddress())
        .filter(ad -> !ad.isBlank())
        .ifPresent(existUser::setAddress);

    Optional.ofNullable(updateUserRequest.getFile())
        .filter(f -> !f.isEmpty())
        .map(
            f -> {
              if (!existUser.getAvatarUrl().isBlank()) {
                is3Service.deleteFile(existUser.getAvatarUrl());
              }
              return safeUpload(f, existUser.getUsername());
            })
        .ifPresent(existUser::setAvatarUrl);

    return userMapper.toUserResponse(existUser);
  }

  private String safeUpload(MultipartFile file, String username) {
    try {
      return is3Service.uploadFile(file, username);
    } catch (IOException e) {
      log.error("Error in Upload Image of user:", e);
      throw new AppException(ErrorCode.UPLOAD_ERROR);
    }
  }
}
