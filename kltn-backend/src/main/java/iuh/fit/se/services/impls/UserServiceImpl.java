package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.RegisterUserRequest;
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
import java.util.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

  private String createConfirmationToken(User user) {
    String token = UUID.randomUUID().toString();
    Date now = new Date();
    Calendar calendar = Calendar.getInstance();
    calendar.setTime(now);
    calendar.add(Calendar.MINUTE, 15);

    ConfirmationToken confirmationToken =
        ConfirmationToken.builder()
            .token(token)
            .user(user)
            .createdAt(now)
            .expiresAt(calendar.getTime())
            .build();
    iConfirmationTokenService.saveToken(confirmationToken);
    return token;
  }

  @Override
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
      String token = createConfirmationToken(existingUser);
      String link = "http://localhost:5173/user/register-success?token=" + token;
      iEmailService.sendEmail(request.getEmail(), link);
      return true;
    }

    // Nếu email chưa tồn tại => tạo user mới
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
    }

    Role defaultRole =
        roleRepository
            .findByName(RoleType.USER)
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
            .createdDate(new Date())
            .isActive(false)
            .enabled(false)
            .build();

    MultipartFile file = request.getMultipartFile();
    if (file != null && !file.isEmpty()) {
      String avatarUrl = is3Service.uploadFile(file, user.getUsername());
      user.setAvatarUrl(avatarUrl);
    }

    userRepository.save(user);

    String token = createConfirmationToken(user);
    String link = "http://localhost:5173/user/register-success?token=" + token;
    iEmailService.sendEmail(request.getEmail(), link);
    return false;
  }

  @Override
  public UserResponse confirmToken(String token) {

    if (token == null || token.isBlank()) {
      throw new AppException(ErrorCode.TOKEN_REQUIRED);
    }

    ConfirmationToken confirmationToken =
        iConfirmationTokenService
            .getToken(token)
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
}
