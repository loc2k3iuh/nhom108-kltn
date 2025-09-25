package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LogoutRequest {

  @NotNull(message = "TOKEN_REQUIRED")
  @NotBlank(message = "TOKEN_REQUIRED")
  String token;
}
