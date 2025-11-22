package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.responses.CategoryResponse;
import iuh.fit.se.services.interfaces.ICategoryService;
import jakarta.validation.constraints.NotBlank;
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
@RequestMapping("${api.prefix}/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Category Management", description = "APIs for managing product categories")
public class CategoryController {

  ICategoryService categoryService;

  @PostMapping
  @Operation(summary = "Create new category", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<CategoryResponse> createCategory(
      @RequestParam @NotBlank(message = "Category name is required") String name,
      @RequestParam(required = false) String description,
      @RequestParam(required = false) Long parentId) {
    log.info("Creating category with name: {} and parentId: {}", name, parentId);
    CategoryResponse response = categoryService.createCategory(name, description, parentId);
    return APIResponse.<CategoryResponse>builder()
        .result(response)
        .message("Category created successfully")
        .code(HttpStatus.CREATED.value())
        .build();
  }

  @PutMapping("/{id}")
  @Operation(summary = "Update category", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
  public APIResponse<CategoryResponse> updateCategory(
      @PathVariable Long id,
      @RequestParam(required = false) String name,
      @RequestParam(required = false) String description,
      @RequestParam(required = false) Long parentId) {
    log.info("Updating category with ID: {}", id);
    CategoryResponse response = categoryService.updateCategory(id, name, description, parentId);
    return APIResponse.<CategoryResponse>builder()
        .result(response)
        .message("Category updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete category", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Void> deleteCategory(@PathVariable Long id) {
    log.info("Deleting category with ID: {}", id);
    categoryService.deleteCategory(id);
    return APIResponse.<Void>builder()
        .message("Category deleted successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get category by ID")
  public APIResponse<CategoryResponse> getCategoryById(@PathVariable Long id) {
    log.info("Getting category with ID: {}", id);
    CategoryResponse response = categoryService.getCategoryById(id);
    return APIResponse.<CategoryResponse>builder()
        .result(response)
        .message("Category retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping
  @Operation(summary = "Get all categories with pagination")
  public APIResponse<Page<CategoryResponse>> getAllCategories(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir) {

    Sort sort =
        sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<CategoryResponse> response = categoryService.getAllCategories(pageable);

    return APIResponse.<Page<CategoryResponse>>builder()
        .result(response)
        .message("Categories retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/all")
  @Operation(summary = "Get all categories without pagination")
  public APIResponse<List<CategoryResponse>> getAllCategoriesWithoutPaging() {
    log.info("Getting all categories without pagination");
    List<CategoryResponse> response = categoryService.getAllCategoriesWithoutPaging();
    return APIResponse.<List<CategoryResponse>>builder()
        .result(response)
        .message("Categories retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/root")
  @Operation(summary = "Get root categories (categories without parent)")
  public APIResponse<List<CategoryResponse>> getRootCategories() {
    log.info("Getting root categories");
    List<CategoryResponse> response = categoryService.getRootCategories();
    return APIResponse.<List<CategoryResponse>>builder()
        .result(response)
        .message("Root categories retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/{parentId}/subcategories")
  @Operation(summary = "Get subcategories by parent ID")
  public APIResponse<List<CategoryResponse>> getSubCategories(@PathVariable Long parentId) {
    log.info("Getting subcategories for parent ID: {}", parentId);
    List<CategoryResponse> response = categoryService.getSubCategories(parentId);
    return APIResponse.<List<CategoryResponse>>builder()
        .result(response)
        .message("Subcategories retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }
}
