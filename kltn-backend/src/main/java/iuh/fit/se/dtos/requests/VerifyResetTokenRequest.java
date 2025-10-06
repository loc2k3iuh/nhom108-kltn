package iuh.fit.se.dtos.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import iuh.fit.se.validators.users.passwords.PasswordMatch;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@PasswordMatch(field = "password", fieldMatch = "retypePassword", message = "PASSWORD_MUST_MATCH")
public class VerifyResetTokenRequest {

  @NotBlank(message = "EMAIL_REQUIRED")
  String email;

  @NotBlank(message = "TOKEN_REQUIRED")
  @JsonProperty("reset_token")
  String resetToken;

  @NotBlank(message = "PASSWORD_REQUIRED")
  @Size(min = 8, message = "PASSWORD_INVALID")
  String password;

  @NotBlank(message = "RETYPE_PASSWORD_REQUIRED")
  @JsonProperty("retype_password")
  String retypePassword;
}
