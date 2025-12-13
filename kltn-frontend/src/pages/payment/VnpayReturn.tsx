import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Home, ShoppingBag, Phone } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { createOrder } from '@/services/orderService';
import { clearCart } from '@/services/cartService';
import { useAuthStore } from '@/stores/useAuthStore';

const VnpayReturn = () => {
    const { authUser } = useAuthStore();
     const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [orderId, setOrderId] = useState<number | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const responseCode = params.get('vnp_ResponseCode');
        const transactionStatus = params.get('vnp_TransactionStatus');
        const user = authUser;
      
        if  (!user) {
            toast.error('Vui lòng đăng nhập để tiếp tục');
            setStatus('fail');
            return;
        }

        const createOrderAfterPayment = async () => {
            try {
                const orderDataStr = localStorage.getItem('pendingOrder');
                if (!orderDataStr) {
                    toast.error('Không tìm thấy thông tin đơn hàng');
                    setStatus('fail');
                    return;
                }

                const orderData = JSON.parse(orderDataStr);
                
                // Check if order is from "Buy Now" (has flag in order data)
                const isBuyNow = orderData.isBuyNow || false;
                
                // Create order through API
                const orderResponse = await createOrder(orderData);
                if (!orderResponse) {
                    toast.error('Không thể tạo đơn hàng');
                    setStatus('fail');
                    return;
                }

                // Save order ID for display
                if (orderResponse && orderResponse.id) {
                    setOrderId(orderResponse.id);
                }

                // Clear cart only if order is from cart checkout (not buy now)
                if (!isBuyNow) {
                    await clearCart(user.id);
                }
                
                // Remove pending order from localStorage
                localStorage.removeItem('pendingOrder');
                
                toast.success('Thanh toán thành công!');
                setStatus('success');
            } catch (err: any) {
                console.error('Error creating order after payment:', err);
                toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng');
                setStatus('fail');
            }
        };

        if (responseCode === '00' && transactionStatus === '00') {
            createOrderAfterPayment();
        } else {
            toast.error('Thanh toán không thành công');
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
                    onClick={() => navigate('/orders')}
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
            <Toaster position="top-right" richColors />
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