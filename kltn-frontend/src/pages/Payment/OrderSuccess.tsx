import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag, FileText, Home, MapPin, Phone, Calendar, Truck } from 'lucide-react';

interface OrderSuccessProps {}

const OrderSuccess: React.FC<OrderSuccessProps> = () => {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;
  const orderNumber = location.state?.orderNumber || Math.floor(100000 + Math.random() * 900000).toString();

  // Set page title
  useEffect(() => {
    document.title = "Đặt hàng thành công | DAVINCI";
    return () => {
      document.title = "DAVINCI - Thương hiệu thời trang cao cấp";
    };
  }, []);

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Calculate expected delivery date (5 days from now)
  const getExpectedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <span className="mt-1 text-xs text-green-500 font-medium">Giỏ hàng</span>
            </div>
            <div className="flex-1 h-1 bg-green-500 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <span className="mt-1 text-xs text-green-500 font-medium">Đặt hàng</span>
            </div>
            <div className="flex-1 h-1 bg-green-500 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <span className="mt-1 text-xs text-green-500 font-medium">Hoàn tất</span>
            </div>
          </div>
        </div>
        
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-green-500 h-16 w-16" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Cảm ơn bạn đã đặt hàng thời trang!</h1>
          <p className="text-gray-600 text-lg mb-6">
            Đơn hàng thời trang của bạn đã được đặt thành công và đang được xử lý.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-md p-4 max-w-md mx-auto">
            <p className="font-medium text-gray-800">
              Mã đơn hàng: <span className="text-green-600 font-bold">{orderNumber}</span>
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Ngày đặt: {formatDate(new Date())}
            </p>
          </div>
        </div>

        {/* Order Info & Delivery */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 flex-1">
            <div className="flex items-center border-b pb-3 mb-4">
              <Package className="h-5 w-5 mr-2 text-blue-500" />
              <h2 className="font-semibold text-lg">Thông tin đơn hàng</h2>
            </div>
            
            {orderDetails ? (
              <div className="space-y-4">
                
                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thành tiền:</span>
                    <span>{orderDetails.totalPrice.toLocaleString('vi-VN')}₫</span>
                  </div>
                  
                  {orderDetails.totalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Giảm giá:</span>
                      <span className="text-green-600">-{orderDetails.totalDiscount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>{(orderDetails.shippingCost || 0).toLocaleString('vi-VN')}₫</span>
                  </div>
                  
                  <div className="flex justify-between pt-2 border-t font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-red-600">
                      {(orderDetails.totalPrice + (orderDetails.shippingCost || 0) - (orderDetails.totalDiscount || 0)).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-sm font-medium">Phương thức thanh toán:</p>
                  <p className="text-sm mt-1">
                    {orderDetails.payment_method === 'CASH_ON_DELIVERY' 
                      ? 'Thanh toán khi nhận hàng (COD)' 
                      : 'Thanh toán qua VNPay'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>Không tìm thấy thông tin đơn hàng.</p>
              </div>
            )}
          </div>
          
          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-md p-6 flex-1">
            <div className="flex items-center border-b pb-3 mb-4">
              <Truck className="h-5 w-5 mr-2 text-blue-500" />
              <h2 className="font-semibold text-lg">Thông tin giao hàng</h2>
            </div>
            
            {orderDetails ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{orderDetails.full_name}</p>
                      <p className="text-sm text-gray-600">
                        {orderDetails.address}, {orderDetails.ward}, {orderDetails.district}, {orderDetails.city}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <Phone className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                    <p>{orderDetails.phone_number}</p>
                  </div>
                  
                  <div className="flex">
                    <Calendar className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Ngày giao dự kiến:</p>
                      <p className="text-sm text-gray-600">{getExpectedDeliveryDate()}</p>
                    </div>
                  </div>

                  {orderDetails.note && (
                    <div className="pt-3 mt-3 border-t border-gray-100">
                      <p className="font-medium">Ghi chú:</p>
                      <p className="text-sm text-gray-600 mt-1">{orderDetails.note}</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-blue-50 rounded-md p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    Chúng tôi sẽ liên hệ với bạn qua số điện thoại để xác nhận đơn hàng trước khi giao.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <p>Không tìm thấy thông tin đơn hàng.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Link to="/" className="bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg flex items-center justify-center transition-colors">
            <Home className="h-4 w-4 mr-2" />
            Quay về trang chủ
          </Link>
          
          <Link to="/user/orders" className="bg-blue-500 text-white hover:bg-blue-600 font-medium px-6 py-3 rounded-lg flex items-center justify-center transition-colors">
            <FileText className="h-4 w-4 mr-2" />
            Xem đơn hàng của tôi
          </Link>
          
          <Link to="/" className="bg-green-500 text-white hover:bg-green-600 font-medium px-6 py-3 rounded-lg flex items-center justify-center transition-colors">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Tiếp tục mua sắm thời trang
          </Link>
        </div>
        
        {/* Help Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Cần hỗ trợ?</h3>
          <p className="mb-4">Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng giúp đỡ bạn.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="tel:1900123456" className="transition-colors bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md text-sm font-medium">
              Hotline: 0974 867266
            </a>
            <a href="mailto:support@davinci.com" className="transition-colors bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md text-sm font-medium">
              Email: support@davinci.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;