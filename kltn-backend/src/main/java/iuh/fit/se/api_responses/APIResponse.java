package iuh.fit.se.api_responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class APIResponse<T> {

  @Builder.Default int code = 200;

  String message;

  T result;

  private String path;
  private String requestId;
  private String timestamp;
}
