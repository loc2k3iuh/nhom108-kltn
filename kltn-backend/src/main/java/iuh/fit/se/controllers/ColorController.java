package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.CreateColorRequest;
import iuh.fit.se.dtos.responses.ColorResponse;
import iuh.fit.se.services.interfaces.IColorService;
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
@RequestMapping("${api.prefix}/colors")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Color Management", description = "APIs for managing product colors")
public class ColorController {

  IColorService colorService;

  @PostMapping
  @Operation(summary = "Create new color", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<ColorResponse> createColor(@Valid @RequestBody CreateColorRequest request) {
    log.info("Creating color with name: {}", request.getName());
    ColorResponse response = colorService.createColor(request);
    return APIResponse.<ColorResponse>builder()
        .result(response)
        .message("Color created successfully")
        .code(HttpStatus.CREATED.value())
        .build();
  }

  @PutMapping("/{id}")
  @Operation(summary = "Update color", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<ColorResponse> updateColor(
      @PathVariable Long id, @Valid @RequestBody CreateColorRequest request) {
    log.info("Updating color with ID: {}", id);
    ColorResponse response = colorService.updateColor(id, request);
    return APIResponse.<ColorResponse>builder()
        .result(response)
        .message("Color updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete color", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Void> deleteColor(@PathVariable Long id) {
    log.info("Deleting color with ID: {}", id);
    colorService.deleteColor(id);
    return APIResponse.<Void>builder()
        .message("Color deleted successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get color by ID")
  public APIResponse<ColorResponse> getColorById(@PathVariable Long id) {
    log.info("Getting color with ID: {}", id);
    ColorResponse response = colorService.getColorById(id);
    return APIResponse.<ColorResponse>builder()
        .result(response)
        .message("Color retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping
  @Operation(summary = "Get all colors with pagination")
  public APIResponse<Page<ColorResponse>> getAllColors(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir) {

    Sort sort =
        sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<ColorResponse> response = colorService.getAllColors(pageable);

    return APIResponse.<Page<ColorResponse>>builder()
        .result(response)
        .message("Colors retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/all")
  @Operation(summary = "Get all colors without pagination")
  public APIResponse<List<ColorResponse>> getAllColorsWithoutPaging() {
    log.info("Getting all colors without pagination");
    List<ColorResponse> response = colorService.getAllColorsWithoutPaging();
    return APIResponse.<List<ColorResponse>>builder()
        .result(response)
        .message("Colors retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }
}
