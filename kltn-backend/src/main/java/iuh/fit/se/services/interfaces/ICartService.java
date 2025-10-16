package iuh.fit.se.services.interfaces;

import iuh.fit.se.dtos.requests.AddToCartRequest;
import iuh.fit.se.dtos.requests.UpdateCartItemRequest;
import iuh.fit.se.dtos.responses.CartItemResponse;
import iuh.fit.se.dtos.responses.CartResponse;
import java.util.List;

public interface ICartService {
  CartResponse getUserCart(Long userId);

  CartItemResponse addToCart(AddToCartRequest request);

  CartItemResponse updateCartItem(Long cartItemId, UpdateCartItemRequest request);

  void removeCartItem(Long cartItemId);

  void clearCart(Long userId);

  List<CartItemResponse> getCartItems(Long userId);

  Double getCartTotal(Long userId);

  Integer getCartItemCount(Long userId);
}
