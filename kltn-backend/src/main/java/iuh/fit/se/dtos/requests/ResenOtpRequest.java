package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResenOtpRequest {

  @NotBlank(message = "EMAIL_REQUIRED")
  String email;
}
