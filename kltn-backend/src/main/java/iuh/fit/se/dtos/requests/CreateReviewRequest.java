package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateReviewRequest {

  @NotNull(message = "User ID is required")
  Long userId;

  @NotNull(message = "Product ID is required")
  Long productId;

  @NotNull(message = "Rating is required")
  @Min(value = 1, message = "Rating must be at least 1")
  @Max(value = 5, message = "Rating must not exceed 5")
  Long rating;

  @Size(max = 1000, message = "Comment must not exceed 1000 characters")
  String comment;
}
