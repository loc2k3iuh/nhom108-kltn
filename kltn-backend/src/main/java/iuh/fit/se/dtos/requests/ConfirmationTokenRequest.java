package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConfirmationTokenRequest {

  @NotBlank(message = "TOKEN_REQUIRED")
  String token;
}
