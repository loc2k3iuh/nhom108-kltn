package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.*;
import iuh.fit.se.dtos.responses.UserResponse;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

  IS3Service is3Service;
  UserMapper userMapper;
  IEmailService iEmailService;
  UserRepository userRepository;
  RoleRepository roleRepository;
  IConfirmationTokenService iConfirmationTokenService;

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

      MultipartFile file = request.getFile();
      if (file != null && !file.isEmpty()) {
        String avatarUrl = is3Service.uploadFile(file, existingUser.getUsername());
        existingUser.setAvatarUrl(avatarUrl);
      }

      existingUser.setCreatedDate(new Date());
      existingUser.setEnabled(false);
      existingUser.setIsActive(false);

      iConfirmationTokenService.deleteTokensByUser(existingUser);

      userRepository.save(existingUser);
      iEmailService.sendEmail(existingUser);
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
            .isActive(true)
            .enabled(true)
            .build();

    MultipartFile file = request.getFile();
    if (file != null && !file.isEmpty()) {
      String avatarUrl = is3Service.uploadFile(file, user.getUsername());
      user.setAvatarUrl(avatarUrl);
    }

    userRepository.save(user);

    iEmailService.sendEmail(user);

    return false;
  }

  @Override
  public void confirmToken(VerifyRegistrationRequest verifyRegistrationRequest) {
    boolean isValidToken = iEmailService.verifyRegistration(verifyRegistrationRequest);
    if (!isValidToken) {
      throw new AppException(ErrorCode.TOKEN_NOT_FOUND);
    }

    User existingUser =
        userRepository
            .findByEmail(verifyRegistrationRequest.getEmail())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    existingUser.setEnabled(true);
    existingUser.setIsActive(true);

    userRepository.save(existingUser);
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
  }

  @Override
  public UserResponse getUserDetailsFromToken() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new AppException(ErrorCode.UNAUTHORIZED);
    }
    return userMapper.toUserResponse(
        userRepository
            .findByUsername(authentication.getName())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND)));
  }

  @Override
  public void changePassword(ChangePasswordRequest changePasswordRequest) {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    User existingUser =
        userRepository
            .findByUsername(authentication.getName())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
    boolean isAuthenticated =
        passwordEncoder.matches(
            changePasswordRequest.getCurrentPassword(), existingUser.getPassword());
    if (!isAuthenticated) {
      throw new AppException(ErrorCode.PASSWORD_MUST_MATCH);
    }
    String encodedPassword = passwordEncoder.encode(changePasswordRequest.getNewPassword());
    existingUser.setPassword(encodedPassword);
    userRepository.save(existingUser);
  }

  @Override
  public Page<UserResponse> getAllCustomers(
      String keyword, Boolean isActive, PageRequest pageRequest) {
    Page<User> userPage = userRepository.searchCustomer(keyword, isActive, pageRequest);
    return userPage.map(userMapper::toUserResponse);
  }

  @Override
  @Transactional
  @PostMapping("returnObject.username == authentication.username")
  public UserResponse updateMyInfo(Long id, UpdateUserRequest updateUserRequest) {
    return userMapper.toUserResponse(userRepository.save(updateUser(id, updateUserRequest)));
  }

  private User updateUser(Long id, UpdateUserRequest updateUserRequest) {
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
    return existUser;
  }

  @Override
  public UserResponse updateClient(Long id, UpdateUserRequest updateUserRequest) {
    User existUser = updateUser(id, updateUserRequest);
    Optional.ofNullable(updateUserRequest.getIsActive()).ifPresent(existUser::setIsActive);
    return userMapper.toUserResponse(userRepository.save(existUser));
  }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserDetails(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
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
