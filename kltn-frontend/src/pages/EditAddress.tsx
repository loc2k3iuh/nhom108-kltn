import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import UserSidebar from "../components/UserSidebar";
import {
    fetchProvinces,
    fetchDistrictsByProvince,
    fetchWardsByDistrict,
    getAddressById,
    updateAddress,
    Province,
    District,
    Ward
} from "../services/addressService";

const EditAddress = () => {
    const navigate = useNavigate();
    const { addressId } = useParams<{ addressId: string }>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const [cities, setCities] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedCity, setSelectedCity] = useState<Province | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        phone: '',
        street: '',
        city: '',
        district: '',
        ward: '',
        address: '',
        postalCode: ''
    });

    // Fetch address data
    const fetchAddressData = async () => {
        if (!addressId) return;
        
        try {
            setIsLoading(true);
            const address = await getAddressById(parseInt(addressId));
            
            setFormData({
                phone: address.phoneNumber || '',
                street: address.street || '',
                city: address.city || '',
                district: address.district || '',
                ward: address.ward || '',
                address: address.detailAddress || '',
                postalCode: address.zip || ''
            });

            // Load districts and wards based on selected city/district
            if (address.city && cities.length > 0) {
                const cityObj = cities.find(city => city.name === address.city);
                if (cityObj) {
                    setSelectedCity(cityObj);
                    const districtData = await fetchDistrictsByProvince(cityObj.code);
                    setDistricts(districtData);
                    
                    if (address.district) {
                        const districtObj = districtData.find((d: District) => d.name === address.district);
                        if (districtObj) {
                            setSelectedDistrict(districtObj);
                            const wardData = await fetchWardsByDistrict(districtObj.code);
                            setWards(wardData);
                        }
                    }
                }
            }
            
        } catch (error: any) {
            console.error('Error fetching address:', error);
            toast.error(error?.response?.data?.message || "Không thể tải thông tin địa chỉ");
            navigate('/user/addresses');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        const loadCities = async () => {
            try {
                const data = await fetchProvinces();
                setCities(data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        
        loadCities();
    }, []);

    useEffect(() => {
        if (cities.length > 0 && addressId) {
            fetchAddressData();
        }
    }, [addressId]); // Only depend on addressId, not cities

    const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        setFormData({ ...formData, [target.name]: target.value });

        if (target.name === 'city') {
            const cityObj = cities.find(city => city.name === target.value);
            setSelectedCity(cityObj || null);
            setSelectedDistrict(null);
            setFormData(prev => ({ ...prev, district: '', ward: '' }));
            
            if (cityObj) {
                fetchDistrictsByProvince(cityObj.code)
                    .then(districtData => {
                        setDistricts(districtData);
                    })
                    .catch(err => console.error('Error fetching districts:', err));
            }
        } else if (target.name === 'district') {
            const districtObj = districts.find(district => district.name === target.value);
            setSelectedDistrict(districtObj || null);
            setFormData(prev => ({ ...prev, ward: '' }));
            
            if (districtObj) {
                fetchWardsByDistrict(districtObj.code)
                    .then(wardData => {
                        setWards(wardData);
                    })
                    .catch(err => console.error('Error fetching wards:', err));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!addressId) {
            toast.error("Không tìm thấy ID địa chỉ");
            return;
        }
        
        // Validate form
        if (!formData.phone || !formData.city || !formData.district || !formData.ward || !formData.address) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        // Format Vietnamese phone number
        const phoneRegex = /^(0|\+84)\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Số điện thoại không hợp lệ");
            return;
        }

        setIsSubmitting(true);

        try {
            const addressRequest = {
                phoneNumber: formData.phone,
                city: formData.city,
                district: formData.district,
                ward: formData.ward,
                street: formData.street || '',
                detailAddress: formData.address,
                zip: formData.postalCode || '',
            };

            await updateAddress(parseInt(addressId), addressRequest);
            toast.success("Cập nhật địa chỉ thành công!");
            navigate('/user/addresses');
        } catch (error: any) {
            console.error('Error updating address:', error);
            toast.error(error?.response?.data?.message || "Không thể cập nhật địa chỉ");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row">
                {/* Sidebar */}
                <UserSidebar />

                {/* Main Content */}
                <div className="w-full md:w-3/4 mt-3 md:mt-0 space-y-4 ml-0 md:ml-6">
                    {isLoading ? (
                        <div className="mt-10 flex justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-red-500 mx-auto"></div>
                                <p className="mt-4 text-gray-500 font-medium">Đang tải dữ liệu...</p>
                            </div>
                        </div>
                    ) : (
                        <article className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-6">
                                <Link to="/user/addresses" className="mr-4 text-gray-600 hover:text-gray-800">
                                    <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
                                </Link>
                                <h2 className="text-2xl font-bold text-gray-800">Chỉnh Sửa Địa Chỉ</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Số điện thoại *</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="Nhập số điện thoại"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Tỉnh/Thành phố *</label>
                                        <select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        >
                                            <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                            {cities.map(city => (
                                                <option key={city.code} value={city.name}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Quận/Huyện *</label>
                                        <select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                            disabled={!selectedCity}
                                        >
                                            <option value="">-- Chọn Quận/Huyện --</option>
                                            {districts.map(district => (
                                                <option key={district.code} value={district.name}>{district.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Phường/Xã *</label>
                                        <select
                                            name="ward"
                                            value={formData.ward}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                            disabled={!selectedDistrict}
                                        >
                                            <option value="">-- Chọn Phường/Xã --</option>
                                            {wards.map(ward => (
                                                <option key={ward.code} value={ward.name}>{ward.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 font-medium mb-2">Đường *</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="Nhập tên đường"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 font-medium mb-2">Địa chỉ chi tiết *</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="Nhập địa chỉ chi tiết (Số nhà, tên đường...)"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Mã bưu điện</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="Nhập mã bưu điện (nếu có)"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/user/addresses')}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật địa chỉ'}
                                    </button>
                                </div>
                            </form>
                        </article>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditAddress;
