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
    faEdit,
    faTrash,
    faPlus,
    faMapMarkerAlt,
    faPhone
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { toast } from "sonner";
import UserSidebar from "../components/UserSidebar";

// Static user and address data
interface AddressResponse {
    id: number;
    phoneNumber: string;
    street: string;
    city: string;
    district: string;
    ward: string;
    detailAddress: string;
    zip?: string;
}

const AddressesPage = () => {
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

    // Static addresses data
    const staticAddresses: AddressResponse[] = [
        {
            id: 1,
            phoneNumber: "0912345678",
            street: "123 Đường Nguyễn Văn Linh",
            city: "Thành phố Hồ Chí Minh",
            district: "Quận 7",
            ward: "Phường Tân Phú",
            detailAddress: "123 Đường Nguyễn Văn Linh, Phường Tân Phú",
            zip: "70000"
        },
        {
            id: 2,
            phoneNumber: "0987654321",
            street: "456 Đường Lê Văn Việt",
            city: "Thành phố Hồ Chí Minh",
            district: "Quận 9",
            ward: "Phường Hiệp Phú",
            detailAddress: "456 Đường Lê Văn Việt, Phường Hiệp Phú",
            zip: "71000"
        }
    ];

    const [isAccountOpen, setIsAccountOpen] = useState(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [userData, setUserData] = useState(staticUserData);
    const [addresses, setAddresses] = useState<AddressResponse[]>(staticAddresses);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

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

    // Function to fetch addresses (now uses static data)
    const fetchAddresses = async () => {
        if (!userData?.id) return;
        
        try {
            setIsLoading(true);
            
            // Simulate loading delay
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Use static addresses data
            setAddresses(staticAddresses);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData?.id) {
            fetchAddresses();
        }
    }, [userData]);

    const handleDeleteAddress = async (addressId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này không?')) {
            try {
                setIsDeleting(addressId);
                
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                console.log("Static delete address:", addressId);
                
                // Remove address from local state
                setAddresses(prev => prev.filter(addr => addr.id !== addressId));
                toast.success("Xóa địa chỉ thành công!");
            } catch (error) {
                console.error('Error deleting address:', error);
                toast.error("Không thể xóa địa chỉ!");
            } finally {
                setIsDeleting(null);
            }
        }
    };    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row">
                {/* Sidebar */}
                <UserSidebar userData={userData as any} />

                {/* Main Content */}
                <div className="w-full md:w-3/4 mt-3 md:mt-0 space-y-4 ml-0 md:ml-6">
                    <article className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 border border-gray-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
                                Địa chỉ của tôi
                            </h2>
                            <Link 
                                to="/user/addresses/new" 
                                className="bg-red-500 text-white py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Thêm địa chỉ mới</span>
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="mt-10 flex justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-red-500 mx-auto"></div>
                                    <p className="mt-4 text-gray-500 font-medium">Đang tải địa chỉ...</p>
                                </div>
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className="mt-10 p-8 border border-gray-100 rounded-lg text-center bg-gray-50">
                                <div className="text-gray-400 text-6xl mb-4">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                </div>
                                <p className="text-gray-600 mb-6 text-lg">Bạn chưa có địa chỉ nào</p>
                                <Link 
                                    to="/user/addresses/new" 
                                    className="mt-4 inline-block bg-red-500 text-white py-2.5 px-6 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    Thêm địa chỉ mới
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-6 grid grid-cols-1 gap-5">
                                {addresses.map((address) => (
                                    <div key={address.id} className="border border-gray-100 rounded-lg p-5 hover:shadow-lg transition-all duration-300 bg-white relative group">
                                        <div className="absolute right-2 top-2 flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Link 
                                                to={`/user/addresses/${address.id}/edit`} 
                                                className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-md transition-colors duration-200"
                                                title="Chỉnh sửa"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteAddress(address.id)}
                                                disabled={isDeleting === address.id}
                                                className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-md transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                                                title="Xóa"
                                            >
                                                <FontAwesomeIcon icon={faTrash} spin={isDeleting === address.id} />
                                            </button>
                                        </div>
                                        
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex items-center text-gray-700">
                                                <div className="bg-red-50 p-2 rounded-full mr-3">
                                                    <FontAwesomeIcon icon={faPhone} className="text-red-500" />
                                                </div>
                                                <span className="font-medium">{address.phoneNumber}</span>
                                            </div>
                                            
                                            <div className="flex items-start text-gray-700 mt-2">
                                                <div className="bg-red-50 p-2 rounded-full mr-3 mt-1">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500" />
                                                </div>
                                                <div className="text-gray-700">
                                                    <p className="leading-relaxed">
                                                        {address.detailAddress},<br/> 
                                                        {address.ward}, {address.district},<br/>
                                                        {address.city}
                                                        {address.zip && `, ${address.zip}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </article>
                </div>
            </div>
        </div>
    );
};

export default AddressesPage;
