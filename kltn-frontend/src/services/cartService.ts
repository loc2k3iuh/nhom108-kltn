
import axiosInstance from '../lib/axios';
import { Cart, CartItem, AddToCartPayload, UpdateCartItemPayload } from '@/types/cart';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// Add item to cart
export const addToCart = async (payload: AddToCartPayload): Promise<CartItem> => {
  const response = await axiosInstance.post<ApiResponse<CartItem>>('/cart/add', payload);
  if (response.data.code !== 201) {
    throw new Error(response.data.message || 'Failed to add item to cart');
  }
  return response.data.result;
};

// Get user's cart
export const getCartByUserId = async (userId: number): Promise<Cart> => {
  const response = await axiosInstance.get<ApiResponse<Cart>>(`/cart/user/${userId}`);
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to retrieve cart');
  }
  return response.data.result;
};

// Update cart item quantity
export const updateCartItem = async (cartItemId: number, payload: UpdateCartItemPayload): Promise<CartItem> => {
  const response = await axiosInstance.put<ApiResponse<CartItem>>(`/cart/items/${cartItemId}`, payload);
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to update cart item');
  }
  return response.data.result;
};

// Remove item from cart
export const removeCartItem = async (cartItemId: number): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(`/cart/items/${cartItemId}`);
  if (response.data.code !== 200 && response.data.code !== 204) { // Handle 204 No Content as success
    throw new Error(response.data.message || 'Failed to remove cart item');
  }
};

// Clear the entire cart
export const clearCart = async (userId: number): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(`/cart/user/${userId}/clear`);
  if (response.data.code !== 200 && response.data.code !== 204) {
    throw new Error(response.data.message || 'Failed to clear cart');
  }
};

// Get total amount of the cart
export const getCartTotal = async (userId: number): Promise<number> => {
  const response = await axiosInstance.get<ApiResponse<number>>(`/cart/user/${userId}/total`);
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to get cart total');
  }
  return response.data.result;
};

// Get number of items in the cart
export const getCartItemCount = async (userId: number): Promise<number> => {
  const response = await axiosInstance.get<ApiResponse<number>>(`/cart/user/${userId}/count`);
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to get cart item count');
  }
  return response.data.result;
};
