import React, { useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
// Type imports removed - using any for flexibility

interface UserSidebarProps {
    userData: any;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ userData }) => {
    const [isAccountOpen, setIsAccountOpen] = useState(true);
    const location = useLocation();
    const currentPath = location.pathname;

    // Helper function to check if a path is active
    const isActive = (path: string) => currentPath.includes(path);
    
    return (
        <aside className="w-full md:w-1/3 bg-white p-4 rounded shadow-md">
            {/* Avatar & Thông tin user */}
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <img 
                        src={userData?.avatar_url || "https://via.placeholder.com/150"} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover" 
                    />
                </div>
                <h2 className="text-lg font-bold mt-2 mb-4">{userData?.full_name || "Người dùng"}</h2>
                <span className="bg-gray-300 text-sm px-3 py-1 rounded mt-1">
                    Thành viên Bạc
                </span>
                <p className="text-gray-500 text-sm mt-4">F-Point tích lũy 0</p>
                <p className="text-gray-500 text-xs mb-4">Thêm 30.000 để nâng hạng Vàng</p>
            </div>

            {/* Danh sách menu */}
            <ul className="mt-4">
                {/* Thông tin tài khoản - Dropdown */}
                <li
                    className="flex items-center justify-between py-2 font-bold cursor-pointer"
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                >
                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faUser} className="text-lg" />
                        <span className="hover:text-red-500 cursor-pointer">Thông tin tài khoản</span>
                    </div>
                    <FontAwesomeIcon icon={isAccountOpen ? faChevronUp : faChevronDown} />
                </li>
                
                {isAccountOpen && (
                    <ul className="ml-6 text-gray-700">
                        <li className={`py-1 ${isActive('/user/profile') ? 'text-red-500' : 'hover:text-red-500'} cursor-pointer`}>
                            <Link to="/user/profile">Hồ sơ cá nhân</Link>
                        </li>
                        <li className={`py-1 ${isActive('address') ? 'text-red-500' : 'hover:text-red-500'} cursor-pointer`}>
                            <Link to="/user/addresses">Số địa chỉ</Link>
                        </li>
                        <li className={`py-1 ${isActive('/user/change-password') ? 'text-red-500' : 'hover:text-red-500'} cursor-pointer`}>
                            <Link to="/user/change-password">Đổi mật khẩu</Link>
                        </li>
                        {/* <li className="py-1 hover:text-red-500 cursor-pointer">
                            <Link to="/user/invoice">Thông tin xuất hóa đơn GTGT</Link>
                        </li>
                        <li className="py-1 hover:text-red-500 cursor-pointer">
                            <Link to="/user/membership">Ưu đãi thành viên</Link>
                        </li> */}
                    </ul>
                )}

                {/* Các menu khác */}
                <li className={`flex items-center space-x-2 py-2 mt-1 ${isActive('/user/orders') ? 'text-red-500' : ''}`}>
                    <FontAwesomeIcon icon={faClipboardList} className="text-lg" />
                    <Link to="/user/orders" className="hover:text-red-500 cursor-pointer">
                        Đơn hàng của tôi
                    </Link>
                </li>
                <li className={`flex items-center space-x-2 py-2 mt-1 ${isActive('/voucher') ? 'text-red-500' : ''}`}>
                    <FontAwesomeIcon icon={faTicketAlt} className="text-lg" />
                    <Link to="/voucher" className="hover:text-red-500 cursor-pointer">
                        Ví voucher
                    </Link>
                </li>
                <li className={`flex items-center space-x-2 py-2 mt-1 ${isActive('/user/notifications') ? 'text-red-500' : ''}`}>
                    <FontAwesomeIcon icon={faBell} className="text-lg" />
                    <Link to="/user/notifications" className="hover:text-red-500 cursor-pointer">
                        Thông Báo
                    </Link>
                </li>
                <li className={`flex items-center space-x-2 py-2 mt-1 ${isActive('/user/wishlist') ? 'text-red-500' : ''}`}>
                    <FontAwesomeIcon icon={faHeart} className="text-lg" />
                    <Link to="/user/wishlist" className="hover:text-red-500 cursor-pointer">
                        Sản phẩm yêu thích
                    </Link>
                </li>
                <li className={`flex items-center space-x-2 py-2 mt-1 ${isActive('/user/reviews') ? 'text-red-500' : ''}`}>
                    <FontAwesomeIcon icon={faStar} className="text-lg" />
                    <Link to="/user/reviews" className="hover:text-red-500 cursor-pointer">
                        Đánh giá của tôi
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default UserSidebar;