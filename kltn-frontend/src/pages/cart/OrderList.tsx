import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import {
    ClockIcon,
    CheckBadgeIcon,
    CubeIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { getOrdersByUser, cancelOrder } from '@/services/orderService';
import { useAuthStore } from '@/stores/useAuthStore';

const OrderList: React.FC = () => {
    const [orderPage, setOrderPage] = useState<any>({ content: [], totalPages: 0, totalElements: 0 });
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
    const { authUser } = useAuthStore();

    console.log("Order page", orderPage);


    useEffect(() => {
        if (authUser?.id) {
            fetchOrders(currentPage);
        }
    }, [currentPage, authUser?.id]);

    const fetchOrders = async (page: number) => {
        if (!authUser?.id) return;
        
        try {
            setIsLoading(true);
            const data = await getOrdersByUser(authUser.id, page, 10);
            console.log("Fetched orders data:", data);
            setOrderPage(data);
        } catch (error: any) {
            console.error('Error fetching orders:', error);
            toast.error(error.message || 'Không thể tải danh sách đơn hàng');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = async (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleCancelOrder = async (orderId: number) => {
        const result = await Swal.fire({
            title: 'Xác nhận hủy đơn hàng',
            html: `
                <div class="text-left">
                    <p class="text-gray-600 mb-3">Bạn có chắc chắn muốn hủy đơn hàng <strong>#${orderId}</strong>?</p>
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                        <div class="flex">
                            <svg class="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                            <div>
                                <p class="text-sm text-yellow-800 font-medium mb-1">Lưu ý quan trọng:</p>
                                <ul class="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                                    <li>Đơn hàng đã hủy không thể khôi phục</li>
                                    <li>Sản phẩm sẽ được trả về kho</li>
                                    <li>Voucher đã sử dụng sẽ không được hoàn lại</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: '<i class="fas fa-times-circle"></i> Xác nhận hủy',
            cancelButtonText: '<i class="fas fa-arrow-left"></i> Quay lại',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition',
                cancelButton: 'px-6 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition'
            },
            buttonsStyling: true,
            reverseButtons: true,
            focusCancel: true
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setCancellingOrderId(orderId);
            
            // Hiển thị toast loading
            const loadingToast = toast.loading('Đang xử lý hủy đơn hàng...', {
                duration: Infinity
            });

            await cancelOrder(orderId);
            
            // Dismiss loading toast
            toast.dismiss(loadingToast);
            
            // Hiển thị thông báo thành công với animation đẹp
            await Swal.fire({
                title: 'Hủy đơn hàng thành công!',
                html: `
                    <div class="text-center">
                        <div class="mb-4">
                            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <svg class="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <p class="text-gray-600 mb-2">Đơn hàng <strong>#${orderId}</strong> đã được hủy</p>
                        <p class="text-sm text-gray-500">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                    </div>
                `,
                icon: 'success',
                confirmButtonColor: '#10b981',
                confirmButtonText: 'Đóng',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition'
                },
                timer: 3000,
                timerProgressBar: true
            });
            
            // Reload orders after cancellation
            await fetchOrders(currentPage);
        } catch (error: any) {
            console.error('Error cancelling order:', error);
            
            // Hiển thị lỗi với SweetAlert2
            await Swal.fire({
                title: 'Không thể hủy đơn hàng!',
                html: `
                    <div class="text-center">
                        <div class="mb-4">
                            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                <svg class="h-10 w-10 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <p class="text-gray-600 mb-2">${error.message || 'Đã xảy ra lỗi khi hủy đơn hàng'}</p>
                        <p class="text-sm text-gray-500">Vui lòng thử lại sau hoặc liên hệ hỗ trợ khách hàng</p>
                    </div>
                `,
                icon: 'error',
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'Đã hiểu',
                customClass: {
                    popup: 'rounded-2xl',
                    confirmButton: 'px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition'
                }
            });
        } finally {
            setCancellingOrderId(null);
        }
    };

    const Pagination = () => {
        const pages = Array.from(Array(orderPage.totalPages).keys());

        return (
            <div className="flex justify-center items-center space-x-3 mt-8">
                <button
                    className={`px-4 py-2 rounded-lg flex items-center transition duration-200 ${currentPage === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Trước
                </button>

                {pages.map(page => (
                    <button
                        key={page}
                        className={`w-10 h-10 rounded-full font-medium transition duration-200 ${currentPage === page
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page + 1}
                    </button>
                ))}

                <button
                    className={`px-4 py-2 rounded-lg flex items-center transition duration-200 ${currentPage === orderPage.totalPages - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === orderPage.totalPages - 1}
                >
                    Sau
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';     // Nhẹ nhàng, dễ nhìn
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-800';
            case 'PACKING':
                return 'bg-purple-100 text-purple-800';
            case 'DELIVERING':
                return 'bg-orange-100 text-orange-800';
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };


    const getStatusIcon = (status: string) => {
        const iconClass = "h-4 w-4 mr-1";

        switch (status) {
            case 'PENDING':
                return <ClockIcon className={iconClass} />;
            case 'CONFIRMED':
                return <CheckBadgeIcon className={iconClass} />;
            case 'PACKING':
                return <CubeIcon className={iconClass} />;
            case 'DELIVERING':
                return <TruckIcon className={iconClass} />;
            case 'COMPLETED':
                return <CheckCircleIcon className={iconClass} />;
            case 'CANCELLED':
                return <XCircleIcon className={iconClass} />;
            default:
                return null;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'CONFIRMED':
                return 'Đã xác nhận';
            case 'PACKING':
                return 'Đang đóng gói';
            case 'DELIVERING':
                return 'Đang giao hàng';
            case 'COMPLETED':
                return 'Hoàn thành';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return '';
        }
    };

    const getPaymentMethodIcon = (method: string) => {
        if (method === 'CASH_ON_DELIVERY') {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            );
        } else {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            );
        }
    };

    const getPaymentMethodText = (method: string) => {
        return method === 'COD' ? 'Tiền mặt khi nhận hàng' : 'VNPAY';
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 min-h-[60vh] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mb-4"></div>
                <p className="text-gray-600 font-medium">Đang tải đơn hàng...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 lg:p-6 lg:max-w-6xl">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 mb-8 flex items-center">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Đơn hàng của tôi</h2>
                    <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng của bạn tại đây</p>
                </div>
                <div className="hidden md:block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-red-400 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
            </div>

            {orderPage.content.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                    <div className="flex justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 text-gray-800">Bạn chưa có đơn hàng nào</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và đặt hàng ngay hôm nay!</p>
                    <Link to="/" className="inline-flex items-center bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <>
                    <div className="space-y-6">
                        {orderPage.content.map((order: any) => (
                            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
                                {/* Order Header */}
                                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-4 border-b border-gray-100">
                                    <div className="flex items-center mb-3 md:mb-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <div>
                                            <p className="font-medium text-gray-800">Đơn hàng #{order.id}</p>
                                            <p className="text-sm text-gray-500">
                                                Ngày đặt: {new Date(order.order_date).toLocaleDateString('vi-VN', { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-lg text-sm border flex items-center ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {getStatusText(order.status)}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 mb-2">Thông tin giao hàng</h4>
                                            <div className="space-y-1 text-sm">
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Người nhận:</span> {order.full_name || 'Chưa cập nhật'}
                                                </p>
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Số điện thoại:</span> {order.phone_number || 'Chưa cập nhật'}
                                                </p>
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Địa chỉ:</span> {`${order.address}, ${order.ward}, ${order.district}, ${order.city}` || 'Chưa cập nhật'}

                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-4 mb-6">
                                    <h4 className="font-semibold text-gray-800 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Sản phẩm đã đặt ({order.order_details?.length || 0} sản phẩm)
                                    </h4>
                                    {order.order_details && order.order_details.map((item: any, index: number) => (
                                        <div key={item.product_id || index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                                            <div className="relative flex-shrink-0">
                                                {item.image_url ? (
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.product_name}
                                                        className="w-24 h-28 object-cover rounded-md shadow-sm"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-24 h-28 bg-gray-200 rounded-md shadow-sm flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-800 mb-1 line-clamp-2">{item.product_name || 'Sản phẩm'}</h4>
                                                {item.variant_options && (
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        Phân loại: <span className="font-medium">{item.variant_options}</span>
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <p className="text-red-500 font-semibold text-lg">
                                                        {(item.price || 0).toLocaleString()}₫
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        x{item.quantity} = <span className="font-medium text-gray-700">{((item.price || 0) * item.quantity).toLocaleString()}₫</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tạm tính:</span>
                                            <span className="font-medium text-gray-800">
                                                {order.order_details?.reduce((sum: number, item: any) => 
                                                    sum + (item.price * item.quantity), 0
                                                ).toLocaleString()}₫
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Phí vận chuyển:</span>
                                            <span className="font-medium text-gray-800">
                                                {order.shipping_cost ? `${order.shipping_cost.toLocaleString()}₫` : 'Miễn phí'}
                                            </span>
                                        </div>
                                        {order.discount_amount > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Giảm giá:</span>
                                                <span className="font-medium text-green-600">
                                                    -{order.discount_amount.toLocaleString()}₫
                                                </span>
                                            </div>
                                        )}
                                        <div className="border-t border-gray-300 pt-2 mt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 font-semibold">Tổng thanh toán:</span>
                                                <span className="text-2xl font-bold text-red-500">
                                                    {order.final_amount.toLocaleString()}₫
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="mt-4 flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                                    <div className="flex items-center">
                                        {getPaymentMethodIcon(order.payment_method)}
                                        <div>
                                            <p className="text-xs text-gray-500">Phương thức thanh toán</p>
                                            <p className="font-medium text-gray-700">
                                                {getPaymentMethodText(order.payment_method)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Trạng thái thanh toán</p>
                                        <p className={`font-medium ${order.payment_status === 'PAID' ? 'text-green-600' : 'text-orange-600'}`}>
                                            {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </p>
                                    </div>
                                </div>

                                {/* Note if exists */}
                                {order.note && (
                                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Ghi chú:</span> {order.note}
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {order.status === 'PENDING' && (
                                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                                        <button
                                            onClick={() => handleCancelOrder(order.id)}
                                            disabled={cancellingOrderId === order.id}
                                            className="px-5 py-2.5 bg-white border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition duration-200 flex items-center font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                                        >
                                            {cancellingOrderId === order.id ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Đang hủy...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    Hủy đơn hàng
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <Pagination />
                </>
            )}
        </div>
    );
};

export default OrderList;