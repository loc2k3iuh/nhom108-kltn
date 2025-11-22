import axiosInstance from '@/lib/axios';

interface APIResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface DashboardStatsResponse {
  totalRevenue: number;
  totalProfit: number;
  totalDiscount: number;
  totalShippingCost: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  newCustomers: number;
  newCustomerRate: number;
  period: string;
  startDate: string;
  endDate: string;
}

export interface RevenueStatsResponse {
  date: string;
  revenue: number;
  profit: number;
  orderCount: number;
  period: string;
}

export interface StatsPeriodRequest {
  period?: 'DAY' | 'MONTH' | 'YEAR';
  startDate?: string;
  endDate?: string;
  year?: number;
  month?: number;
  day?: number;
}

// Get dashboard statistics with custom period
export const getDashboardStats = async (params?: StatsPeriodRequest): Promise<DashboardStatsResponse> => {
  const response = await axiosInstance.get<APIResponse<DashboardStatsResponse>>('/statistics/dashboard', {
    params
  });
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to get dashboard stats');
  }
  return response.data.result;
};

// Get revenue statistics
export const getRevenueStats = async (params?: StatsPeriodRequest): Promise<RevenueStatsResponse[]> => {
  const response = await axiosInstance.get<APIResponse<RevenueStatsResponse[]>>('/statistics/revenue', {
    params
  });
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to get revenue stats');
  }
  return response.data.result;
};

// Get today's statistics
export const getTodayStats = async (): Promise<DashboardStatsResponse> => {
  const response = await axiosInstance.get<APIResponse<DashboardStatsResponse>>('/statistics/today');
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to get today stats');
  }
  return response.data.result;
};

// Get this month's statistics
export const getThisMonthStats = async (): Promise<DashboardStatsResponse> => {
  const response = await axiosInstance.get<APIResponse<DashboardStatsResponse>>('/statistics/this-month');
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to get this month stats');
  }
  return response.data.result;
};

// Get this year's statistics
export const getThisYearStats = async (): Promise<DashboardStatsResponse> => {
  const response = await axiosInstance.get<APIResponse<DashboardStatsResponse>>('/statistics/this-year');
  if (response.data.code !== 200) {
    throw new Error(response.data.message || 'Failed to get this year stats');
  }
  return response.data.result;
};
