package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateColorRequest {

  @NotBlank(message = "Color name is required")
  @Size(max = 100, message = "Color name must not exceed 100 characters")
  String name;

  @Size(max = 500, message = "Description must not exceed 500 characters")
  String description;
}
