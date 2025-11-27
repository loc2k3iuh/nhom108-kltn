package iuh.fit.se.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateAddressRequest {

  @NotBlank(message = "Street is required")
  @Size(max = 200, message = "Street must not exceed 200 characters")
  String street;

  @NotBlank(message = "City is required")
  @Size(max = 100, message = "City must not exceed 100 characters")
  String city;

  @Size(max = 20, message = "Zip code must not exceed 20 characters")
  String zip;

  @NotBlank(message = "Ward is required")
  @Size(max = 100, message = "Ward must not exceed 100 characters")
  String ward;

  @NotBlank(message = "District is required")
  @Size(max = 100, message = "District must not exceed 100 characters")
  String district;

  @NotBlank(message = "Detail address is required")
  @Size(max = 500, message = "Detail address must not exceed 500 characters")
  String detailAddress;

  @NotBlank(message = "Phone number is required")
  @Size(min = 10, max = 15, message = "Phone number must be between 10 and 15 characters")
  String phoneNumber;
}
