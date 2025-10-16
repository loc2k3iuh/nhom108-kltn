package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateSizeRequest {

  @NotBlank(message = "Size name is required")
  @Size(max = 50, message = "Size name must not exceed 50 characters")
  String name;

  @Size(max = 500, message = "Description must not exceed 500 characters")
  String description;
}
