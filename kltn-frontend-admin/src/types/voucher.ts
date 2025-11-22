export interface Voucher {
  id: number;
  code: string;
  description: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number;
  usageLimit: number | null;
  usedCount: number;
  usageLimitPerUser: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdDate: string;
}

export interface CreateVoucherRequest {
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number;
  usageLimit: number | null;
  usageLimitPerUser: number | null;
  startDate: string;
  endDate: string;
  eligibleUserIds: number[] | null;
}

export interface UpdateVoucherRequest {
  code?: string;
  description?: string;
  discountType?: string;
  discountValue?: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  startDate?: string;
  endDate?: string;
  active?: boolean;
  eligibleUserIds?: number[] | null;
}

export interface VoucherPageResponse {
  content: Voucher[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface Customer {
  id: number;
  username?: string;
  email: string;
  full_name: string;  // Backend uses snake_case
  phone_number: string;  // Backend uses snake_case
  address?: string;
}
