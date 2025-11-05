import axiosInstance from '@/lib/axios';
import { APIResponse } from '@/types/api';

import { Voucher, VoucherPageResponse, CreateVoucherRequest, UpdateVoucherRequest, Customer } from '@/types/voucher';

export const getAllVouchers = async (
  keyword?: string,
  discountType?: string,
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdDate',
  sortDir: string = 'desc'
): Promise<VoucherPageResponse> => {
  const params: Record<string, any> = {
    page,
    size,
    sortBy,
    sortDir
  };
  
  if (keyword) params.keyword = keyword;
  if (discountType) params.discountType = discountType;
  
  const response = await axiosInstance.get<APIResponse<VoucherPageResponse>>('/vouchers', { params });
  return response.data.result;
};

export const getVoucherById = async (id: number): Promise<Voucher> => {
  const response = await axiosInstance.get<APIResponse<Voucher>>(`/vouchers/${id}`);
  return response.data.result;
};

export const createVoucher = async (data: CreateVoucherRequest): Promise<Voucher> => {
  const response = await axiosInstance.post<APIResponse<Voucher>>('/vouchers', data);
  return response.data.result;
};

export const updateVoucher = async (id: number, data: UpdateVoucherRequest): Promise<Voucher> => {
  const response = await axiosInstance.put<APIResponse<Voucher>>(`/vouchers/${id}`, data);
  return response.data.result;
};

export const deleteVoucher = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/vouchers/${id}`);
};

// Get all customers for voucher assignment
export const getAllCustomers = async (): Promise<Customer[]> => {
  const response = await axiosInstance.get<APIResponse<{ users: Customer[], totalPage: number }>>('/users', {
    params: {
      page: 0,
      limit: 1000  // Get a large number to get all customers
    }
  });
  return response.data.result.users;
};
