package iuh.fit.se.services.impls;

import iuh.fit.se.dtos.requests.AddToCartRequest;
import iuh.fit.se.dtos.requests.UpdateCartItemRequest;
import iuh.fit.se.dtos.responses.CartItemResponse;
import iuh.fit.se.dtos.responses.CartResponse;
import iuh.fit.se.entities.*;
import iuh.fit.se.exceptions.AppException;
import iuh.fit.se.exceptions.ErrorCode;
import iuh.fit.se.mapper.CartItemMapper;
import iuh.fit.se.mapper.CartMapper;
import iuh.fit.se.repositories.*;
import iuh.fit.se.services.interfaces.ICartService;
import iuh.fit.se.services.interfaces.IPriceService;

import java.util.List;
import java.util.Optional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CartService implements ICartService {

  CartRepository cartRepository;
  CartItemRepository cartItemRepository;
  UserRepository userRepository;
  ProductRepository productRepository;
  ProductVariantRepository productVariantRepository;
  CartMapper cartMapper;
  CartItemMapper cartItemMapper;
  IPriceService priceService;

  @Override
  public CartResponse getUserCart(Long userId) {
    log.info("Getting cart for user ID: {}", userId);

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> createNewCart(user));

    return buildCartResponse(cart);
  }

  @Override
  @Transactional
  public CartItemResponse addToCart(AddToCartRequest request) {
    log.info("Adding product to cart for user ID: {}", request.getUserId());

    // Validate user
    User user =
        userRepository
            .findById(request.getUserId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

    // Validate product
    Product product =
        productRepository
            .findById(request.getProductId())
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

    // Validate product variant if provided
    ProductVariant productVariant = null;
    if (request.getProductVariantId() != null) {
      productVariant =
          productVariantRepository
              .findById(request.getProductVariantId())
              .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND));

      // Check stock availability
      if (productVariant.getStockQuantity() < request.getQuantity()) {
        throw new AppException(ErrorCode.PRODUCT_VARIANT_OUT_OF_STOCK);
      }
    } else {
      // Check base product stock if no variant specified
      if (product.getBasePrice() == null) {
        throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
      }
    }

    // Get or create cart
    Cart cart =
        cartRepository.findByUserId(request.getUserId()).orElseGet(() -> createNewCart(user));

    // Check if item already exists in cart
    Optional<CartItem> existingItem;
    if (request.getProductVariantId() != null) {
      existingItem =
          cartItemRepository.findByCartIdAndProductIdAndProductVariantId(
              cart.getId(), request.getProductId(), request.getProductVariantId());
    } else {
      existingItem =
          cartItemRepository.findByCartIdAndProductIdAndProductVariantIsNull(
              cart.getId(), request.getProductId());
    }

    CartItem cartItem;
    if (existingItem.isPresent()) {
      // Update quantity
      cartItem = existingItem.get();
      cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
    } else {
      // Create new cart item
      cartItem =
          CartItem.builder()
              .quantity(request.getQuantity())
              .cart(cart)
              .product(product)
              .productVariant(productVariant)
              .build();
    }

    CartItem savedItem = cartItemRepository.save(cartItem);
    log.info("Product added to cart successfully");

    return cartItemMapper.toCartItemResponse(savedItem, priceService);
  }

  @Override
  @Transactional
  public CartItemResponse updateCartItem(Long cartItemId, UpdateCartItemRequest request) {
    log.info("Updating cart item with ID: {}", cartItemId);

    CartItem cartItem =
        cartItemRepository
            .findById(cartItemId)
            .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

    if (request.getQuantity() <= 0) {
      throw new AppException(ErrorCode.INVALID_QUANTITY);
    }

    cartItem.setQuantity(request.getQuantity());
    CartItem savedItem = cartItemRepository.save(cartItem);

    log.info("Cart item updated successfully");
    return cartItemMapper.toCartItemResponse(savedItem, priceService);
  }

  @Override
  @Transactional
  public void removeCartItem(Long cartItemId) {
    log.info("Removing cart item with ID: {}", cartItemId);

    if (!cartItemRepository.existsById(cartItemId)) {
      throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
    }

    cartItemRepository.deleteById(cartItemId);
    log.info("Cart item removed successfully");
  }

  @Override
  @Transactional
  public void clearCart(Long userId) {
    log.info("Clearing cart for user ID: {}", userId);

    Cart cart =
        cartRepository
            .findByUserId(userId)
            .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

    cartItemRepository.deleteByCartId(cart.getId());
    log.info("Cart cleared successfully");
  }

  @Override
  public List<CartItemResponse> getCartItems(Long userId) {
    log.info("Getting cart items for user ID: {}", userId);

    Cart cart =
        cartRepository
            .findByUserId(userId)
            .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

    List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
    return cartItems.stream().map(cartItem -> cartItemMapper.toCartItemResponse(cartItem, priceService)).toList();
  }

  @Override
  public Double getCartTotal(Long userId) {
    log.info("Calculating cart total for user ID: {}", userId);

    Cart cart = cartRepository.findByUserId(userId).orElse(null);
    if (cart == null) {
      return 0.0;
    }

    List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
    return cartItems.stream()
        .mapToDouble(item -> priceService.getFinalPrice(item.getProduct(), item.getProductVariant()) * item.getQuantity())
        .sum();
  }

  @Override
  public Integer getCartItemCount(Long userId) {
    log.info("Getting cart item count for user ID: {}", userId);

    Cart cart = cartRepository.findByUserId(userId).orElse(null);
    if (cart == null) {
      return 0;
    }

    return cartItemRepository.countItemsByCartId(cart.getId()).intValue();
  }

  private Cart createNewCart(User user) {
    Cart cart = Cart.builder().user(user).build();
    return cartRepository.save(cart);
  }

  private CartResponse buildCartResponse(Cart cart) {
    List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

    CartResponse response = cartMapper.toCartResponse(cart);

    // Set cart items
    List<CartItemResponse> cartItemResponses =
        cartItems.stream().map(cartItem -> cartItemMapper.toCartItemResponse(cartItem, priceService)).toList();
    response.setCartItems(cartItemResponses);

    // Calculate totals
    double totalAmount =
        cartItemResponses.stream()
            .mapToDouble(item -> item.getItemTotal() != null ? item.getItemTotal() : 0.0)
            .sum();
    response.setTotalAmount(totalAmount);

    int totalItems =
        cartItemResponses.stream().mapToInt(item -> item.getQuantity().intValue()).sum();
    response.setTotalItems(totalItems);

    return response;
  }
}
