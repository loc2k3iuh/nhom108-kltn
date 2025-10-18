
import axiosInstance from "../lib/axios";

interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

export interface ApplyDiscountRequest {
    discountId: number;
    productIds: number[];
}

export interface DiscountInfo {
    id: number;
    name: string;
    discountType: string;
    value: number;
    startDate: number[];
    endDate: number[];
    isActive: boolean;
    formattedValue: string;
}

export interface ProductDiscountResponse {
    productId: number;
    productName: string;
    discount: DiscountInfo;
    originalPrice: number;
    discountedPrice: number;
    savedAmount: number;
}

export const applyDiscountToProducts = async (request: ApplyDiscountRequest): Promise<void> => {
    try {
        const response = await axiosInstance.post<ApiResponse<void>>("/discounts/apply-to-products", request);
        if (response.data.code !== 200) {
            throw new Error(response.data.message || "Failed to apply discount to products");
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Network error: Unable to apply discount";
        console.error("Error applying discount to products:", error);
        throw new Error(errorMessage);
    }
};

export const removeDiscountFromProducts = async (discountId: number, productIds: number[]): Promise<void> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<void>>(`/discounts/${discountId}/products`, {
            data: productIds
        });
        if (response.data.code !== 200) {
            throw new Error(response.data.message || "Failed to remove discount from products");
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Network error: Unable to remove discount";
        console.error("Error removing discount from products:", error);
        throw new Error(errorMessage);
    }
};

export const getProductDiscounts = async (productId: number): Promise<ProductDiscountResponse[]> => {
    try {
        const response = await axiosInstance.get<ApiResponse<ProductDiscountResponse[]>>(`/discounts/products/${productId}`);
        if (response.data.code === 200) {
            return response.data.result;
        } else {
            throw new Error(response.data.message || "Failed to fetch product discounts");
        }
    } catch (error: any) {
        // It's okay if a product has no discounts, so we can return an empty array for 404s or other errors.
        console.log(`No discounts found for product ${productId}, or an error occurred.`);
        return [];
    }
};
