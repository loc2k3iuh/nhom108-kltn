
import axiosInstance from "../lib/axios";
import { ProductVariant } from "@/types/product";

interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

export const createProductVariant = async (formData: FormData): Promise<ProductVariant> => {
    try {
        const response = await axiosInstance.post<ApiResponse<ProductVariant>>("/product-variants", formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data.code === 201) {
            return response.data.result;
        } else {
            throw new Error(response.data.message || "Failed to create product variant");
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Network error: Unable to create product variant";
        console.error("Error creating product variant:", error);
        throw new Error(errorMessage);
    }
};

export const getProductVariantsByProductId = async (productId: number): Promise<ProductVariant[]> => {
    try {
        const response = await axiosInstance.get<ApiResponse<ProductVariant[]>>(`/product-variants/product/${productId}`);
        if (response.data.code === 200) {
            return response.data.result;
        } else {
            throw new Error(response.data.message || "Failed to fetch product variants");
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Network error: Unable to fetch product variants";
        console.error(`Error fetching variants for product ${productId}:`, error);
        throw new Error(errorMessage);
    }
};

export const getProductVariantById = async (productVariantId: number): Promise<ProductVariant> => {
    try {
        const response = await axiosInstance.get<ApiResponse<ProductVariant>>(`/product-variants/${productVariantId}`);
        if (response.data.code === 200) {
            console.log(response.data.result); // 👈 console.log phải đặt trước return
            return response.data.result;
        } else {
            throw new Error(response.data.message || "Failed to fetch product variant");
        }
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Network error: Unable to fetch product variant";
        console.error(`Error fetching variant ${productVariantId}:`, error);
        throw new Error(errorMessage);
    }
};


export const updateProductVariant = async (id: number, formData: FormData): Promise<ProductVariant> => {
    try {
        const response = await axiosInstance.put<ApiResponse<ProductVariant>>(`/product-variants/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data.code === 200) {
            return response.data.result;
        } else {
            throw new Error(response.data.message || "Failed to update product variant");
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Network error: Unable to update product variant";
        console.error(`Error updating product variant with id ${id}:`, error);
        throw new Error(errorMessage);
    }
};

export const deleteProductVariant = async (id: number): Promise<void> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/product-variants/${id}`);
        if (response.data.code !== 200) {
            throw new Error(response.data.message || "Failed to delete product variant");
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Network error: Unable to delete product variant";
        console.error(`Error deleting product variant with id ${id}:`, error);
        throw new Error(errorMessage);
    }
};
