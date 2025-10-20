package iuh.fit.se.dtos.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Schema(description = "Request to remove a product from favorites")
public class RemoveFavoriteRequest {

  @NotNull(message = "User ID cannot be null")
  @Schema(description = "ID of the user", example = "1")
  Long userId;

  @NotNull(message = "Product ID cannot be null")
  @Schema(description = "ID of the product to remove from favorites", example = "1")
  Long productId;
}
