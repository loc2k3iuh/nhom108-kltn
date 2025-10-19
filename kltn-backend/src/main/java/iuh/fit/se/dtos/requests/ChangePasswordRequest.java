package iuh.fit.se.dtos.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import iuh.fit.se.validators.users.passwords.PasswordMatch;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@PasswordMatch(
    field = "newPassword",
    fieldMatch = "retypeNewPassword",
    message = "PASSWORD_MUST_MATCH")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChangePasswordRequest {

  @NotBlank(message = "PASSWORD_REQUIRED")
  @JsonProperty("current_password")
  String currentPassword;

  @NotBlank(message = "PASSWORD_REQUIRED")
  @Size(min = 8, message = "PASSWORD_INVALID")
  @JsonProperty("new_password")
  String newPassword;

  @NotBlank(message = "RETYPE_PASSWORD_REQUIRED")
  @JsonProperty("retype_new_password")
  String retypeNewPassword;
}
