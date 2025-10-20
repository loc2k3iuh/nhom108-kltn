package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateProductVariantRequest {

  @Size(max = 100, message = "SKU must not exceed 100 characters")
  String sku;

  @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
  Double price;

  @Min(value = 0, message = "Stock quantity must not be negative")
  Integer stockQuantity;

  @Size(max = 255, message = "Material must not exceed 255 characters")
  String material;

  MultipartFile imageFile;

  Long sizeId;

  Long colorId;

}
