package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {

  @NotBlank(message = "USERNAME_REQUIRED")
  String username;

  @NotBlank(message = "PASSWORD_REQUIRED")
  String password;
}
