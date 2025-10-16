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
@Schema(description = "Request to add a product to favorites")
public class AddFavoriteRequest {

  @NotNull(message = "Product ID cannot be null")
  @Schema(description = "ID of the product to add to favorites", example = "1")
  Long productId;
}
