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

import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserSidebar from "../components/UserSidebar";

// Dữ liệu người dùng tĩnh
const staticUserData = {
    id: 1,
    username: "user123",
    full_name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone_number: "0987654321",
    address: "123 Đường ABC",
    city: "TP Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    avatar_url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYVcJXjU8HnMTXVmjER0yIET4AwAuHp0LO_YCiQjUsf1228qq0lYbABHFTSasYlk61e6Y-1ygAjWXFLEUTCloPcTvbAwe7nNba7SW9ot9QMce7BYus-H6eDIUvyFXh9UmAmV5eVTMultDo57c048MmDws-a65QYOzoBfUkHLv5OiMhMaUfh2WeP_3ej9du/s1600/istockphoto-1337144146-612x612.jpg",
    roles: [{ name: "USER" }]
};

// Mock functions để thay thế service calls
const fetchDistrictsByProvince = async (provinceCode: string) => {
    // Mô phỏng độ trễ API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (provinceCode === '79') { // TP Hồ Chí Minh
        return [
            { code: '760', name: 'Quận 1' },
            { code: '769', name: 'Quận 2' },
            { code: '770', name: 'Quận 3' },
            { code: '773', name: 'Quận 4' },
            { code: '774', name: 'Quận 5' },
            { code: '775', name: 'Quận 6' },
            { code: '778', name: 'Quận 7' },
        ];
    } else if (provinceCode === '01') { // Hà Nội
        return [
            { code: '001', name: 'Quận Hoàn Kiếm' },
            { code: '002', name: 'Quận Ba Đình' },
            { code: '003', name: 'Quận Đống Đa' },
            { code: '004', name: 'Quận Hai Bà Trưng' },
        ];
    }
    return [
        { code: '001', name: 'Quận A' },
        { code: '002', name: 'Quận B' },
    ];
};

const fetchWardsByDistrict = async (districtCode: string) => {
    // Mô phỏng độ trễ API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (districtCode === '760') { // Quận 1
        return [
            { code: '26734', name: 'Phường Bến Nghé' },
            { code: '26737', name: 'Phường Bến Thành' },
            { code: '26740', name: 'Phường Cô Giang' },
            { code: '26743', name: 'Phường Cầu Kho' },
            { code: '26746', name: 'Phường Cầu Ông Lãnh' },
        ];
    } else if (districtCode === '769') { // Quận 2
        return [
            { code: '26800', name: 'Phường Thảo Điền' },
            { code: '26803', name: 'Phường An Phú' },
            { code: '26806', name: 'Phường Bình An' },
        ];
    }
    return [
        { code: '001', name: 'Phường X' },
        { code: '002', name: 'Phường Y' },
    ];
};

// Interface cho UserResponse
interface UserResponse {
    id: number;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    avatar_url: string;
    roles: Array<{ name: string }>;
}

