package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerifyRegistrationRequest {

  @NotBlank(message = "EMAIL_REQUIRED")
  String email;

  @NotBlank(message = "TOKEN_REQUIRED")
  String token;
}
