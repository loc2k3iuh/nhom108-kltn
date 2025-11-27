package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.CreateAddressRequest;
import iuh.fit.se.dtos.requests.UpdateAddressRequest;
import iuh.fit.se.dtos.responses.AddressResponse;
import iuh.fit.se.services.interfaces.IAddressService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/addresses")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Address Management", description = "APIs for managing user addresses")
public class AddressController {

  IAddressService addressService;

  @PostMapping
  @Operation(summary = "Create new address", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<AddressResponse> createAddress(
      @Valid @RequestBody CreateAddressRequest request) {
    log.info("Creating address");
    AddressResponse response = addressService.createAddress(request);
    return APIResponse.<AddressResponse>builder()
        .result(response)
        .message("Address created successfully")
        .code(HttpStatus.CREATED.value())
        .build();
  }

  @PutMapping("/{id}")
  @Operation(summary = "Update address", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<AddressResponse> updateAddress(
      @PathVariable Long id, @Valid @RequestBody UpdateAddressRequest request) {
    log.info("Updating address with ID: {}", id);
    AddressResponse response = addressService.updateAddress(id, request);
    return APIResponse.<AddressResponse>builder()
        .result(response)
        .message("Address updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete address", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<Void> deleteAddress(@PathVariable Long id) {
    log.info("Deleting address with ID: {}", id);
    addressService.deleteAddress(id);
    return APIResponse.<Void>builder()
        .message("Address deleted successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get address by ID", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<AddressResponse> getAddressById(@PathVariable Long id) {
    log.info("Getting address with ID: {}", id);
    AddressResponse response = addressService.getAddressById(id);
    return APIResponse.<AddressResponse>builder()
        .result(response)
        .message("Address retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping
  @Operation(
      summary = "Get all addresses with pagination",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Page<AddressResponse>> getAllAddresses(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir) {

    Sort sort =
        sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<AddressResponse> response = addressService.getAllAddresses(pageable);

    return APIResponse.<Page<AddressResponse>>builder()
        .result(response)
        .message("Addresses retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/user/{userId}")
  @Operation(
      summary = "Get addresses by user ID",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<List<AddressResponse>> getAddressesByUserId(@PathVariable Long userId) {
    log.info("Getting addresses for user ID: {}", userId);
    List<AddressResponse> response = addressService.getAddressesByUserId(userId);
    return APIResponse.<List<AddressResponse>>builder()
        .result(response)
        .message("Addresses retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/my-addresses")
  @Operation(
      summary = "Get current user's addresses",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<Page<AddressResponse>> getMyAddresses(
      @RequestParam(required = false) String city,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "3") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir) {
    log.info("Getting addresses for current user with pagination and city filter: {}", city);

    Sort sort =
        sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<AddressResponse> response = addressService.getMyAddresses(city, pageable);

    return APIResponse.<Page<AddressResponse>>builder()
        .result(response)
        .message("Addresses retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }
}
