
// src/services/productService.ts

import axiosInstance from "../lib/axios";
import { Product, PaginatedProductResponse, ProductDetail } from "@/types/product";

interface ApiErrorResponse {
    code: number;
    message: string;
    details?: any;
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

/**
 * Fetches products based on a filter payload.
 * @param payload - The filter criteria.
 * @returns Promise<PaginatedProductResponse>
 */
export const filterProducts = async (payload: FilterPayload): Promise<PaginatedProductResponse> => {
    try {
        const response = await axiosInstance.post<{ code: number; message: string; result: PaginatedProductResponse }>("/products/filter", payload);

        if (response.data.code === 200) {
            return response.data.result;
        } else {
            throw new Error(response.data.message || "Failed to fetch products");
        }
    } catch (error: any) {
        console.error("Error fetching products:", error);

        if (error.response?.data) {
            const errorData = error.response.data as ApiErrorResponse;
            throw new Error(errorData.message || "Failed to fetch products");
        }

        throw new Error("Network error: Unable to fetch products");
    }
};

/**
 * Get Flash Sale products, sorted by the highest discount.
 * @param size - Number of products to fetch.
 * @returns Promise<Product[]>
 */
export const getFlashSaleProducts = async (size: number = 10): Promise<Product[]> => {
    const payload: FilterPayload = {
        status:"ACTIVE",
        hasDiscount: true,
        sortBy: "currentDiscountPercent",
        sortDirection: "DESC",
        page: 0,
        size: size,
    };

    const paginatedResponse = await filterProducts(payload);
    return paginatedResponse.content;
};

/**
 * Get Newest products (isNew=true), sorted by createdAt desc.
 * @param size - Number of products to fetch.
 * @returns Promise<Product[]>
 */
export const getNewestProducts = async (size: number = 10): Promise<Product[]> => {
    const payload: FilterPayload = {
        status:"ACTIVE",
        isNew: true,
        sortBy: "createdAt",
        sortDirection: "DESC",
        page: 0,
        size: size,
    };

    const paginatedResponse = await filterProducts(payload);
    return paginatedResponse.content;
};

/**
 * Fetches a single product by its ID.
 * @param id - The ID of the product.
 * @returns Promise<ProductDetail>
 */
// export const getProductById = async (id: number): Promise<ProductDetail> => {
//     try {
//         const response = await axiosInstance.get<{ code: number; message: string; result: ProductDetail }>(`/products/${id}`);
//
//         if (response.data.code === 200) {
//             return response.data.result;
//         } else {
//             throw new Error(response.data.message || "Failed to fetch product detail");
//         }
//     } catch (error: any) {
//         console.error(`Error fetching product with id ${id}:`, error);
//
//         if (error.response?.data) {
//             const errorData = error.response.data as ApiErrorResponse;
//             throw new Error(errorData.message || "Failed to fetch product detail");
//         }
//
//         throw new Error("Network error: Unable to fetch product detail");
//     }
// };

export const getProductById = async (id: number): Promise<ProductDetail> => {
    try {
        const response = await axiosInstance.get<{ code: number; message: string; result: ProductDetail }>(`/products/filter/${id}`);

        if (response.data.code === 200) {
            return response.data.result;
        } else {
            throw new Error(response.data.message || "Failed to fetch product detail");
        }
    } catch (error: any) {
        console.error(`Error fetching product with id ${id}:`, error);

        if (error.response?.data) {
            const errorData = error.response.data as ApiErrorResponse;
            throw new Error(errorData.message || "Failed to fetch product detail");
        }

        throw new Error("Network error: Unable to fetch product detail");
    }
};
