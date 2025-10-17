
import { Product, Variant as ProductVariant } from './product';

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
  productVariant: ProductVariant;
  itemTotal: number;
}

export interface User {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    created_date: number;
    updated_date: number;
    roles: {
        name: string;
        description: string;
        permissions: any[];
    }[];
}

export interface Cart {
  id: number;
  createdDate: number[];
  updatedDate: number[];
  user: User;
  cartItems: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface AddToCartPayload {
  userId: number;
  productId: number;
  productVariantId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
