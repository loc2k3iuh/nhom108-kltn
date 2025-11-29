import axiosInstance from "../lib/axios";
import { Size } from '@/types/size';

interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

export interface PaginatedSizes {
    content: Size[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export const getSizesPaginated = async (page = 0, size = 10, sortBy = 'id', sortDir = 'ASC'): Promise<PaginatedSizes> => {
    try {
        const params = { page, size, sortBy, sortDir };
        const response = await axiosInstance.get<ApiResponse<PaginatedSizes>>('/sizes', { params });
        if (response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to fetch sizes');
    } catch (error: any) {
        console.error('Error fetching paginated sizes:', error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const getAllSizes = async (): Promise<Size[]> => {
    try {
        const response = await axiosInstance.get<ApiResponse<Size[]>>('/sizes/all');
        if (response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to fetch sizes');
    } catch (error: any) {
        console.error('Error fetching all sizes:', error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const createSize = async (payload: { name: string; description?: string }): Promise<Size> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Size>>('/sizes', payload);
        if (response.data.code === 201 || response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to create size');
    } catch (error: any) {
        console.error('Error creating size:', error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const updateSize = async (id: number, payload: { name: string; description?: string }): Promise<Size> => {
    try {
        const response = await axiosInstance.put<ApiResponse<Size>>(`/sizes/${id}`, payload);
        if (response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to update size');
    } catch (error: any) {
        console.error(`Error updating size ${id}:`, error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const deleteSize = async (id: number): Promise<void> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/sizes/${id}`);
        if (response.data.code !== 200) throw new Error(response.data.message || 'Failed to delete size');
    } catch (error: any) {
        console.error(`Error deleting size ${id}:`, error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

