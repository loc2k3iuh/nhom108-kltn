package iuh.fit.se.dtos.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Set;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PreLoginResponse {

  String email;

  @JsonProperty("roles")
  Set<RoleResponse> roles;
}
