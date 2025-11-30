import axiosInstance from '../lib/axios';

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface CreateOrderItem {
  product_variant_id: number;
  quantity: number;
}

export interface CreateOrderRequest {
  user_id: number;
  receiver_name: string;
  receiver_phone: string;
  city: string;
  district: string;
  ward: string;
  address: string;
  shipping_method: string;
  payment_method: string;
  note?: string;
  discount_code?: string;
  items: CreateOrderItem[];
}

export interface OrderResponse {
  id: number;
  userId: number;
  status: string;
  orderDate: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  shippingMethod: string;
  paymentMethod: string;
  orderDetails: Array<{
    productVariantId: number;
    productName: string;
    quantity: number;
    price: number;
    discount: number;
  }>;
}

// Create new order
export const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
  const response = await axiosInstance.post<ApiResponse<OrderResponse>>('/orders', orderData);
  if (response.data.code !== 201 && response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to create order');
  }
  return response.data.result;
};

// Get order by ID
export const getOrderById = async (orderId: number): Promise<OrderResponse> => {
  const response = await axiosInstance.get<ApiResponse<OrderResponse>>(`/orders/${orderId}`);
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to get order');
  }
  return response.data.result;
};

// Get orders by user
export const getOrdersByUser = async (userId: number, page: number = 0, size: number = 10): Promise<any> => {
  const response = await axiosInstance.get<ApiResponse<any>>(`/orders/user/${userId}`, {
    params: { page, size }
  });
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to get user orders');
  }
  return response.data.result;
};

// Filter orders
export const filterOrders = async (filter: any, page: number = 0, size: number = 10, userId?: number): Promise<any> => {
  const params: any = { page, size };
  if (userId) {
    params.userId = userId;
  }
  
  const response = await axiosInstance.post<ApiResponse<any>>('/orders/filter', filter, {
    params
  });
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to filter orders');
  }
  return response.data.result;
};

// Update order status (bulk)
export const updateOrdersStatus = async (orderIds: number[], status: string): Promise<OrderResponse[]> => {
  const response = await axiosInstance.post<ApiResponse<OrderResponse[]>>('/orders/status', orderIds, {
    params: { status }
  });
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to update order status');
  }
  return response.data.result;
};

// Cancel order (single order)
export const cancelOrder = async (orderId: number): Promise<OrderResponse> => {
  const response = await axiosInstance.post<ApiResponse<OrderResponse[]>>(`/orders/status`, [orderId], {
    params: { status: 'CANCELLED' }
  });
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to cancel order');
  }
  return response.data.result[0] as OrderResponse;
};

// Get total amount spent by user for completed orders
export const getTotalSpentByUser = async (userId: number): Promise<number> => {
  const response = await axiosInstance.get<ApiResponse<number>>(`/orders/user/${userId}/total-spent`);
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to get total spent');
  }
  return response.data.result;
};

// Get total number of orders by user (excluding cancelled)
export const getTotalOrdersCountByUser = async (userId: number): Promise<number> => {
  const response = await axiosInstance.get<ApiResponse<number>>(`/orders/user/${userId}/total-orders-count`);
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to get total orders count');
  }
  return response.data.result;
};
