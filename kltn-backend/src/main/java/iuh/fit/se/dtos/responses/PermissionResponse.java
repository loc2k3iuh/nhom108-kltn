package iuh.fit.se.dtos.responses;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionResponse {

  String name;
  String description;
}
