package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.AddFavoriteRequest;
import iuh.fit.se.dtos.requests.RemoveFavoriteRequest;
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
      description = "Adds a product to a specified user's favorites list. Requires ADMIN role or the user must be adding to their own list.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  public APIResponse<FavoriteResponse> addToFavorites(
      @Valid @RequestBody AddFavoriteRequest request) {
    log.info("Request to add product {} to favorites for user {}", request.getProductId(), request.getUserId());
    FavoriteResponse response = favoriteService.addToFavorites(request);
    return APIResponse.<FavoriteResponse>builder()
        .code(HttpStatus.CREATED.value())
        .message("Product added to favorites successfully")
        .result(response)
        .build();
  }

  @DeleteMapping
  @Operation(
      summary = "Remove product from favorites",
      description = "Removes a product from a specified user's favorites list. Requires ADMIN role or the user must be removing from their own list.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  public APIResponse<Void> removeFromFavorites(
      @Valid @RequestBody RemoveFavoriteRequest request) {
    log.info("Request to remove product {} from favorites for user {}", request.getProductId(), request.getUserId());
    favoriteService.removeFromFavorites(request);
    return APIResponse.<Void>builder()
        .code(HttpStatus.NO_CONTENT.value())
        .message("Product removed from favorites successfully")
        .build();
  }

  @GetMapping("/users/{userId}")
  @Operation(
      summary = "Get user favorites with pagination",
      description = "Retrieves favorite products for a specific user. Requires ADMIN role or the user must be accessing their own list.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  public APIResponse<Page<FavoriteResponse>> getUserFavorites(
      @Parameter(description = "ID of the user") @PathVariable Long userId,
      @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
      @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
      @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdDate") String sortBy,
      @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "desc") String sortDir) {
    log.info("Request to get favorites for user {} - page: {}, size: {}", userId, page, size);
    Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
    Page<FavoriteResponse> favorites = favoriteService.getUserFavorites(userId, pageable);
    return APIResponse.<Page<FavoriteResponse>>builder()
        .code(HttpStatus.OK.value())
        .message("User favorites retrieved successfully")
        .result(favorites)
        .build();
  }

  @GetMapping("/users/{userId}/list")
  @Operation(
      summary = "Get all user favorites as a list",
      description = "Retrieves all favorite products for a specific user as a simple list. Requires ADMIN role or the user must be accessing their own list.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  public APIResponse<List<FavoriteResponse>> getUserFavoritesList(
      @Parameter(description = "ID of the user") @PathVariable Long userId) {
    log.info("Request to get all favorites as a list for user {}", userId);
    List<FavoriteResponse> favorites = favoriteService.getUserFavoritesList(userId);
    return APIResponse.<List<FavoriteResponse>>builder()
        .code(HttpStatus.OK.value())
        .message("User favorites list retrieved successfully")
        .result(favorites)
        .build();
  }

  @GetMapping("/users/{userId}/products/{productId}/check")
  @Operation(
      summary = "Check if a product is favorited by a user",
      description = "Checks if a specific product is in a user's favorites list. Requires ADMIN role or the user must be checking their own list.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  public APIResponse<Boolean> isProductFavorited(
      @Parameter(description = "ID of the user") @PathVariable Long userId,
      @Parameter(description = "ID of the product to check") @PathVariable Long productId) {
    log.info("Request to check if product {} is favorited by user {}", productId, userId);
    boolean isFavorited = favoriteService.isProductFavorited(productId, userId);
    return APIResponse.<Boolean>builder()
        .code(HttpStatus.OK.value())
        .message("Favorite status retrieved successfully")
        .result(isFavorited)
        .build();
  }

  @GetMapping("/users/{userId}/count")
  @Operation(
      summary = "Get user's favorites count",
      description = "Gets the total count of favorite products for a specific user. Requires ADMIN role or the user must be accessing their own list.",
      security = @SecurityRequirement(name = "Bearer Authentication"))
  public APIResponse<Long> getUserFavoritesCount(
      @Parameter(description = "ID of the user") @PathVariable Long userId) {
    log.info("Request to get favorites count for user {}", userId);
    long count = favoriteService.getUserFavoritesCount(userId);
    return APIResponse.<Long>builder()
        .code(HttpStatus.OK.value())
        .message("Favorites count retrieved successfully")
        .result(count)
        .build();
  }
}
