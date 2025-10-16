import React from "react";
import { FaTshirt } from "react-icons/fa";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-[#F0F0F0] flex items-center justify-center p-6">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 bg-gradient-to-br from-[#C92127] to-[#a71b20] p-8 hidden md:flex flex-col justify-between text-white">
                    <div>
                        <div className="flex items-center mb-8">
                            <FaTshirt className="text-3xl mr-3" />
                            <h1 className="text-2xl font-bold">DAVINCI</h1>
                        </div>
                        <h2 className="text-3xl font-bold mb-6">Chào mừng trở lại!</h2>
                        <p className="text-white/80 mb-8">
                            Đăng nhập để truy cập tài khoản của bạn và khám phá thế giới thời trang cùng với DAVINCI.
                            Chúng tôi luôn cập nhật những sản phẩm thời trang mới nhất và phong cách nhất.
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <svg className="w-full max-w-md mx-auto" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
                            <path d="M234,307c14.2-6.3,33.1-10.1,46-18c13.4-8.2,23.5-21.6,33.5-33.5c8.5-10.2,19.1-19.1,24.5-31.5c6-13.8,10.3-28.8,11-44c0.8-16-3.3-32.6-11-46c-8.1-14.1-22.9-24.2-37-31c-15.8-7.5-33.2-8.9-51-10c-19.6-1.2-40.8,0.9-57,12c-15.5,10.6-23,29.3-32,45c-9.6,16.8-17.9,34-21,53c-3.5,21.4-4.8,45.8,7,64c10.9,16.8,30.5,27,51,30C210.8,319.2,219.3,313.6,234,307z" fill="#ffcabd"/>
                            <path d="M456,224c0,57.438-65.223,104-145.667,104S258.5,280.5,204.5,232.5s-69.436-128.587-18-163C246.5,25.5,310.333,16.562,456,224z" fill="#ffab91"/>
                            <ellipse cx="284" cy="228" rx="65" ry="55" fill="#f9f9f9"/>
                            <ellipse cx="284" cy="228" rx="55" ry="45" fill="#ffffff"/>
                            <path d="M284,265c-23.71,0-43-16.58-43-37s19.29-37,43-37s43,16.58,43,37S307.71,265,284,265z" fill="#c92127"/>
                            <ellipse cx="284" cy="228" rx="33" ry="27" fill="#ffffff"/>
                            <circle cx="275" cy="222" r="10" fill="#333333"/>
                            <circle cx="293" cy="222" r="10" fill="#333333"/>
                            <circle cx="277" cy="219" r="3" fill="#ffffff"/>
                            <circle cx="295" cy="219" r="3" fill="#ffffff"/>
                        </svg>
                    </div>

                    <div className="hidden md:block mt-8">
                        <p className="text-white/80 text-sm">
                            © 2024 VUVISA. Mọi quyền được bảo lưu.
                        </p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
                    {children}
                </div>
            </div>
        </div>
    );
}
