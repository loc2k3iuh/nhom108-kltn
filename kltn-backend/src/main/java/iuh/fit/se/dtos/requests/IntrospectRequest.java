package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IntrospectRequest {

  @NotBlank(message = "TOKEN_REQUIRED")
  @NotNull(message = "TOKEN_REQUIRED")
  String token;
}
