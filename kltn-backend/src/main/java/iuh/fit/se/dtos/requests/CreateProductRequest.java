package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.*;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateProductRequest {

  @NotBlank(message = "Product name is required")
  @Size(max = 255, message = "Product name must not exceed 255 characters")
  String name;

  @Size(max = 5000, message = "Description must not exceed 5000 characters")
  String description;

  @NotNull(message = "Base price is required")
  @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than 0")
  Double basePrice;

  @NotNull(message = "Category ID is required")
  Long categoryId;

  @NotNull(message = "Brand ID is required")
  Long brandId;

  List<MultipartFile> images;

  @Builder.Default String status = "ACTIVE";
}
