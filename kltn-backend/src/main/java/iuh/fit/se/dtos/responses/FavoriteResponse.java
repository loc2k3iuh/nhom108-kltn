package iuh.fit.se.dtos.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Schema(description = "Response containing favorite information")
public class FavoriteResponse {

  @Schema(description = "Favorite ID", example = "1")
  Long id;

  @Schema(description = "User ID who favorited the product", example = "1")
  Long userId;

  @Schema(description = "Favorited product information")
  ProductResponse product;

  @Schema(description = "Date when the product was added to favorites")
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  LocalDateTime createdDate;
}
