import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser, faBell,
    faClipboardList,
    faTicketAlt,
    faHeart,
    faBook,
    faStar,
    faChevronDown,
    faChevronUp,
    faMailBulk,
    faArrowLeft
} from "@fortawesome/free-solid-svg-icons";

// Service imports removed - using static data
import { fetchDistrictsByProvince, fetchWardsByDistrict } from "../services/addressService";

import { Link, useNavigate, useParams } from "react-router-dom";
// Type imports removed - using static data
import { toast } from "sonner";
import UserSidebar from "../components/UserSidebar";

const EditAddress = () => {
    const navigate = useNavigate();
    const { addressId } = useParams<{ addressId: string }>();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // Static user data
    const staticUserData = {
        id: 1,
        username: "user123",
        full_name: "Nguyễn Văn A",
        email: "user@example.com",
        phone_number: "0912345678",
        avatar_url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYVcJXjU8HnMTXVmjER0yIET4AwAuHp0LO_YCiQjUsf1228qq0lYbABHFTSasYlk61e6Y-1ygAjWXFLEUTCloPcTvbAwe7nNba7SW9ot9QMce7BYus-H6eDIUvyFXh9UmAmV5eVTMultDo57c048MmDws-a65QYOzoBfUkHLv5OiMhMaUfh2WeP_3ej9du/s1600/istockphoto-1337144146-612x612.jpg",
        roles: [{ name: "USER" }]
    };

    const [userData, setUserData] = useState(staticUserData);
    
    interface City {
        code: string;
        name: string;
    }

    interface District {
        code: string;
        name: string;
    }

    interface Ward {
        code: string;
        name: string;
    }

    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
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

    // Function to fetch user data (now uses static data)
    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Use static user data
            setUserData(staticUserData);
        } catch (error: any) {
            toast.error("Không thể tải dữ liệu người dùng");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fetch address data (now uses static data)
    const fetchAddressData = async () => {
        if (!addressId) return;
        
        try {
            setIsLoading(true);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Static address data for demo
            const address = {
                id: parseInt(addressId),
                phoneNumber: "0912345678",
                street: "123 Đường ABC",
                city: "Thành phố Hồ Chí Minh",
                district: "Quận 1", 
                ward: "Phường Bến Nghé",
                detailAddress: "123 Đường ABC, Phường Bến Nghé",
                zip: "70000"
            };
            
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
            if (address.city) {
                const cityObj = cities.find(city => city.name === address.city);
                if (cityObj) {
                    setSelectedCity(cityObj);
                    const districtData = await fetchDistrictsByProvince(cityObj.code);
                    setDistricts(districtData);
                    
                    if (address.district) {
                        const districtObj: District | undefined = districtData.find((district: District) => district.name === address.district);
                        if (districtObj) {
                            setSelectedDistrict(districtObj);
                            const wardData = await fetchWardsByDistrict(districtObj.code);
                            setWards(wardData);
                        }
                    }
                }
            }
            
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Không thể tải thông tin địa chỉ");
            navigate('/user/addresses');
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUserData();
        
        const fetchCities = async () => {
            try {
                const response = await fetch('https://provinces.open-api.vn/api/p/');
                const data = await response.json();
                setCities(data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        
        fetchCities();
    }, []);

    useEffect(() => {
        if (cities.length > 0) {
            fetchAddressData();
        }
    }, [cities, addressId]);

    const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        setFormData({ ...formData, [target.name]: target.value });

        if (target.name === 'city') {
            // Khi chọn thành phố, tìm city object tương ứng
            const cityObj = cities.find(city => city.name === target.value);
            setSelectedCity(cityObj || null);
            setSelectedDistrict(null);
            setFormData(prev => ({ ...prev, district: '', ward: '' }));
            
            // Fetch districts của thành phố được chọn
            if (cityObj) {
                fetchDistrictsByProvince(cityObj.code)
                    .then(districtData => {
                        setDistricts(districtData);
                    })
                    .catch(err => console.error('Error fetching districts:', err));
            }
        } else if (target.name === 'district') {
            // Khi chọn quận/huyện, tìm district object tương ứng
            const districtObj = districts.find(district => district.name === target.value);
            setSelectedDistrict(districtObj || null);
            setFormData(prev => ({ ...prev, ward: '' }));
            
            // Fetch wards của quận/huyện được chọn
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
            // Chuẩn bị data để gửi đi
            if (typeof userData?.id !== "number") {
                toast.error("Không tìm thấy thông tin người dùng hợp lệ");
                setIsSubmitting(false);
                return;
            }

            const addressRequest = {
                phoneNumber: formData.phone,
                city: formData.city,
                district: formData.district,
                ward: formData.ward,
                street: formData.street || '',
                detailAddress: formData.address,
                zip: formData.postalCode || '',
                userId: userData.id,
            };

            // Simulate API call to update address
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log("Static address update:", addressRequest);
            toast.success("Cập nhật địa chỉ thành công!");
            
            // Chuyển hướng sau khi cập nhật thành công
            navigate('/user/addresses');
        } catch (error) {
            console.error('Error updating address:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row">
                {/* Sidebar */}
                <UserSidebar userData={userData as any} />

                {/* Main Content */}
                <div className="w-full md:w-3/4 mt-3 md:mt-0 space-y-4 ml-0 md:ml-6">
                    {isLoading ? (
                        <div className="bg-white p-6 rounded shadow-md flex justify-center">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                                <p className="mt-2 text-gray-500">Đang tải thông tin địa chỉ...</p>
                            </div>
                        </div>
                    ) : (
                        <article className="bg-white p-6 rounded shadow-md">
                            <h2 className="text-xl font-bold">Chỉnh sửa địa chỉ</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mt-7 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700">Điện thoại<span className="text-red-500">*</span></label>
                                        <input type="text" name="phone" placeholder="Ex: 0972xxxx" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" required />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700">Tỉnh/Thành phố<span className="text-red-500">*</span></label>
                                        <select name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded" required>
                                            <option value="">Vui lòng chọn</option>
                                            {cities && cities.length > 0 && cities.map((city) => (
                                                <option key={city.code} value={city.name}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700">Quận/Huyện<span className="text-red-500">*</span></label>
                                        <select name="district" value={formData.district} onChange={handleChange} className="w-full p-2 border rounded" required disabled={!selectedCity}>
                                            <option value="">Vui lòng chọn</option>
                                            {districts && districts.length > 0 && districts.map((district) => (
                                                <option key={district.code} value={district.name}>
                                                    {district.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700">Xã/Phường<span className="text-red-500">*</span></label>
                                        <select name="ward" value={formData.ward} onChange={handleChange} className="w-full p-2 border rounded" required disabled={!selectedDistrict}>
                                            <option value="">Vui lòng chọn</option>
                                            {wards && wards.length > 0 && wards.map((ward) => (
                                                <option key={ward.code} value={ward.name}>
                                                    {ward.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700">Đường<span className="text-red-500">*</span></label>
                                        <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full p-2 border rounded" required />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700">Mã bưu điện</label>
                                        <input type="text" name="postalCode" placeholder="Mã bưu điện VN: 700000" value={formData.postalCode} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                    
                                    <div className="w-full col-span-2">
                                        <label className="block text-gray-700">Địa chỉ chi tiết<span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            name="address" 
                                            value={formData.address} 
                                            onChange={handleChange} 
                                            className="w-full p-2 border rounded"
                                            placeholder="Số nhà, tên đường, tòa nhà, địa điểm cụ thể" 
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center mt-6">
                                    <p className="text-blue-500 cursor-pointer">
                                        <Link to="/user/addresses"><FontAwesomeIcon icon={faArrowLeft} className="text-blue-500" /> Quay lại</Link>
                                    </p>
                                    <button 
                                        type="submit" 
                                        className="mt-8 bg-red-500 text-white py-2 px-4 rounded cursor-pointer block"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Đang lưu..." : "Cập nhật địa chỉ"}
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
