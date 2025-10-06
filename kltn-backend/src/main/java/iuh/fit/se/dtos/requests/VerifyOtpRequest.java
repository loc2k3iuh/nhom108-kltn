package iuh.fit.se.dtos.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VerifyOtpRequest {

  @NotBlank(message = "EMAIL_REQUIRED")
  String email;

  @NotBlank(message = "OTP_REQUIRED")
  @Pattern(regexp = "^\\d{6}$", message = "OTP_INVALID")
  @JsonProperty("otp_token")
  String optToken;
}
