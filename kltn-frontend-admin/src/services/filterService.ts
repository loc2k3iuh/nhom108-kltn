import axiosInstance from "../lib/axios";
import { Brand } from '@/types/brand';
import { Color } from '@/types/color';
import { Size } from '@/types/size';

// We assume the API supports a 'size' parameter to control the number of items returned.
// We'll request a large number to get all items for the filters.
const ALL_ITEMS_PAGE_SIZE = 100;

export const getBrands = async (): Promise<Brand[]> => {
    const response = await axiosInstance.get('/brands', { params: { size: ALL_ITEMS_PAGE_SIZE, sort: 'name,ASC' } });
    return response.data.result.content;
};

export const getColors = async (): Promise<Color[]> => {
    const response = await axiosInstance.get('/colors', { params: { size: ALL_ITEMS_PAGE_SIZE, sort: 'name,ASC' } });
    return response.data.result.content;
};

export const getSizes = async (): Promise<Size[]> => {
    const response = await axiosInstance.get('/sizes', { params: { size: ALL_ITEMS_PAGE_SIZE, sort: 'name,ASC' } });
    return response.data.result.content;
};
