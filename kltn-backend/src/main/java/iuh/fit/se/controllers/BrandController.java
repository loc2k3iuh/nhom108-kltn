package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.responses.BrandResponse;
import iuh.fit.se.services.interfaces.IBrandService;
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
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/brands")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Brand Management", description = "APIs for managing brands")
public class BrandController {

  IBrandService brandService;

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Create new brand", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<BrandResponse> createBrand(
      @Parameter(description = "Brand name", required = true) @RequestParam String name,
      @Parameter(description = "Brand description") @RequestParam(required = false)
          String description,
      @Parameter(description = "Brand logo file") @RequestParam(required = false)
          MultipartFile logoFile) {
    log.info("Creating brand with name: {}", name);
    BrandResponse response = brandService.createBrand(name, description, logoFile);
    return APIResponse.<BrandResponse>builder()
        .result(response)
        .message("Brand created successfully")
        .code(HttpStatus.CREATED.value())
        .build();
  }

  @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @Operation(summary = "Update brand", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<BrandResponse> updateBrand(
      @Parameter(description = "Brand ID", required = true) @PathVariable Long id,
      @Parameter(description = "Brand name") @RequestParam(required = false) String name,
      @Parameter(description = "Brand description") @RequestParam(required = false)
          String description,
      @Parameter(description = "Brand logo file") @RequestParam(required = false)
          MultipartFile logoFile) {
    log.info("Updating brand with ID: {}", id);
    BrandResponse response = brandService.updateBrand(id, name, description, logoFile);
    return APIResponse.<BrandResponse>builder()
        .result(response)
        .message("Brand updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete brand", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Void> deleteBrand(
      @Parameter(description = "Brand ID", required = true) @PathVariable Long id) {
    log.info("Deleting brand with ID: {}", id);
    brandService.deleteBrand(id);
    return APIResponse.<Void>builder()
        .message("Brand deleted successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get brand by ID")
  public APIResponse<BrandResponse> getBrandById(
      @Parameter(description = "Brand ID", required = true) @PathVariable Long id) {
    log.info("Getting brand with ID: {}", id);
    BrandResponse response = brandService.getBrandById(id);
    return APIResponse.<BrandResponse>builder()
        .result(response)
        .message("Brand retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping
  @Operation(summary = "Get all brands with pagination")
  public APIResponse<Page<BrandResponse>> getAllBrands(
      @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
      @Parameter(description = "Sort field") @RequestParam(defaultValue = "id") String sortBy,
      @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "desc")
          String sortDir) {
    log.info(
        "Getting all brands - page: {}, size: {}, sortBy: {}, sortDir: {}",
        page,
        size,
        sortBy,
        sortDir);

    Sort.Direction direction =
        sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

    Page<BrandResponse> response = brandService.getAllBrands(pageable);
    return APIResponse.<Page<BrandResponse>>builder()
        .result(response)
        .message("Brands retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/all")
  @Operation(summary = "Get all brands without pagination")
  public APIResponse<List<BrandResponse>> getAllBrandsWithoutPaging() {
    log.info("Getting all brands without pagination");
    List<BrandResponse> response = brandService.getAllBrandsWithoutPaging();
    return APIResponse.<List<BrandResponse>>builder()
        .result(response)
        .message("All brands retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }
}
