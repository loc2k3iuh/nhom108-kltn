import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   
    faEdit,
    faTrash,
    faPlus,
    faMapMarkerAlt,
    faPhone
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { toast } from "sonner";
import UserSidebar from "../components/UserSidebar";
import { getMyAddresses, deleteAddress as deleteAddressAPI, AddressResponse } from "../services/addressService";
import { useAuthStore } from "../stores/useAuthStore";

const AddressesPage = () => {
    const { authUser } = useAuthStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [addresses, setAddresses] = useState<AddressResponse[]>([]);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const pageSize = 3;

    // Function to fetch addresses
    const fetchAddresses = async (page: number = 0) => {
        try {
            setIsLoading(true);
            const data = await getMyAddresses(page, pageSize);
            setAddresses(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            toast.error("Đã xảy ra lỗi khi tải danh sách địa chỉ");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (authUser?.id) {
            fetchAddresses();
        }
    }, [authUser]);

    const handleDeleteAddress = async (addressId: number) => {
        toast.custom((t) => (
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-md">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">Xác nhận xóa</h3>
                        <p className="mt-1 text-sm text-gray-600">Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={async () => {
                                    toast.dismiss(t);
                                    try {
                                        setIsDeleting(addressId);
                                        await deleteAddressAPI(addressId);
                                        toast.success("Xóa địa chỉ thành công!");
                                        
                                        // Reload current page or go to previous page if current page becomes empty
                                        const remainingItems = addresses.length - 1;
                                        if (remainingItems === 0 && currentPage > 0) {
                                            fetchAddresses(currentPage - 1);
                                        } else {
                                            fetchAddresses(currentPage);
                                        }
                                    } catch (error: any) {
                                        console.error('Error deleting address:', error);
                                        toast.error(error?.response?.data?.message || "Không thể xóa địa chỉ!");
                                    } finally {
                                        setIsDeleting(null);
                                    }
                                }}
                                className="px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors"
                            >
                                Xóa
                            </button>
                            <button
                                onClick={() => toast.dismiss(t)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ), {
            duration: Infinity,
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchAddresses(newPage);
        }
    };    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row">
                {/* Sidebar */}
                <UserSidebar />

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
                                                to={`/user/addresses/edit/${address.id}`} 
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

                        {/* Pagination */}
                        {!isLoading && totalPages > 1 && (
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                                <div className="text-sm text-gray-600">
                                    Hiển thị <span className="font-semibold">{addresses.length}</span> / <span className="font-semibold">{totalElements}</span> địa chỉ
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 0}
                                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Trước
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i).map((page) => {
                                            // Show first page, last page, current page and surrounding pages
                                            if (
                                                page === 0 ||
                                                page === totalPages - 1 ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`px-3 py-2 rounded-lg transition-colors ${
                                                            currentPage === page
                                                                ? 'bg-red-500 text-white font-semibold'
                                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {page + 1}
                                                    </button>
                                                );
                                            } else if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return <span key={page} className="px-2 text-gray-500">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                    
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages - 1}
                                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        )}
                    </article>
                </div>
            </div>
        </div>
    );
};

export default AddressesPage;
