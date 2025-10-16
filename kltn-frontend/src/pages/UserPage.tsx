import  { useState, useEffect, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,  
    faBell,
    faClipboardList,
    faTicketAlt,
    faHeart,
    faBook,
    faStar,
    faChevronDown,
    faChevronUp,
    faGifts,
    faMailBulk,
    faEdit,
    faSave,
    faTimes
} from "@fortawesome/free-solid-svg-icons";

import { Link } from 'react-router-dom';
// Service imports removed - using static data
import { toast } from "sonner";
import UserSidebar from "../components/UserSidebar";

interface ValidationErrors {
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
}

const UserPage = () => {
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    // Static user data
    const staticUserData = {
        id: 1,
        username: "user123",
        full_name: "Nguyễn Văn A",
        fullName: "Nguyễn Văn A",
        email: "user@example.com",
        phone_number: "0912345678",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        date_of_birth: "1990-05-15",
        avatar_url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYVcJXjU8HnMTXVmjER0yIET4AwAuHp0LO_YCiQjUsf1228qq0lYbABHFTSasYlk61e6Y-1ygAjWXFLEUTCloPcTvbAwe7nNba7SW9ot9QMce7BYus-H6eDIUvyFXh9UmAmV5eVTMultDo57c048MmDws-a65QYOzoBfUkHLv5OiMhMaUfh2WeP_3ej9du/s1600/istockphoto-1337144146-612x612.jpg",
        roles: [{ name: "USER" }]
    };

    const [userData, setUserData] = useState(staticUserData);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Form state
    const [fullName, setFullName] = useState<string>(staticUserData.fullName);
    const [phoneNumber, setPhoneNumber] = useState<string>(staticUserData.phone_number);
    const [address, setAddress] = useState<string>(staticUserData.address);
    const [dateOfBirth, setDateOfBirth] = useState<string>(staticUserData.date_of_birth);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<ValidationErrors>({});
    
    // Format date from API to HTML input format
    const formatDateForInput = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch {
            return "";
        }
    };
    
    // Format date for display
    const formatDateForDisplay = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
            });
        } catch {
            return "";
        }
    };
    
    // Function to fetch user data (now uses static data)
    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Use static user data
            setUserData(staticUserData);
            
            // Update form fields with static data
            setFullName(staticUserData.full_name || "");
            setPhoneNumber(staticUserData.phone_number || "");
            setAddress(staticUserData.address || "");
            setDateOfBirth(staticUserData.date_of_birth ? formatDateForInput(staticUserData.date_of_birth) : "");
            setAvatarPreview(staticUserData.avatar_url || null);
        } catch (error: any) {
            toast.error("Không thể tải dữ liệu người dùng");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUserData();
    }, []);
    
    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const validateFullName = (name: string): string | undefined => {
      
        if (name.length < 10) {
            return "Họ và tên phải có ít nhất 10 ký tự";
        }
        
        // Kiểm tra tên tiếng Việt hợp lệ
        const vietnameseNameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
        if (!vietnameseNameRegex.test(name)) {
            return "Họ và tên chỉ được chứa ký tự tiếng Việt và không có ký tự đặc biệt";
        }
        return undefined;
    };

    const validatePhoneNumber = (phone: string): string | undefined => {
     
        // Regex kiểm tra định dạng số điện thoại Việt Nam
        // Bắt đầu bằng 09, 03, 02 hoặc 07 và theo sau là 8 số
        const phoneRegex = /^(09|03|02|07)\d{8}$/;
        if (!phoneRegex.test(phone)) {
            return "Số điện thoại không đúng định dạng (phải bắt đầu bằng 09, 03, 02 hoặc 07 và có 10 số)";
        }
        return undefined;
    };

   

    const validateDateOfBirth = (dob: string): string | undefined => {
     
        
        // Kiểm tra tuổi (ít nhất 18 tuổi)
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 18) {
            return "Bạn phải đủ 18 tuổi";
        }
        
        return undefined;
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        
        // Validate each field
        newErrors.fullName = validateFullName(fullName);
        newErrors.phoneNumber = validatePhoneNumber(phoneNumber);
        newErrors.dateOfBirth = validateDateOfBirth(dateOfBirth);
        
        setErrors(newErrors);
        
        // Check if there are any errors
        return !Object.values(newErrors).some(error => error !== undefined);
    };
    
    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin");
            return;
        }
        
        try {
            setIsLoading(true);
            
            if (!userData?.id) {
                toast.error("ID người dùng không hợp lệ");
                return;
            }

            // Simulate update delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const updateData = {
                full_name: fullName,
                phone_number: phoneNumber,
                address: address,
                date_of_birth: dateOfBirth,
                avatar: avatarFile
            };

            console.log("Static user update:", updateData);
            
            // Update local static data
            const updatedUserData = {
                ...staticUserData,
                full_name: fullName,
                fullName: fullName,
                phone_number: phoneNumber,
                address: address,
                date_of_birth: dateOfBirth
            };
            setUserData(updatedUserData);
            
            toast.success("Cập nhật thông tin thành công!");
            
            // Turn off edit mode after successful update
            setIsEditing(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Cập nhật thông tin thất bại");
        } finally {
            setIsLoading(false);
        }
    };
    
    const products = [
        { id: 1, img: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_36366.jpg", name: "Chiến binh cầu vòng", price: "79.000 đ" },
        { id: 2, img: "https://cdn0.fahasa.com/media/catalog/product/n/g/nghigiaulamgiau_110k-01_bia-1.jpg", name: "Nghĩ giàu làm giàu", price: "73.000 đ" },
        { id: 3, img: "https://cdn0.fahasa.com/media/catalog/product/8/9/8935236432832.jpg", name: "Thép Đã Tôi Thế Đấy (Tái Bản 2023)", price: "81.000 đ" },
        { id: 4, img: "https://cdn0.fahasa.com/media/catalog/product/i/m/image_195509_1_19743.jpg", name: "Everything I Know About Love", price: "98.000 đ" }
    ];
    
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row">
                {/* Sidebar */}
                <UserSidebar userData={userData as any} />

                {/* Main Content */}
                <div className="w-full md:w-3/4 space-y-4 ml-0 mt-3 md:mt-0 md:ml-6">
                    <section className="bg-white p-4 rounded shadow-md">
                        <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                            <div className="p-4 border rounded-md bg-white">
                                <p className="text-gray-700">F-Point hiện có</p>
                                <p className="text-red-500 text-xl font-semibold">0</p>
                            </div>
                            <div className="p-4 border rounded-md bg-white">
                                <p className="text-gray-700">Freeship hiện có</p>
                                <p className="text-red-500 text-xl font-semibold">0 lần</p>
                            </div>
                            <div className="p-4 border rounded-md bg-white">
                                <p className="text-gray-700">Số đơn hàng</p>
                                <p className="text-red-500 text-xl font-semibold">0 đơn hàng</p>
                            </div>
                            <div className="p-4 border rounded-md bg-white">
                                <p className="text-gray-700">Đã thanh toán</p>
                                <p className="text-red-500 text-xl font-semibold">0 đ</p>
                            </div>
                        </div>
                        <div className="mt-6 bg-white p-6 rounded-md shadow-md">
                            <h2 className="font-semibold text-lg flex items-center">
                                <FontAwesomeIcon icon={faGifts} className="text-lg mr-2" />
                                Ưu đãi của bạn
                            </h2>
                            <ul className="mt-4 space-y-2 text-gray-700">
                                <li className="p-2 border rounded-md">Giảm 10% cho đơn hàng trên 200K</li>
                                <li className="p-2 border rounded-md">Miễn phí vận chuyển cho đơn từ 500K</li>
                                <li className="p-2 border rounded-md">Tặng quà khi mua sách giáo khoa</li>
                            </ul>
                        </div>
                    </section>
                    
                    {/* User Profile Section */}
                    <article className="bg-white p-4 rounded shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Hồ sơ cá nhân</h2>
                            {!isEditing ? (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-1 px-3 rounded cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faEdit} className="mr-1" />
                                    <span>Chỉnh sửa</span>
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                        <span>Hủy</span>
                                    </button>
                                    <button 
                                        onClick={handleSubmit}
                                        className="flex items-center bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faSave} className="mr-1" />
                                        <span>Lưu</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C92127]"></div>
                            </div>
                        ) : isEditing ? (
                            <div className="mt-4 space-y-4">
                                {/* Edit mode */}
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="User Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faUser} className="text-gray-400 text-4xl" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-sm">
                                        Chọn ảnh đại diện
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.fullName ? 'focus:ring-red-200' : 'focus:ring-[#C92127]'}`}
                                            required
                                        />
                                        {errors.fullName && (
                                            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                                        )}
                                    </div>
                                    
                                    {/* Phone Number */}
                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className={`w-full px-4 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.phoneNumber ? 'focus:ring-red-200' : 'focus:ring-[#C92127]'}`}
                                            required
                                        />
                                        {errors.phoneNumber && (
                                            <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                                        )}
                                    </div>
                                    
                                    {/* Address */}
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                            Địa chỉ <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            rows={3}
                                            className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.address ? 'focus:ring-red-200' : 'focus:ring-[#C92127]'}`}
                                            required
                                        />
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                                        )}
                                    </div>
                                    
                                    {/* Date of Birth */}
                                    <div>
                                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                                            Ngày sinh <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            id="dateOfBirth"
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                            className={`w-full px-4 py-2 border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.dateOfBirth ? 'focus:ring-red-200' : 'focus:ring-[#C92127]'}`}
                                            required
                                        />
                                        {errors.dateOfBirth && (
                                            <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
                                        )}
                                    </div>
                                    
                                    {/* Email - Read Only */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={userData?.email || ""}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                                            disabled
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Email không thể chỉnh sửa</p>
                                    </div>
                                </div>
                                
                                {/* Validation hints */}
                                <div className="mt-4 p-3 bg-blue-50 text-sm text-blue-700 rounded-md">
                                    <h3 className="font-semibold">Lưu ý:</h3>
                                    <ul className="list-disc ml-5 mt-1">
                                        <li>Họ và tên phải có ít nhất 10 ký tự và chỉ chứa ký tự tiếng Việt hợp lệ</li>
                                        <li>Số điện thoại phải bắt đầu bằng 09, 03, 02 hoặc 07 và có 10 số</li>
                                        <li>Bạn phải đủ 18 tuổi để đăng ký</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Display user information in read-only mode */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                    <div className="w-full p-2 border rounded bg-gray-50">{userData?.full_name || "Chưa cập nhật"}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                    <div className="w-full p-2 border rounded bg-gray-50">{userData?.phone_number || "Chưa cập nhật"}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                    <div className="w-full p-2 border rounded bg-gray-50">{userData?.address || "Chưa cập nhật"}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                                    <div className="w-full p-2 border rounded bg-gray-50">
                                        {userData?.date_of_birth ? formatDateForDisplay(userData.date_of_birth) : "Chưa cập nhật"}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="w-full p-2 border rounded bg-gray-50">{userData?.email || "Chưa cập nhật"}</div>
                                </div>
                            </div>
                        )}
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

                <div className="flex justify-center mt-6">
                    <button className="bg-gradient-to-r from-red-700 to-red-400 hover:from-red-500 hover:to-red-800 text-white px-6 py-3 rounded-md font-medium transition-colors duration-500 cursor-pointer">
                        Xem tất cả
                    </button>
                </div>
            </div>

            <div className="bg-gray-600 text-white p-4 flex flex-col md:flex-row justify-center items-center gap-5 md:gap-20 mx-auto mt-2 rounded-lg mt-[50px] container lg:max-w-7xl">
                <div className="flex justify-center items-center gap-3">
                    <FontAwesomeIcon icon={faMailBulk} className="text-lg" />
                    <div className="text-2xl font-bold">ĐĂNG KÝ NHẬN BẢN TIN</div>
                </div>
                <div className="flex items-center bg-white rounded p-1 w-full md:w-1/3">
                    <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    />
                    <button className="bg-orange-500 text-white rounded w-100 h-9 ml-2 flex items-center justify-center cursor-pointer">
                        <p className="text-sm font-bold">Đăng ký</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
