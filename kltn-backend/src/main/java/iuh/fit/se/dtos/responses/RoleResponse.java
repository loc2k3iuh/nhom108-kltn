package iuh.fit.se.dtos.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

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
