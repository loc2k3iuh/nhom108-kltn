package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.AddFavoriteRequest;
import iuh.fit.se.dtos.responses.FavoriteResponse;
import iuh.fit.se.services.interfaces.IFavoriteService;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/favorites")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Favorite Management", description = "APIs for managing user favorite products")
public class FavoriteController {

  IFavoriteService favoriteService;

  @PostMapping
  @Operation(
      summary = "Add product to favorites",
      description =
          "Add a product to the authenticated user's favorites list. Requires authentication.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
  public APIResponse<FavoriteResponse> addToFavorites(
      @Valid @RequestBody AddFavoriteRequest request) {

    log.info("Request to add product {} to favorites", request.getProductId());
    Long userId = getCurrentUserId();

    FavoriteResponse response = favoriteService.addToFavorites(request, userId);

    return APIResponse.<FavoriteResponse>builder()
        .code(HttpStatus.CREATED.value())
        .message("Product added to favorites successfully")
        .result(response)
        .build();
  }

  @DeleteMapping("/products/{productId}")
  @Operation(
      summary = "Remove product from favorites",
      description =
          "Remove a product from the authenticated user's favorites list. Requires authentication.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
  public APIResponse<Void> removeFromFavorites(
      @Parameter(description = "ID of the product to remove from favorites") @PathVariable
          Long productId) {

    log.info("Request to remove product {} from favorites", productId);
    Long userId = getCurrentUserId();

    favoriteService.removeFromFavorites(productId, userId);

    return APIResponse.<Void>builder()
        .code(HttpStatus.NO_CONTENT.value())
        .message("Product removed from favorites successfully")
        .build();
  }

  @GetMapping
  @Operation(
      summary = "Get user favorites with pagination",
      description =
          "Get the authenticated user's favorite products with pagination support. Requires authentication.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
  public APIResponse<Page<FavoriteResponse>> getUserFavorites(
      @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
      @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdDate")
          String sortBy,
      @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "desc")
          String sortDir) {

    log.info("Request to get user favorites - page: {}, size: {}", page, size);
    Long userId = getCurrentUserId();

    Sort.Direction direction =
        sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

    Page<FavoriteResponse> favorites = favoriteService.getUserFavorites(userId, pageable);

    return APIResponse.<Page<FavoriteResponse>>builder()
        .code(HttpStatus.OK.value())
        .message("User favorites retrieved successfully")
        .result(favorites)
        .build();
  }

  @GetMapping("/list")
  @Operation(
      summary = "Get all user favorites as list",
      description =
          "Get all favorite products of the authenticated user as a simple list. Requires authentication.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
  public APIResponse<List<FavoriteResponse>> getUserFavoritesList() {

    log.info("Request to get all user favorites as list");
    Long userId = getCurrentUserId();

    List<FavoriteResponse> favorites = favoriteService.getUserFavoritesList(userId);

    return APIResponse.<List<FavoriteResponse>>builder()
        .code(HttpStatus.OK.value())
        .message("User favorites list retrieved successfully")
        .result(favorites)
        .build();
  }

  @GetMapping("/check/{productId}")
  @Operation(
      summary = "Check if product is favorited",
      description =
          "Check if a specific product is in the authenticated user's favorites. Requires authentication.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
  public APIResponse<Boolean> isProductFavorited(
      @Parameter(description = "ID of the product to check") @PathVariable Long productId) {

    log.info("Request to check if product {} is favorited", productId);
    Long userId = getCurrentUserId();

    boolean isFavorited = favoriteService.isProductFavorited(productId, userId);

    return APIResponse.<Boolean>builder()
        .code(HttpStatus.OK.value())
        .message("Favorite status retrieved successfully")
        .result(isFavorited)
        .build();
  }

  @GetMapping("/count")
  @Operation(
      summary = "Get user favorites count",
      description =
          "Get the total count of favorite products for the authenticated user. Requires authentication.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
  public APIResponse<Long> getUserFavoritesCount() {

    log.info("Request to get user favorites count");
    Long userId = getCurrentUserId();

    long count = favoriteService.getUserFavoritesCount(userId);

    return APIResponse.<Long>builder()
        .code(HttpStatus.OK.value())
        .message("Favorites count retrieved successfully")
        .result(count)
        .build();
  }

  // Admin endpoints
  @GetMapping("/users/{userId}")
  @Operation(
      summary = "Get user favorites by admin",
      description = "Get favorite products of a specific user. Requires ADMIN role.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  @PreAuthorize("hasRole('ADMIN')")
  public APIResponse<Page<FavoriteResponse>> getUserFavoritesByAdmin(
      @Parameter(description = "ID of the user to get favorites for") @PathVariable Long userId,
      @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
      @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdDate")
          String sortBy,
      @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "desc")
          String sortDir) {

    log.info("Admin request to get favorites for user {} - page: {}, size: {}", userId, page, size);

    Sort.Direction direction =
        sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

    Page<FavoriteResponse> favorites = favoriteService.getUserFavorites(userId, pageable);

    return APIResponse.<Page<FavoriteResponse>>builder()
        .code(HttpStatus.OK.value())
        .message("User favorites retrieved successfully")
        .result(favorites)
        .build();
  }

  private Long getCurrentUserId() {
    return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
  }
}
