package iuh.fit.se.dtos.responses;

import java.util.Set;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleResponse {

  String name;
  String description;
  Set<PermissionResponse> permissions;
}
