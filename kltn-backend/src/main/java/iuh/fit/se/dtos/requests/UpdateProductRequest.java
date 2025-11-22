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
public class UpdateProductRequest {

  @Size(max = 255, message = "Product name must not exceed 255 characters")
  String name;

  @Size(max = 5000, message = "Description must not exceed 5000 characters")
  String description;

  @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than 0")
  Double basePrice;

  Long categoryId;

  Long brandId;

  List<MultipartFile> newImages;

  List<Long> imagesToDelete;

  String status;
}
