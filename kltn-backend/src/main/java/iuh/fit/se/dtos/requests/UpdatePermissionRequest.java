package iuh.fit.se.dtos.requests;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdatePermissionRequest {

  String description;
}
