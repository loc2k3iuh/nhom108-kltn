import axiosInstance from '@/lib/axios';
import {
  Order,
  OrderPageResponse,
  OrderFilterRequest,
  CreateOrderRequest,
  UpdateOrderRequest,
} from '@/types/order';

const BASE_URL = '/orders';

export const orderService = {
  // Get all orders with pagination
  getAllOrders: async (
    page: number = 0,
    size: number = 10
  ): Promise<OrderPageResponse> => {
    const response = await axiosInstance.get(BASE_URL, {
      params: { page, size },
    });
    return response.data.result;
  },

  // Get order by ID
  getOrderById: async (id: number): Promise<Order> => {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`);
    return response.data.result;
  },

  // Filter orders with pagination
  filterOrders: async (
    filter: OrderFilterRequest,
    page: number = 0,
    size: number = 10
  ): Promise<OrderPageResponse> => {
    const response = await axiosInstance.post(`${BASE_URL}/filter`, filter, {
      params: { page, size },
    });
    return response.data.result;
  },

  // Create new order
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await axiosInstance.post(BASE_URL, data);
    return response.data.result;
  },

  // Update order
  updateOrder: async (id: number, data: UpdateOrderRequest): Promise<Order> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, data);
    return response.data.result;
  },

  // Update orders status (bulk)
  updateOrdersStatus: async (
    orderIds: number[],
    status: string
  ): Promise<Order[]> => {
    const response = await axiosInstance.post(
      `${BASE_URL}/status`,
      orderIds,
      {
        params: { status },
      }
    );
    return response.data.result;
  },

  // Delete orders (bulk)
  deleteOrders: async (orderIds: number[]): Promise<void> => {
    await axiosInstance.delete(BASE_URL, {
      data: orderIds,
    });
  },

  // Generate PDFs for orders
  generateOrderPdfs: async (orderIds: number[]): Promise<Blob[]> => {
    const response = await axiosInstance.post(`${BASE_URL}/pdfs`, orderIds, {
      responseType: 'arraybuffer',
    });
    return [new Blob([response.data], { type: 'application/pdf' })];
  },
};
