package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Set;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleRequest {

  @NotBlank(message = "ROLE_REQUIRED")
  String name;

  String description;

  @NotNull(message = "PERMISSIONS_REQUIRED")
  @NotEmpty(message = "PERMISSIONS_REQUIRED")
  Set<String> permissions;
}
