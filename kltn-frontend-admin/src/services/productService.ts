
// src/services/productService.ts

import axiosInstance from "../lib/axios";
import { Product, PaginatedProductResponse, ProductDetailResponse } from "@/types/product"; // Import the new type

interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

interface FilterPayload {
    categoryIds?: number[];
    brandIds?: number[];
    sizeIds?: number[];
    colorIds?: number[];
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    inStock?: boolean;
    hasDiscount?: boolean;
    keyword?: string;
    material?: string;
    isFavorite?: boolean;
    sortBy?: string;
    sortDirection?: string;
    sorts?: { field: string; direction: string }[];
    page?: number;
    size?: number;
    isNew?: boolean;
}

export const createProduct = async (formData: FormData): Promise<Product> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Product>>("/products", formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data.code === 201) {
            return response.data.result;
        } else {
            throw new Error(response.data.message || "Failed to create product");
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Network error: Unable to create product";
        console.error("Error creating product:", error);
        throw new Error(errorMessage);
    }
};

export const filterProducts = async (payload: FilterPayload): Promise<PaginatedProductResponse> => {
    try {
        const response = await axiosInstance.post<ApiResponse<PaginatedProductResponse>>("/products/filter", payload);
        if (response.data.code === 200) {
            return response.data.result;
        } else {
            throw new Error(response.data.message || "Failed to fetch products");
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Network error: Unable to fetch products";
        console.error("Error fetching products:", error);
        throw new Error(errorMessage);
    }
};

export const getAllProductsForSelect = async (): Promise<Product[]> => {
    try {
        const payload: FilterPayload = { page: 0, size: 1000 }; 
        const paginatedResponse = await filterProducts(payload);
        return paginatedResponse.content;
    } catch (error) {
        console.error("Error fetching all products for select:", error);
        throw error;
    }
};

export const getFlashSaleProducts = async (size: number = 10): Promise<Product[]> => {
    const payload: FilterPayload = {
        hasDiscount: true,
        sortBy: "currentDiscountPercent",
        sortDirection: "DESC",
        page: 0,
        size: size,
    };
    const paginatedResponse = await filterProducts(payload);
    return paginatedResponse.content;
};

export const getNewestProducts = async (size: number = 10): Promise<Product[]> => {
    const payload: FilterPayload = {
        isNew: true,
        sortBy: "createdAt",
        sortDirection: "DESC",
        page: 0,
        size: size,
    };
    const paginatedResponse = await filterProducts(payload);
    return paginatedResponse.content;
};

// Updated to use the new response type
export const getProductById = async (id: number): Promise<ProductDetailResponse> => {
    try {
        const response = await axiosInstance.get<ApiResponse<ProductDetailResponse>>(`/products/${id}`);
        if (response.data.code === 200) {
            return response.data.result;
        } else {
            throw new Error(response.data.message || "Failed to fetch product detail");
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Network error: Unable to fetch product detail";
        console.error(`Error fetching product with id ${id}:`, error);
        throw new Error(errorMessage);
    }
};

// The update function might return a different shape, let's assume it returns the detailed view for now
export const updateProduct = async (id: number, formData: FormData): Promise<ProductDetailResponse> => {
    try {
        const response = await axiosInstance.put<ApiResponse<ProductDetailResponse>>(`/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data.code === 200) {
            return response.data.result;
        } else {
            throw new Error(response.data.message || "Failed to update product");
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Network error: Unable to update product";
        console.error(`Error updating product with id ${id}:`, error);
        throw new Error(errorMessage);
    }
};

export const deleteProduct = async (id: number): Promise<void> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/products/${id}`);
        if (response.data.code !== 200) {
            throw new Error(response.data.message || "Failed to delete product");
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Network error: Unable to delete product";
        console.error(`Error deleting product with id ${id}:`, error);
        throw new Error(errorMessage);
    }
};

