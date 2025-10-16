package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.CreateSizeRequest;
import iuh.fit.se.dtos.responses.SizeResponse;
import iuh.fit.se.services.interfaces.ISizeService;
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
@RequestMapping("${api.prefix}/sizes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Size Management", description = "APIs for managing product sizes")
public class SizeController {

  ISizeService sizeService;

  @PostMapping
  @Operation(summary = "Create new size", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<SizeResponse> createSize(@Valid @RequestBody CreateSizeRequest request) {
    log.info("Creating size with name: {}", request.getName());
    SizeResponse response = sizeService.createSize(request);
    return APIResponse.<SizeResponse>builder()
        .result(response)
        .message("Size created successfully")
        .code(HttpStatus.CREATED.value())
        .build();
  }

  @PutMapping("/{id}")
  @Operation(summary = "Update size", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<SizeResponse> updateSize(
      @PathVariable Long id, @Valid @RequestBody CreateSizeRequest request) {
    log.info("Updating size with ID: {}", id);
    SizeResponse response = sizeService.updateSize(id, request);
    return APIResponse.<SizeResponse>builder()
        .result(response)
        .message("Size updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete size", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Void> deleteSize(@PathVariable Long id) {
    log.info("Deleting size with ID: {}", id);
    sizeService.deleteSize(id);
    return APIResponse.<Void>builder()
        .message("Size deleted successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get size by ID")
  public APIResponse<SizeResponse> getSizeById(@PathVariable Long id) {
    log.info("Getting size with ID: {}", id);
    SizeResponse response = sizeService.getSizeById(id);
    return APIResponse.<SizeResponse>builder()
        .result(response)
        .message("Size retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping
  @Operation(summary = "Get all sizes with pagination")
  public APIResponse<Page<SizeResponse>> getAllSizes(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir) {

    Sort sort =
        sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<SizeResponse> response = sizeService.getAllSizes(pageable);

    return APIResponse.<Page<SizeResponse>>builder()
        .result(response)
        .message("Sizes retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/all")
  @Operation(summary = "Get all sizes without pagination")
  public APIResponse<List<SizeResponse>> getAllSizesWithoutPaging() {
    log.info("Getting all sizes without pagination");
    List<SizeResponse> response = sizeService.getAllSizesWithoutPaging();
    return APIResponse.<List<SizeResponse>>builder()
        .result(response)
        .message("Sizes retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }
}
