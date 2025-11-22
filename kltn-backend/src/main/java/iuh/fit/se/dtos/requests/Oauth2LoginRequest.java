package iuh.fit.se.dtos.requests;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Oauth2LoginRequest {

    @NotBlank(message = "EMAIL_REQUIRED")
    String email;

    @NotBlank(message = "FULLNAME_REQUIRED")
    @JsonProperty("full_name")
    String fullName;

    String avatar;

    @JsonProperty("is_remembered")
    Boolean isRemembered;


    @JsonProperty("google_id")
    String googleId;

    @JsonProperty("facebook_id")
    String facebookId;
}
