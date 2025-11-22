package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.CreateReviewRequest;
import iuh.fit.se.dtos.responses.ReviewResponse;
import iuh.fit.se.services.interfaces.IReviewService;
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
@RequestMapping("${api.prefix}/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Review Management", description = "APIs for managing product reviews")
public class ReviewController {

  IReviewService reviewService;

  @PostMapping
  @Operation(
      summary = "Create product review",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER')")
  public APIResponse<ReviewResponse> createReview(@Valid @RequestBody CreateReviewRequest request) {
    log.info(
        "Creating review for product ID: {} by user ID: {}",
        request.getProductId(),
        request.getUserId());
    ReviewResponse response = reviewService.createReview(request);
    return APIResponse.<ReviewResponse>builder()
        .result(response)
        .message("Review created successfully")
        .code(HttpStatus.CREATED.value())
        .build();
  }

  @PutMapping("/{id}")
  @Operation(
      summary = "Update product review",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER')")
  public APIResponse<ReviewResponse> updateReview(
      @PathVariable Long id, @Valid @RequestBody CreateReviewRequest request) {
    log.info("Updating review with ID: {}", id);
    ReviewResponse response = reviewService.updateReview(id, request);
    return APIResponse.<ReviewResponse>builder()
        .result(response)
        .message("Review updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete review", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<Void> deleteReview(@PathVariable Long id) {
    log.info("Deleting review with ID: {}", id);
    reviewService.deleteReview(id);
    return APIResponse.<Void>builder()
        .message("Review deleted successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/{id}")
  @Operation(summary = "Get review by ID")
  public APIResponse<ReviewResponse> getReviewById(@PathVariable Long id) {
    log.info("Getting review with ID: {}", id);
    ReviewResponse response = reviewService.getReviewById(id);
    return APIResponse.<ReviewResponse>builder()
        .result(response)
        .message("Review retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/product/{productId}")
  @Operation(summary = "Get reviews by product ID")
  public APIResponse<Page<ReviewResponse>> getReviewsByProduct(
      @PathVariable Long productId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir) {

    Sort sort =
        sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<ReviewResponse> response = reviewService.getReviewsByProduct(productId, pageable);

    return APIResponse.<Page<ReviewResponse>>builder()
        .result(response)
        .message("Product reviews retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/user/{userId}")
  @Operation(
      summary = "Get reviews by user ID",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize(
      "hasRole('CUSTOMER') and #userId == authentication.principal.claims['userId'] or hasRole('ADMIN')")
  public APIResponse<Page<ReviewResponse>> getReviewsByUser(
      @PathVariable Long userId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir) {

    Sort sort =
        sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<ReviewResponse> response = reviewService.getReviewsByUser(userId, pageable);

    return APIResponse.<Page<ReviewResponse>>builder()
        .result(response)
        .message("User reviews retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/product/{productId}/average-rating")
  @Operation(summary = "Get average rating for product")
  public APIResponse<Double> getAverageRatingByProduct(@PathVariable Long productId) {
    log.info("Getting average rating for product ID: {}", productId);
    Double averageRating = reviewService.getAverageRatingByProduct(productId);
    return APIResponse.<Double>builder()
        .result(averageRating)
        .message("Average rating retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/product/{productId}/total-reviews")
  @Operation(summary = "Get total reviews count for product")
  public APIResponse<Long> getTotalReviewsByProduct(@PathVariable Long productId) {
    log.info("Getting total reviews count for product ID: {}", productId);
    Long totalReviews = reviewService.getTotalReviewsByProduct(productId);
    return APIResponse.<Long>builder()
        .result(totalReviews)
        .message("Total reviews count retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/product/{productId}/user/{userId}/exists")
  @Operation(
      summary = "Check if user has reviewed product",
      security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize(
      "hasRole('CUSTOMER') and #userId == authentication.principal.claims['userId'] or hasRole('ADMIN')")
  public APIResponse<Boolean> hasUserReviewedProduct(
      @PathVariable Long productId, @PathVariable Long userId) {
    log.info("Checking if user ID: {} has reviewed product ID: {}", userId, productId);
    boolean hasReviewed = reviewService.hasUserReviewedProduct(userId, productId);
    return APIResponse.<Boolean>builder()
        .result(hasReviewed)
        .message("Review existence check completed")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/product/{productId}/rating/{rating}")
  @Operation(summary = "Get reviews by product and rating")
  public APIResponse<List<ReviewResponse>> getReviewsByProductAndRating(
      @PathVariable Long productId, @PathVariable Long rating) {
    log.info("Getting reviews for product ID: {} with rating: {}", productId, rating);
    List<ReviewResponse> response = reviewService.getReviewsByProductAndRating(productId, rating);
    return APIResponse.<List<ReviewResponse>>builder()
        .result(response)
        .message("Reviews by rating retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }
}
