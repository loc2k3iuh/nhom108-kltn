import axiosInstance from '@/lib/axios';
import { APIResponse } from '@/types/responses/apiResponse';

// Voucher interfaces matching backend VoucherResponse.java
export interface VoucherResponse {
    id: number;
    code: string;
    description: string;
    discountType: 'PERCENT' | 'FIXED';
    discountValue: number;
    minimumOrderAmount: number; // minValueOrder từ backend được map sang minimumOrderAmount
    maximumDiscountAmount?: number; // maxDiscountValue từ backend được map sang maximumDiscountAmount
    usageLimit?: number;
    usedCount?: number;
    usageLimitPerUser?: number; // usagePerUser từ backend được map sang usageLimitPerUser
    startDate: string; // Format: "yyyy-MM-dd HH:mm:ss"
    endDate: string; // Format: "yyyy-MM-dd HH:mm:ss"
    isActive: boolean; // active từ backend được map sang isActive
    createdDate: string;
}

export interface VoucherPage {
    content: VoucherResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

/**
 * Get all available vouchers for a user
 * @param userId - User ID
 * @param keyword - Search keyword (optional)
 * @param page - Page number (default: 0)
 * @param size - Page size (default: 10)
 * @param discountType - Filter by discount type: 'PERCENT' | 'FIXED' (optional)
 */
export const getAllVouchersForUser = async (
    userId: number,
    keyword?: string,
    page: number = 0,
    size: number = 10,
    discountType?: 'PERCENT' | 'FIXED'
): Promise<VoucherPage> => {
    try {
        const params: any = {
            page,
            size
        };
        
        if (keyword && keyword.trim()) {
            params.keyword = keyword.trim();
        }

        if (discountType) {
            params.discountType = discountType;
        }

        const response = await axiosInstance.get<APIResponse<VoucherPage>>(
            `/vouchers/user/${userId}`,
            { params }
        );

        return response.data.result;
    } catch (error: any) {
        console.error('Error fetching vouchers for user:', error);
        throw error;
    }
};

/**
 * Validate and calculate discount for a voucher
 * @param userId - User ID
 * @param code - Voucher code
 * @param orderTotal - Order total amount
 */
export const validateVoucher = async (
    userId: number,
    code: string,
    orderTotal: number
): Promise<{ voucher: VoucherResponse; discount: number }> => {
    try {
        const response = await axiosInstance.post<APIResponse<{ voucher: VoucherResponse; discount: number }>>(
            '/vouchers/validate',
            {
                userId,
                code,
                orderTotal
            }
        );

        return response.data.result;
    } catch (error: any) {
        console.error('Error validating voucher:', error);
        throw error;
    }
};

/**
 * Get suitable vouchers for order amount
 * @param userId - User ID
 * @param orderAmount - Order total amount
 * @returns List of suitable vouchers (without pagination)
 */
export const getSuitableVouchersForOrder = async (
    userId: number,
    orderAmount: number
): Promise<VoucherResponse[]> => {
    try {
        const response = await axiosInstance.get<APIResponse<VoucherResponse[]>>(
            `/vouchers/user/${userId}/suitable`,
            {
                params: { orderAmount }
            }
        );

        return response.data.result;
    } catch (error: any) {
        console.error('Error fetching suitable vouchers:', error);
        throw error;
    }
};

/**
 * Get total valid vouchers count for user
 * @param userId - User ID
 * @returns Total number of valid vouchers (active, not expired, still have usage remaining)
 */
export const getTotalValidVouchersCount = async (userId: number): Promise<number> => {
    try {
        const response = await axiosInstance.get<APIResponse<number>>(
            `/vouchers/user/${userId}/count`
        );

        return response.data.result;
    } catch (error: any) {
        console.error('Error fetching total valid vouchers count:', error);
        throw error;
    }
};
