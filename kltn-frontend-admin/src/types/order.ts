export interface OrderDetail {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  order_date: string;
  full_name: string;
  phone_number: string;
  email?: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  shipping_method: string;
  shipping_cost: number;
  payment_method: string;
  discount_code?: string;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  note?: string;
  invoice_url: string;
  order_details: OrderDetail[];
}

export interface OrderPageResponse {
  content: Order[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface OrderFilterRequest {
  id?: number;
  status?: string[];
  fullName?: string;
  phoneNumber?: string;
  shippingMethod?: string[];
  shippedDate?: string;
  deliveredDate?: string;
  productName?: string;
}

export interface CreateOrderItemRequest {
  product_variant_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  user_id: number;
  items: CreateOrderItemRequest[];
  receiver_name: string;
  receiver_phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  shipping_method: string;
  shipping_cost: number;
  payment_method: string;
  discount_code?: string;
  note?: string;
}

export interface UpdateOrderStatusRequest {
  orderIds: number[];
  status: string;
}

export interface UpdateOrderRequest {
  order_status?: string;
  receiver_name?: string;
  receiver_phone?: string;
  city?: string;
  district?: string;
  ward?: string;
  address?: string;
  shipping_method?: string;
  shipping_status?: string;
  shipping_cost?: number;
  tracking_code?: string;
  payment_method?: string;
  transaction_id?: string;
  note?: string;
}
