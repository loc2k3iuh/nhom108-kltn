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