const NewAddress = () => {
    const navigate = useNavigate();
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<UserResponse | null>(null);

    // Mock functions để thay thế useUserService và useAddressService
    const getUserResponseFromLocalStorage = () => {
        try {
            const userData = localStorage.getItem('vuvisa_user_data');
            if (userData) {
                return JSON.parse(userData);
            }
            return staticUserData;
        } catch (error) {
            console.error('Error getting user data:', error);
            return staticUserData;
        }
    };

    const getUserDetail = async () => {
        // Mô phỏng API call
        await new Promise(resolve => setTimeout(resolve, 500));
        return staticUserData;
    };

    const addAddress = async (userId: number, addressData: any) => {
        // Mô phỏng API call để thêm địa chỉ
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Adding address for user:', userId, addressData);
        toast.success("Thêm địa chỉ thành công!");
        
        // Mô phỏng thành công
        return { success: true, id: Math.floor(Math.random() * 1000) + 1 };
    };
    
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

    const products = [
        { id: 1, img: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36366.jpg", name: "Chiến binh cầu vòng", price: "79.000 đ" },
        { id: 2, img: "https://cdn0.fahasa.com/media/catalog/product/n/g/nghigiaulamgiau_110k-01_bia-1.jpg", name: "Nghĩ giàu làm giàu", price: "73.000 đ" },
        { id: 3, img: "https://cdn0.fahasa.com/media/catalog/product/8/9/8935236432832.jpg", name: "Thép Đã Tôi Thế Đấy (Tái Bản 2023)", price: "81.000 đ" },
        { id: 4, img: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_19743.jpg", name: "Everything I Know About Love", price: "98.000 đ" },
        { id: 5, img: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_180812.jpg", name: "Sự Im Lặng Của Bầy Cừu (Tái Bản 2019)", price: "126.900 đ" },
        { id: 6, img: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_49918.jpg", name: "D. Trump - Nghệ Thuật Đàm Phán (Tái Bản 2020)", price: "135.200 đ" },
        { id: 7, img: "https://cdn0.fahasa.com/media/catalog/product/8/9/8935309503834.jpg", name: "Nuance - 50 Sắc Thái Của Từ", price: "20.250 đ" },
        { id: 8, img: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_244718_1_5088.jpg", name: "Nhật Ký Trong Tù (Tái Bản)", price: "68.000 đ" },
        { id: 9, img: "https://cdn0.fahasa.com/media/catalog/product/8/9/8935235232884.jpg", name: "How The Brain Works - Hiểu Hết Về Bộ Não", price: "79.000 đ" },
        { id: 10, img: "https://cdn0.fahasa.com/media/catalog/product/8/9/8936066697088.jpg", name: "Lý Thuyết Trò Chơi", price: "73.000 đ" },
        { id: 11, img: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_220964.jpg", name: "Khi Hơi Thở Hóa Thinh Không (Tái Bản 2020)", price: "81.000 đ" },
        { id: 12, img: "https://cdn0.fahasa.com/media/catalog/product/u/n/untitled-2_44.jpg", name: "Làm Bạn Với Bầu Trời - Tặng Kèm Khung Hình Xinh Xắn", price: "98.000 đ" },
        { id: 13, img: "https://cdn0.fahasa.com/media/catalog/product/b/i/bia-20-tuoi-nhung-nam-thang-quyet-dinh-cuoc-doi-26-4-2023-01.jpg", name: "Tuổi 20 - Những Năm Tháng Quyết Định Cuộc Đời Bạn", price: "126.900 đ" },
        { id: 14, img: "https://cdn0.fahasa.com/media/catalog/product/9/7/9780399590528.jpg", name: "Educated: A Memoir (New York Times Bestseller)", price: "135.200 đ" },
        { id: 15, img: "https://cdn0.fahasa.com/media/catalog/product/8/9/8935086855539.jpg", name: "Sức Mạnh Của Ngôn Từ", price: "20.250 đ" },
        { id: 16, img: "https://cdn0.fahasa.com/media/catalog/product/9/7/9781108919302.jpg", name: "Prepare A2 Level 3 Workbook With Audio Download", price: "68.000 đ" }
    ];

    // Function to fetch user data
    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            
            // Get user data from local storage first
            const user = getUserResponseFromLocalStorage();
            setUserData(user);
            
            // Mô phỏng độ trễ để lấy dữ liệu mới nhất
            try {
                const userDetails = await getUserDetail();
                setUserData(userDetails);
            } catch (error: any) {
                console.error('Error fetching user details:', error);
                // Vẫn sử dụng dữ liệu tĩnh nếu có lỗi
            }
        } catch (error: any) {
            console.error('Error in fetchUserData:', error);
            // Fallback to static data
            setUserData(staticUserData);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
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

    const [formData, setFormData] = useState({
        phone: '',
        street: '',
        city: '',
        district: '',
        ward: '',
        address: '',
        postalCode: ''
    });

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

        if (!userData?.id) {
            toast.error("Không tìm thấy thông tin người dùng");
            return;
        }

        setIsSubmitting(true);

        try {
            // Chuẩn bị data để gửi đi
            const addressRequest = {
                phoneNumber: formData.phone,
                city: formData.city,
                district: formData.district,
                ward: formData.ward,
                street: formData.street || '',
                detailAddress: formData.address,
                zip: formData.postalCode || ''
            };

            // Gọi mock function để thêm địa chỉ
            await addAddress(userData.id, addressRequest);
            
            // Chuyển hướng sau khi thêm thành công
            navigate('/user/addresses');
        } catch (error) {
            console.error('Error adding address:', error);
            toast.error("Có lỗi xảy ra khi thêm địa chỉ");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row">
                {/* Sidebar */}
                <UserSidebar userData={userData} />

                {/* Main Content */}
                <div className="w-full md:w-3/4 mt-3 md:mt-0 space-y-4 ml-0 md:ml-6">
                    <article className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-xl font-bold">Thêm địa chỉ mới</h2>
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
                                    {isSubmitting ? "Đang lưu..." : "Lưu địa chỉ"}
                                </button>
                            </div>
                        </form>
                    </article>
                </div>
            </div>

            {/* Product Suggestions */}
            <div className="max-w-6xl mx-auto p-6 rounded-lg shadow-lg mt-6 
                        bg-gradient-to-b from-green-200 to-green-50">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Gợi ý cho bạn</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="p-4 rounded-lg shadow-md flex flex-col min-h-[350px] transition-transform transform hover:scale-105 hover:shadow-xl 
                                   bg-white"
                        >
                            <img
                                src={product.img}
                                alt={product.name}
                                className="w-full h-60 object-cover rounded-md mb-3"
                            />
                            <h3 className="font-semibold text-lg text-gray-900 mb-1 flex-1">{product.name}</h3>
                            <p className="text-red-600 font-bold text-lg mb-3">{product.price}</p>
                            <button className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-md font-medium mt-auto transition-all duration-300 cursor-pointer">
                                Mua ngay
                            </button>
                        </div>
                    ))}
                </div>

                {/* Nút "Xem tất cả" được căn giữa */}
                <div className="flex justify-center mt-6">
                    <button className="bg-gradient-to-r from-red-700 to-red-400 hover:from-red-500 hover:to-red-800 text-white px-6 py-3 rounded-md font-medium transition-colors duration-500 cursor-pointer">
                        Xem tất cả
                    </button>
                </div>
            </div>


            <div className="bg-gray-600 text-white p-4 flex flex-col md:flex-row justify-center items-center gap-5 md:gap-20 mx-auto mt-2 rounded-lg mt-[50px] container lg:max-w-7xl">
                <div className=" flex justify-center items-center gap-3">
                    <FontAwesomeIcon icon={faMailBulk} className="text-lg" />
                    <div className="text-2xl font-bold">ĐĂNG KÝ NHẬN BẢN TIN </div>
                </div>
                <div className="flex items-center bg-white rounded p-1 w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className="w-300 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    />
                    <button className="bg-orange-500 text-white rounded w-100 h-9 ml-2 flex  items-center justify-center cursor-pointer">
                        <p className="text-white-500 text-sm  font-bol">Đăng ký</p>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default NewAddress;