package iuh.fit.se.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import iuh.fit.se.api_responses.APIResponse;
import iuh.fit.se.dtos.requests.AddToCartRequest;
import iuh.fit.se.dtos.requests.UpdateCartItemRequest;
import iuh.fit.se.dtos.responses.CartItemResponse;
import iuh.fit.se.dtos.responses.CartResponse;
import iuh.fit.se.services.interfaces.ICartService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/cart")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Cart Management", description = "APIs for managing shopping cart")
public class CartController {

  ICartService cartService;

  @GetMapping("/user/{userId}")
  @Operation(summary = "Get user cart", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<CartResponse> getUserCart(@PathVariable Long userId) {
    log.info("Getting cart for user ID: {}", userId);
    CartResponse response = cartService.getUserCart(userId);
    return APIResponse.<CartResponse>builder()
        .result(response)
        .message("Cart retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @PostMapping("/add")
  @Operation(summary = "Add item to cart", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<CartItemResponse> addToCart(@Valid @RequestBody AddToCartRequest request) {
    log.info("Adding item to cart for user ID: {}", request.getUserId());
    CartItemResponse response = cartService.addToCart(request);
    return APIResponse.<CartItemResponse>builder()
        .result(response)
        .message("Item added to cart successfully")
        .code(HttpStatus.CREATED.value())
        .build();
  }

  @PutMapping("/items/{cartItemId}")
  @Operation(summary = "Update cart item", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<CartItemResponse> updateCartItem(
      @PathVariable Long cartItemId, @Valid @RequestBody UpdateCartItemRequest request) {
    log.info("Updating cart item with ID: {}", cartItemId);
    CartItemResponse response = cartService.updateCartItem(cartItemId, request);
    return APIResponse.<CartItemResponse>builder()
        .result(response)
        .message("Cart item updated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @DeleteMapping("/items/{cartItemId}")
  @Operation(summary = "Remove cart item", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<Void> removeCartItem(@PathVariable Long cartItemId) {
    log.info("Removing cart item with ID: {}", cartItemId);
    cartService.removeCartItem(cartItemId);
    return APIResponse.<Void>builder()
        .message("Cart item removed successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @DeleteMapping("/user/{userId}/clear")
  @Operation(summary = "Clear user cart", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<Void> clearCart(@PathVariable Long userId) {
    log.info("Clearing cart for user ID: {}", userId);
    cartService.clearCart(userId);
    return APIResponse.<Void>builder()
        .message("Cart cleared successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/user/{userId}/items")
  @Operation(summary = "Get cart items", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<List<CartItemResponse>> getCartItems(@PathVariable Long userId) {
    List<CartItemResponse> response = cartService.getCartItems(userId);
    return APIResponse.<List<CartItemResponse>>builder()
        .result(response)
        .message("Cart items retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/user/{userId}/total")
  @Operation(summary = "Get cart total", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<Double> getCartTotal(@PathVariable Long userId) {
    log.info("Getting cart total for user ID: {}", userId);
    Double total = cartService.getCartTotal(userId);
    return APIResponse.<Double>builder()
        .result(total)
        .message("Cart total calculated successfully")
        .code(HttpStatus.OK.value())
        .build();
  }

  @GetMapping("/user/{userId}/count")
  @Operation(summary = "Get cart item count", security = @SecurityRequirement(name = "bearerAuth"))
  @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
  public APIResponse<Integer> getCartItemCount(@PathVariable Long userId) {
    log.info("Getting cart item count for user ID: {}", userId);
    Integer count = cartService.getCartItemCount(userId);
    return APIResponse.<Integer>builder()
        .result(count)
        .message("Cart item count retrieved successfully")
        .code(HttpStatus.OK.value())
        .build();
  }
}
