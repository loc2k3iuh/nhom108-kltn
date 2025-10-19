package iuh.fit.se.dtos.responses;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserListResponse {
  List<UserResponse> users;

  @JsonProperty("total_page")
  int totalPage;
}
