import axiosInstance from "../lib/axios";
import { Color } from '@/types/color';

interface ApiResponse<T> {
    code: number;
    message: string;
    result: T;
}

export interface PaginatedColors {
    content: Color[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export const getColorsPaginated = async (page = 0, size = 10, sortBy = 'id', sortDir = 'ASC'): Promise<PaginatedColors> => {
    try {
        const params = { page, size, sortBy, sortDir };
        const response = await axiosInstance.get<ApiResponse<PaginatedColors>>('/colors', { params });
        if (response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to fetch colors');
    } catch (error: any) {
        console.error('Error fetching paginated colors:', error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const getAllColors = async (): Promise<Color[]> => {
    try {
        const response = await axiosInstance.get<ApiResponse<Color[]>>('/colors/all');
        if (response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to fetch colors');
    } catch (error: any) {
        console.error('Error fetching all colors:', error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const createColor = async (payload: { name: string; description?: string }): Promise<Color> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Color>>('/colors', payload);
        if (response.data.code === 201 || response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to create color');
    } catch (error: any) {
        console.error('Error creating color:', error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const updateColor = async (id: number, payload: { name: string; description?: string }): Promise<Color> => {
    try {
        const response = await axiosInstance.put<ApiResponse<Color>>(`/colors/${id}`, payload);
        if (response.data.code === 200) return response.data.result;
        throw new Error(response.data.message || 'Failed to update color');
    } catch (error: any) {
        console.error(`Error updating color ${id}:`, error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

export const deleteColor = async (id: number): Promise<void> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/colors/${id}`);
        if (response.data.code !== 200) throw new Error(response.data.message || 'Failed to delete color');
    } catch (error: any) {
        console.error(`Error deleting color ${id}:`, error);
        throw new Error(error.response?.data?.message || error.message || 'Network error');
    }
};

