import axiosInstance from "../lib/axios";
import { Brand } from '@/types/brand';

interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

export interface PaginatedBrands {
    content: Brand[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export const getBrandsPaginated = async (page = 0, size = 10, sortBy = 'id', sortDir = 'ASC'): Promise<PaginatedBrands> => {
    try {
        const params = { page, size, sortBy, sortDir };
        const response = await axiosInstance.get<ApiResponse<PaginatedBrands>>('/brands', { params });
        if (response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to fetch brands');
    } catch (error: any) {
        console.error('Error fetching paginated brands:', error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const getAllBrands = async (): Promise<Brand[]> => {
    try {
        const response = await axiosInstance.get<ApiResponse<Brand[]>>('/brands/all');
        if (response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to fetch brands');
    } catch (error: any) {
        console.error('Error fetching all brands:', error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const getBrandById = async (id: number): Promise<Brand> => {
    try {
        const response = await axiosInstance.get<ApiResponse<Brand>>(`/brands/${id}`);
        if (response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to fetch brand');
    } catch (error: any) {
        console.error(`Error fetching brand ${id}:`, error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const createBrand = async (form: FormData): Promise<Brand> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Brand>>('/brands', form, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (response.data.code === 201 || response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to create brand');
    } catch (error: any) {
        console.error('Error creating brand:', error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const updateBrand = async (id: number, form: FormData): Promise<Brand> => {
    try {
        const response = await axiosInstance.put<ApiResponse<Brand>>(`/brands/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to update brand');
    } catch (error: any) {
        console.error(`Error updating brand ${id}:`, error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const deleteBrand = async (id: number): Promise<void> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/brands/${id}`);
        if (response.data.code !== 200) throw new Error(response.data.message || 'Failed to delete brand');
    } catch (error: any) {
        console.error(`Error deleting brand ${id}:`, error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

