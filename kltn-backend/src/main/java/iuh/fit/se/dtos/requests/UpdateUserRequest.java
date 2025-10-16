package iuh.fit.se.dtos.requests;

import iuh.fit.se.validators.users.dobs.DobConstraint;
import iuh.fit.se.validators.users.fullnames.FullNameConstraint;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateUserRequest {

  @Size(min = 5, message = "FULLNAME_INVALID")
  @FullNameConstraint(message = "FULLNAME_INVALID")
  String fullName;

  @Pattern(regexp = "^(09|03|02|07)\\d{8}$", message = "PHONE_INVALID")
  String phoneNumber;

  String address;

  @DobConstraint(min = 18, message = "DOB_INVALID")
  LocalDate dateOfBirth;

  MultipartFile file;
}
