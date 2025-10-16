package iuh.fit.se.dtos.requests;

import iuh.fit.se.validators.users.passwords.PasswordMatch;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@PasswordMatch(field = "password", fieldMatch = "retypePassword", message = "PASSWORD_MUST_MATCH")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegisterUserRequest {

  @NotBlank(message = "USERNAME_REQUIRED")
  @Size(min = 5, message = "USERNAME_INVALID")
  String username;

  @NotBlank(message = "EMAIL_REQUIRED")
  @Pattern(regexp = "^[A-Za-z0-9._%+-]+@gmail\\.com$", message = "EMAIL_INVALID")
  String email;

  @NotBlank(message = "FULLNAME_REQUIRED")
  @Size(min = 5, message = "FULLNAME_INVALID")
  String fullName;

  @NotBlank(message = "PASSWORD_REQUIRED")
  @Size(min = 8, message = "PASSWORD_INVALID")
  String password;

  @NotBlank(message = "RETYPE_PASSWORD_REQUIRED")
  String retypePassword;

  MultipartFile multipartFile;
}
