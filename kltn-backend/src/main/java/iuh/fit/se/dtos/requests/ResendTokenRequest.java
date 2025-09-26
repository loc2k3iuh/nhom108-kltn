package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResendTokenRequest {

  @NotBlank(message = "EMAIL_REQUIRED")
  @NotNull(message = "EMAIL_REQUIRED")
  String email;
}
