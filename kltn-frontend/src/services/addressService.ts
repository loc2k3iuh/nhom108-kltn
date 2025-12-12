// Định nghĩa kiểu dữ liệu
export interface Province {
    code: string;
    name: string;
    division_type: string;
    codename: string;
    phone_code: number;
    districts: District[];
}

export interface District {
    code: string;
    name: string;
    division_type: string;
    codename: string;
    province_code: string;
    wards: Ward[];
}

export interface Ward {
    code: string;
    name: string;
    division_type: string;
    codename: string;
    district_code: string;
}

// Add these functions to get location names
export const getLocationNames = async (cityCode: string, districtCode: string, wardCode: string): Promise<{
    cityName: string;
    districtName: string;
    wardName: string;
}> => {
    try {
        // Fetch all in parallel for better performance
        const [cityResponse, districtResponse, wardResponse] = await Promise.all([
            fetch(`https://provinces.open-api.vn/api/p/${cityCode}`),
            fetch(`https://provinces.open-api.vn/api/d/${districtCode}`),
            fetch(`https://provinces.open-api.vn/api/w/${wardCode}`)
        ]);

        const [cityData, districtData, wardData] = await Promise.all([
            cityResponse.json(),
            districtResponse.json(),
            wardResponse.json()
        ]);

        return {
            cityName: cityData.name || '',
            districtName: districtData.name || '',
            wardName: wardData.name || ''
        };
    } catch (error) {
        console.error('Error fetching location names:', error);
        return {
            cityName: '',
            districtName: '',
            wardName: ''
        };
    }
};

export const fetchProvinces = async (): Promise<Province[]> => {
    try {
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error fetching provinces:', error);
        return [];
    }
};

export const fetchDistrictsByProvince = async (provinceCode: string) => {
    try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        const data = await response.json();
        return data.districts || [];
    } catch (error) {
        console.error('Error fetching districts:', error);
        return [];
    }
};

export const fetchWardsByDistrict = async (districtCode: string) => {
    try {
        const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        const data = await response.json();
        return data.wards || [];
    } catch (error) {
        console.error('Error fetching wards:', error);
        return [];
    }
};

// Address API interfaces
import axiosInstance from '../lib/axios';

export interface AddressRequest {
    phoneNumber: string;
    street?: string;
    city: string;
    district: string;
    ward: string;
    detailAddress: string;
    zip?: string;
}

export interface AddressResponse {
    id: number;
    phoneNumber: string;
    street?: string;
    city: string;
    district: string;
    ward: string;
    detailAddress: string;
    zip?: string;
    userId: number;
    username?: string;
}

export interface PaginatedAddressResponse {
    content: AddressResponse[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

// Get all addresses for current user with pagination
export const getMyAddresses = async (page: number = 0, size: number = 10, city?: string): Promise<PaginatedAddressResponse> => {
    const params: any = { page, size, sortBy: 'id', sortDir: 'desc' };
    if (city) {
        params.city = city;
    }
    const response = await axiosInstance.get('/addresses/my-addresses', { params });
    return response.data.result;
};

// Get address by ID
export const getAddressById = async (id: number): Promise<AddressResponse> => {
    const response = await axiosInstance.get(`/addresses/${id}`);
    return response.data.result;
};

// Create new address
export const createAddress = async (data: AddressRequest): Promise<AddressResponse> => {
    const response = await axiosInstance.post('/addresses', data);
    return response.data.result;
};

// Update address
export const updateAddress = async (id: number, data: AddressRequest): Promise<AddressResponse> => {
    const response = await axiosInstance.put(`/addresses/${id}`, data);
    return response.data.result;
};

// Delete address
export const deleteAddress = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/addresses/${id}`);
};
