import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Home, ShoppingBag, Phone } from 'lucide-react';
import { Toaster } from 'sonner';

const mockCartService = {
    createOrder: async (orderData: any) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { id: Math.floor(100000 + Math.random() * 900000) };
    },
    clearCart: async (userId: number) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    }
};

const VnpayReturn = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [orderId, setOrderId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const responseCode = params.get('vnp_ResponseCode');
        const transactionStatus = params.get('vnp_TransactionStatus');
        const getUserData = () => {
            try {
                const userData = localStorage.getItem('vuvisa_user_data');
                if (userData) {
                    return JSON.parse(userData);
                }
                return { id: 1, full_name: 'Khách hàng' }; // Dữ liệu mặc định
            } catch (error) {
                console.error('Error getting user data:', error);
                return { id: 1, full_name: 'Khách hàng' };
            }
        };
        const user = getUserData();

        const createOrderAfterPayment = async () => {
            setIsLoading(true);
            try {
                const orderDataStr = localStorage.getItem('pendingOrder');
                if (!orderDataStr) {
                    setStatus('fail');
                    return;
                }

                const orderData = JSON.parse(orderDataStr);
                // Comment: Thay thế API call bằng mock service
                const orderResponse = await mockCartService.createOrder(orderData);
                if (!orderResponse) {
                    setStatus('fail');
                    return;
                }

                // Lưu ID đơn hàng để hiển thị
                if (orderResponse && orderResponse.id) {
                    setOrderId(orderResponse.id);
                }

                // Xóa giỏ hàng
                await mockCartService.clearCart(user.id);
                // Xóa order tạm khỏi localStorage
                localStorage.removeItem('pendingOrder');
                setStatus('success');
            } catch (err) {
                setStatus('fail');
            } finally {
                setIsLoading(false);
            }
        };

        if (responseCode === '00' && transactionStatus === '00') {
            createOrderAfterPayment();
        } else {
            setStatus('fail');
        }
    }, [location.search]);

    const renderProcessing = () => (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
            <div className="flex justify-center mb-6">
                <Loader className="text-blue-500 animate-spin" size={64} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Đang xử lý thanh toán</h2>
            <p className="text-gray-600 mb-6">
                Hệ thống đang xác nhận giao dịch của bạn, vui lòng đợi trong giây lát...
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-600 text-sm">
                    Không tắt hoặc làm mới trang cho đến khi quá trình hoàn tất
                </p>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
            <div className="flex justify-center mb-6">
                <CheckCircle className="text-green-500" size={64} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
            <div className="bg-green-50 p-4 rounded-lg mb-6">
                <p className="text-green-700 mb-2">
                    Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận.
                </p>
                {orderId && (
                    <p className="font-medium text-green-800">
                        Mã đơn hàng: <span className="font-bold">{orderId}</span>
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={() => navigate('/user/orders')}
                    className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                    <ShoppingBag size={20} />
                    Xem đơn hàng của tôi
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    <Home size={20} />
                    Quay về trang chủ
                </button>
            </div>
        </div>
    );

    const renderFail = () => (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
            <div className="flex justify-center mb-6">
                <XCircle className="text-red-500" size={64} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Thanh toán không thành công</h2>
            <div className="bg-red-50 p-4 rounded-lg mb-6">
                <p className="text-red-700">
                    Rất tiếc, giao dịch của bạn chưa hoàn tất. Đơn hàng của bạn chưa được ghi nhận.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                    <ShoppingBag size={20} />
                    Quay lại giỏ hàng
                </button>

                <button
                    onClick={() => navigate('/user/orders')}
                    className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    <Home size={20} />
                    Quay về trang chủ
                </button>

                <button
                    onClick={() => navigate('/contact')}
                    className="flex items-center justify-center w-full gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                    <Phone size={20} />
                    Liên hệ hỗ trợ
                </button>
            </div>
        </div>
    );

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="w-full max-w-md mb-8">
                    <h1 className="text-center text-3xl font-bold text-gray-800 mb-2">Kết quả thanh toán</h1>
                    <p className="text-center text-gray-600">VNPAY Payment Gateway</p>
                </div>

                {status === 'processing' && renderProcessing()}
                {status === 'success' && renderSuccess()}
                {status === 'fail' && renderFail()}
            </div>
        </>
    );
};

export default VnpayReturn;