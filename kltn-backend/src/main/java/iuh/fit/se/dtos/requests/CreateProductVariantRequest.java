package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateProductVariantRequest {

  @NotNull(message = "Product ID is required")
  Long productId;

  @NotBlank(message = "SKU is required")
  @Size(max = 100, message = "SKU must not exceed 100 characters")
  String sku;

  @NotNull(message = "Price is required")
  @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
  Double price;

  @NotNull(message = "Stock quantity is required")
  @Min(value = 0, message = "Stock quantity must not be negative")
  Integer stockQuantity;

  @Size(max = 255, message = "Material must not exceed 255 characters")
  String material;

  MultipartFile imageFile;

  @NotNull(message = "Size ID is required")
  Long sizeId;

  @NotNull(message = "Color ID is required")
  Long colorId;
}
