import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    District, 
    fetchDistrictsByProvince, 
    fetchWardsByDistrict, 
    fetchProvinces,
    Province, 
    Ward,
    getMyAddresses
} from '@/services/addressService';
import { createOrder, CreateOrderItem } from '@/services/orderService';
import { clearCart } from '@/services/cartService';
import { createVnPayPayment } from '@/services/vnpayService';
import { useAuthStore } from '@/stores/useAuthStore';
import { getSuitableVouchersForOrder, VoucherResponse } from '@/services/voucherService';

interface ValidationErrors {
    phone?: string;
    fullName?: string;
    addressDetail?: string;
    email?: string;
    city?: string;
    district?: string;
    ward?: string;
    orderItems?: string;
}
const Payment: React.FC = () => {
    const navigate = useNavigate();
    const { authUser } = useAuthStore();

    const formatPrice = (price: number): string => {
        return price.toLocaleString('vi-VN') + ' đ';
    };
    const [isLoading, setIsLoading] = useState(false);
    // Địa chỉ giao hàng
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');
    const [ward, setWard] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [cityName, setCityName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [wardName, setWardName] = useState('');
    const [note, setNote] = useState('');

    // Phương thức vận chuyển
    const [shippingMethod, setShippingMethod] = useState('STANDARD');

    // Phương thức thanh toán
    const [paymentMethod, setPaymentMethod] = useState('COD'); // Mặc định là thanh toán khi nhận hàng
    
    // Track if order is from "Buy Now" or "Cart Checkout"
    const [isBuyNow, setIsBuyNow] = useState(false);
    
    // Modal states for address selection
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [addressPage, setAddressPage] = useState(0);
    const [addressTotalPages, setAddressTotalPages] = useState(0);
    const [addressCityFilter, setAddressCityFilter] = useState('');
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

    // Danh sách sản phẩm (ví dụ)
    const [orderItems, setOrderItems] = useState<any>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingCost, setShippingCost] = useState(30000); // Mặc định 30,000đ
    
    // Voucher states
    const [suitableVouchers, setSuitableVouchers] = useState<VoucherResponse[]>([]);
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherResponse | null>(null);
    const [voucherDiscount, setVoucherDiscount] = useState(0);

    const loadProvinces = async () => {
        try {
            const data = await fetchProvinces();
            setProvinces(data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
            toast.error('Không thể tải danh sách tỉnh/thành phố');
        }
    };
    
    const loadSavedAddresses = async (page: number = 0, cityFilter: string = '') => {
        if (!authUser) return;
        
        try {
            setIsLoadingAddresses(true);
            const data = await getMyAddresses(page, 4, cityFilter || undefined);
            
            setSavedAddresses(data.content);
            setAddressTotalPages(data.totalPages);
            setAddressPage(page);
        } catch (error) {
            console.error('Error loading saved addresses:', error);
            toast.error('Không thể tải danh sách địa chỉ đã lưu');
        } finally {
            setIsLoadingAddresses(false);
        }
    };
    
    const handleSelectAddress = async (address: any) => {
        // Set form fields from selected address
        setFullName(authUser?.full_name || '');
        setEmail(authUser?.email || '');
        setPhone(address.phoneNumber);
        setAddressDetail(address.detailAddress);
        
        // Find province code from name
        const selectedProvince = provinces.find((p: Province) => p.name === address.city);
        if (selectedProvince) {
            setCity(selectedProvince.code);
            setCityName(selectedProvince.name);
            
            // Load districts for this province
            const districtsList = await fetchDistrictsByProvince(selectedProvince.code);
            setDistricts(districtsList);
            
            // Find district code from name
            const selectedDistrict = districtsList.find((d: District) => d.name === address.district);
            if (selectedDistrict) {
                setDistrict(selectedDistrict.code);
                setDistrictName(selectedDistrict.name);
                
                // Load wards for this district
                const wardsList = await fetchWardsByDistrict(selectedDistrict.code);
                setWards(wardsList);
                
                // Find ward code from name
                const selectedWard = wardsList.find((w: Ward) => w.name === address.ward);
                if (selectedWard) {
                    setWard(selectedWard.code);
                    setWardName(selectedWard.name);
                }
            }
        }
        
        setShowAddressModal(false);
        toast.success('Đã chọn địa chỉ');
    };

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceCode = e.target.value;
        const selectedProvince = provinces.find((p: Province) => parseInt(p.code) === parseInt(provinceCode));

        setCity(provinceCode);
        setCityName(selectedProvince?.name || '');
        setDistrict('');
        setDistrictName('');
        setWard('');
        setWardName('');

        if (provinceCode) {
            try {
                const districts = await fetchDistrictsByProvince(provinceCode);
                setDistricts(districts);
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        } else {
            setDistricts([]);
        }
        setWards([]);
    };

    // Update handleDistrictChange
    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtCode = e.target.value;
        const selectedDistrict = districts.find((d: District) => parseInt(d.code) === parseInt(districtCode));

        setDistrict(districtCode);
        setDistrictName(selectedDistrict?.name || '');
        setWard('');
        setWardName('');

        if (districtCode) {
            try {
                const wards = await fetchWardsByDistrict(districtCode);
                setWards(wards);
            } catch (error) {
                console.error('Error fetching wards:', error);
            }
        } else {
            setWards([]);
        }
    };

    // Update handle ward change
    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardCode = e.target.value;
        const selectedWard = wards.find((w: Ward) => parseInt(w.code) === parseInt(wardCode));

        setWard(wardCode);
        setWardName(selectedWard?.name || '');
    };

    // Cập nhật phí ship khi thay đổi tỉnh/thành phố hoặc phương thức vận chuyển
    useEffect(() => {
        if (cityName) {
            // Kiểm tra nếu là TP.HCM (các cách viết khác nhau)
            const isHCM = cityName.toLowerCase().includes('hồ chí minh') || 
                          cityName.toLowerCase().includes('hcm') ||
                          cityName.toLowerCase().includes('tp hồ chí minh') ||
                          cityName.toLowerCase().includes('thành phố hồ chí minh');
            
            if (isHCM) {
                // TP.HCM có nhiều phương thức
                switch (shippingMethod) {
                    case 'STANDARD':
                        setShippingCost(0); // Miễn phí
                        break;
                    case 'GRABEXPRESS':
                        setShippingCost(30000); // Giao hàng nhanh
                        break;
                    case 'SHOPEEEXPRESS':
                        setShippingCost(20000); // Giao hàng trong ngày
                        break;
                    default:
                        setShippingCost(0);
                }
            } else {
                // Tỉnh khác chỉ có giao hàng tiêu chuẩn
                setShippingMethod('STANDARD');
                setShippingCost(30000);
            }
        }
    }, [cityName, shippingMethod]);

    // Load order items from navigation state (buy now) or localStorage (cart checkout)
    const location = useLocation();
    
    useEffect(() => {
        // Prioritize buy now data from navigation state
        const buyNowItems = location.state?.buyNowItems;
        
        let items = null;
        
        if (buyNowItems && buyNowItems.length > 0) {
            // Buy now flow: use data from navigation state
            items = buyNowItems;
            setIsBuyNow(true);
        } else {
            // Cart checkout flow: use data from localStorage
            const itemsData = localStorage.getItem('itemsToCheckout');
            if (itemsData) {
                items = JSON.parse(itemsData);
                setIsBuyNow(false);
            }
        }
        
        if (items) {
            setOrderItems(items);
            
            // Calculate total
            const total = items.reduce((sum: number, item: any) => 
                sum + (item.itemTotal || item.price * item.quantity), 0
            );
            setTotalPrice(total);
        } else {
            toast.error('Không tìm thấy sản phẩm để thanh toán');
            navigate('/cart');
        }
        
        // Load user info if logged in
        if (authUser) {
            setFullName(authUser.full_name || '');
            setEmail(authUser.email || '');
            setPhone(authUser.phone_number || '');
        }
        
        loadProvinces();
    }, [authUser, navigate, location.state]);

    // Load suitable vouchers when totalPrice changes
    useEffect(() => {
        const loadSuitableVouchers = async () => {
            if (authUser?.id && totalPrice > 0) {
                try {
                    const vouchers = await getSuitableVouchersForOrder(authUser.id, totalPrice);
                    setSuitableVouchers(vouchers);
                } catch (error) {
                    console.error('Error loading suitable vouchers:', error);
                }
            }
        };
        
        loadSuitableVouchers();
    }, [authUser?.id, totalPrice]);

    // Calculate discount when voucher is selected
    useEffect(() => {
        if (selectedVoucher) {
            let discount = 0;
            if (selectedVoucher.discountType === 'PERCENT') {
                discount = totalPrice * (selectedVoucher.discountValue / 100);
                // Apply maximum discount cap if exists
                if (selectedVoucher.maximumDiscountAmount && discount > selectedVoucher.maximumDiscountAmount) {
                    discount = selectedVoucher.maximumDiscountAmount;
                }
            } else if (selectedVoucher.discountType === 'FIXED') {
                discount = selectedVoucher.discountValue;
            }
            setVoucherDiscount(Math.min(discount, totalPrice)); // Discount cannot exceed total price
        } else {
            setVoucherDiscount(0);
        }
    }, [selectedVoucher, totalPrice]);

    const validateOrderData = (): ValidationErrors | null => {
        const errors: ValidationErrors = {};

        // Validate phone number
        if (!phone) {
            errors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10}$/.test(phone)) {
            errors.phone = 'Số điện thoại không hợp lệ';
        }

        // Add email validation
        if (email) { // Only validate if email is provided (optional field)
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(email)) {
                errors.email = 'Email không hợp lệ';
            }
        }

        // Validate customer name
        if (!fullName) {
            errors.fullName = 'Vui lòng nhập tên khách hàng';
        }

        // Validate address
        if (!addressDetail) {
            errors.addressDetail = 'Vui lòng nhập địa chỉ';
        }

        // Validate location
        if (!city) {
            errors.city = 'Vui lòng chọn Tỉnh/Thành phố';
        }
        if (!district) {
            errors.district = 'Vui lòng chọn Quận/Huyện';
        }
        if (!ward) {
            errors.ward = 'Vui lòng chọn Phường/Xã';
        }

        // Validate products
        if (orderItems.length === 0) {
            errors.orderItems = 'Vui lòng thêm sản phẩm vào đơn hàng';
        } else {
            // Check product quantities
            const invalidProducts = orderItems.filter((p: { quantity: number; stockQuantity: number }) =>
                p.quantity <= 0 || p.quantity > p.stockQuantity
            );
            if (invalidProducts.length > 0) {
                errors.orderItems = 'Số lượng sản phẩm không hợp lệ';
            }
        }

        return Object.keys(errors).length > 0 ? errors : null;
    };

    const handleCheckout = async () => {
        if (!authUser) {
            toast.error('Vui lòng đăng nhập để tiếp tục');
            navigate('/login');
            return;
        }

        const errors = validateOrderData();
        if (errors) {
            // Show first error message
            const firstError = Object.values(errors)[0];
            toast.error(firstError);
            return;
        }
        
        setIsLoading(true);
        try {
            // Prepare order items from cart
        
            const items: CreateOrderItem[] = orderItems.map((item: any) => ({
                product_variant_id: item.productVariant.id,
                quantity: item.quantity
            }));

            // Chuẩn bị dữ liệu đơn hàng theo format backend
            const orderData = {
                user_id: authUser.id,
                receiver_name: fullName,
                receiver_phone: phone,
                address: addressDetail,
                city: cityName,
                district: districtName,
                ward: wardName,
                shipping_method: shippingMethod.toUpperCase(),
                payment_method: paymentMethod.toUpperCase(),
                note: note || undefined,
                discount_code: selectedVoucher?.code || undefined,
                items: items,
                shipping_cost: shippingCost,
                isBuyNow: isBuyNow, // Add flag to track if order is from Buy Now
            };

            console.log('Order Data:', orderData);

            // For VNPay payment
            if (paymentMethod === 'VNPAY') {
                try {
                    // Store order data for processing after payment
                    localStorage.setItem('pendingOrder', JSON.stringify(orderData));
                    
                    // Calculate final amount (total + shipping - discount)
                    const finalAmount = totalPrice + shippingCost - voucherDiscount;
                    
                    // Create VNPay payment URL
                    const paymentUrl = await createVnPayPayment(finalAmount);
                    
                    // Redirect to VNPay payment gateway
                    window.location.href = paymentUrl;
                    return;
                } catch (error: any) {
                    console.error('VNPay payment error:', error);
                    toast.error(error.message || 'Không thể tạo link thanh toán VNPay');
                    setIsLoading(false);
                    return;
                }
            }

            // For Cash on Delivery - create order directly
            if (paymentMethod === 'COD') {
                const orderResponse = await createOrder(orderData);

                // Clear cart after successful order (only for cart checkout, not buy now)
                if (!isBuyNow) {
                    await clearCart(authUser.id);
                }

                // Navigate to success page
                navigate('/order-success', {
                    state: {
                        orderNumber: orderResponse.id,
                        orderDetails: {
                            ...orderData,
                            orderNumber: orderResponse.id,
                            totalPrice: totalPrice,
                            totalDiscount: voucherDiscount,
                            shippingCost: shippingCost,
                            orderDate: new Date(),
                        }
                    }
                });

                toast.success('Đặt hàng thành công!');
                return;
            }

            toast.error('Phương thức thanh toán không hợp lệ');
        } catch (error: any) {
            console.error('Checkout error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt hàng';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // if (orderItems.length === 0) {
    //     return (
    //         <div className="bg-gray-100 min-h-screen py-6">
    //             <div className="max-w-5xl mx-auto">
    //                 <div className="bg-white p-6 rounded-lg shadow mb-6">
    //                     <h2 className="text-lg font-semibold text-center">Giỏ hàng trống</h2>
    //                     <p className="text-center">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }


    return (
        <>
            <Toaster position="top-right" richColors />
            {isLoading && (
                <div className="fixed inset-0 bg-black/5 backdrop-blur-[2px] z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                </div>
            )}
            
            {/* Address Selection Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                Chọn địa chỉ giao hàng
                            </h3>
                            <button
                                onClick={() => setShowAddressModal(false)}
                                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Search by City */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm theo tỉnh/thành phố..."
                                        value={addressCityFilter}
                                        onChange={(e) => setAddressCityFilter(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                                <button
                                    onClick={() => loadSavedAddresses(0, addressCityFilter)}
                                    className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 220px)' }}>
                            {isLoadingAddresses ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                                </div>
                            ) : savedAddresses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {savedAddresses.map((addr: any) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => handleSelectAddress(addr)}
                                            className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-500 hover:bg-red-50 cursor-pointer transition-all group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="font-semibold text-gray-900">{authUser?.full_name}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span>{addr.phoneNumber}</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    <span className="flex-1">{addr.detailAddress}</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                    </svg>
                                                    <span className="flex-1">{addr.ward}, {addr.district}, {addr.city}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-end">
                                                <span className="text-xs font-medium text-red-500 group-hover:text-red-600">Chọn địa chỉ này →</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-gray-500 text-lg font-medium">Không tìm thấy địa chỉ nào</p>
                                    <p className="text-gray-400 text-sm mt-2">Vui lòng thêm địa chỉ mới hoặc thử tìm kiếm khác</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Pagination */}
                        {!isLoadingAddresses && addressTotalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Trang <span className="font-semibold">{addressPage + 1}</span> / <span className="font-semibold">{addressTotalPages}</span>
                                </div>
                                
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => loadSavedAddresses(addressPage - 1, addressCityFilter)}
                                        disabled={addressPage === 0}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Trước
                                    </button>
                                    <button
                                        onClick={() => loadSavedAddresses(addressPage + 1, addressCityFilter)}
                                        disabled={addressPage === addressTotalPages - 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <div className="bg-gray-100 min-h-screen py-6">

                <div className="max-w-5xl mx-auto">

                    {/* Progress Steps - Thêm mới */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                                <span className="mt-1 text-xs text-red-500 font-medium">Giỏ hàng</span>
                            </div>
                            <div className="flex-1 h-1 bg-red-500 mx-2"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                                <span className="mt-1 text-xs text-red-500 font-medium">Đặt hàng</span>
                            </div>
                            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">3</div>
                                <span className="mt-1 text-xs text-gray-600 font-medium">Hoàn tất</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow mb-6">

                        <div className="mb-8">

                            <div className="flex justify-between items-center border-b pb-3 mb-4 border-gray-300">

                                <h2 className="text-lg font-semibold flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    ĐỊA CHỈ GIAO HÀNG
                                </h2>
                                
                                {authUser && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddressModal(true);
                                            loadSavedAddresses(0, '');
                                        }}
                                        className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                        Chọn địa chỉ đã lưu
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Họ và tên người nhận */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">
                                        Họ và tên người nhận <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Nhập họ và tên người nhận"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@email.com"
                                    />
                                </div>

                                {/* Số điện thoại */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="0xxxxxxxxx (10 ký tự số)"
                                        required
                                    />
                                </div>

                                {/* Tỉnh/Thành phố */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="city">
                                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="city"
                                        value={city}
                                        onChange={handleProvinceChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white"
                                        required
                                    >
                                        <option value="">- Chọn Tỉnh/Thành phố -</option>
                                        {provinces.map(province => (
                                            <option key={province.code} value={province.code}>
                                                {province.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Quận/Huyện */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="district">
                                        Quận/Huyện <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="district"
                                        value={district}
                                        onChange={handleDistrictChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white"
                                        disabled={!city}
                                        required
                                    >
                                        <option value="">- Chọn Quận/Huyện -</option>
                                        {districts.map(district => (
                                            <option key={district.code} value={district.code}>
                                                {district.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                {/* Phường/Xã */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="ward">
                                        Phường/Xã <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="ward"
                                        value={ward}
                                        onChange={handleWardChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white"
                                        disabled={!district}
                                        required
                                    >
                                        <option value="">- Chọn Phường/Xã -</option>
                                        {wards.map(ward => (
                                            <option key={ward.code} value={ward.code}>
                                                {ward.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Địa chỉ nhận hàng - span 2 cột */}
                                <div className="space-y-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="addressDetail">
                                        Địa chỉ nhận hàng <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="addressDetail"
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                        value={addressDetail}
                                        onChange={(e) => setAddressDetail(e.target.value)}
                                        placeholder="Số nhà, đường, khu vực..."
                                        required
                                    />
                                </div>

                                {/* Ghi chú - span 2 cột */}
                                <div className="space-y-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="note">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        id="note"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Hướng dẫn giao hàng, thông tin bổ sung..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Phương thức vận chuyển */}
                        <div className="mb-8">
                            <div className="flex items-center border-b border-gray-300 pb-3 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                                <h2 className="text-lg font-semibold">PHƯƠNG THỨC VẬN CHUYỂN</h2>
                            </div>

                            <div className="space-y-3">
                                {/* Phương thức tiêu chuẩn - luôn hiển thị */}
                                <label className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition ${
                                    shippingMethod === 'STANDARD' 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                }`}>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            className="form-radio h-4 w-4 text-red-500 focus:ring-red-500 cursor-pointer"
                                            value="STANDARD"
                                            checked={shippingMethod === 'STANDARD'}
                                            onChange={(e) => setShippingMethod(e.target.value)}
                                        />
                                        <div>
                                            <div className="flex items-center">
                                                <span className="font-medium">Giao hàng tiêu chuẩn</span>
                                                {cityName && (cityName.toLowerCase().includes('hồ chí minh') || cityName.toLowerCase().includes('hcm')) && (
                                                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                                        Miễn phí
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">Giao hàng trong vòng 3-5 ngày làm việc</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-semibold text-gray-800">
                                            {cityName && (cityName.toLowerCase().includes('hồ chí minh') || cityName.toLowerCase().includes('hcm')) 
                                                ? 'Miễn phí' 
                                                : formatPrice(30000)
                                            }
                                        </span>
                                    </div>
                                </label>

                                {/* Grab Express - chỉ hiển thị khi chọn TP.HCM */}
                                {cityName && (cityName.toLowerCase().includes('hồ chí minh') || cityName.toLowerCase().includes('hcm')) && (
                                    <>
                                        <label className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition ${
                                            shippingMethod === 'GRABEXPRESS' 
                                                ? 'border-red-500 bg-red-50' 
                                                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                        }`}>
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="radio"
                                                    name="shippingMethod"
                                                    className="form-radio h-4 w-4 text-red-500 focus:ring-red-500 cursor-pointer"
                                                    value="GRABEXPRESS"
                                                    checked={shippingMethod === 'GRABEXPRESS'}
                                                    onChange={(e) => setShippingMethod(e.target.value)}
                                                />
                                                <div>
                                                    <div className="flex items-center">
                                                        <span className="font-medium">Giao hàng nhanh</span>
                                                        <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                                                            GrabExpress
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">Giao hàng trong vòng 2-4 giờ</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-semibold text-gray-800">{formatPrice(30000)}</span>
                                            </div>
                                        </label>

                                        <label className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition ${
                                            shippingMethod === 'SHOPEEEXPRESS' 
                                                ? 'border-red-500 bg-red-50' 
                                                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                        }`}>
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="radio"
                                                    name="shippingMethod"
                                                    className="form-radio h-4 w-4 text-red-500 focus:ring-red-500 cursor-pointer"
                                                    value="SHOPEEEXPRESS"
                                                    checked={shippingMethod === 'SHOPEEEXPRESS'}
                                                    onChange={(e) => setShippingMethod(e.target.value)}
                                                />
                                                <div>
                                                    <div className="flex items-center">
                                                        <span className="font-medium">Giao hàng trong ngày</span>
                                                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                                            ShopeeExpress
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">Giao hàng trong cùng ngày (đặt trước 12h)</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-semibold text-gray-800">{formatPrice(20000)}</span>
                                            </div>
                                        </label>
                                    </>
                                )}
                                
                                {/* Thông báo */}
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        <div className="text-sm text-blue-700">
                                            {cityName && (cityName.toLowerCase().includes('hồ chí minh') || cityName.toLowerCase().includes('hcm')) ? (
                                                <>
                                                    <span className="font-medium">🎉 Ưu đãi đặc biệt cho TP. Hồ Chí Minh:</span>
                                                    <ul className="mt-1 ml-4 list-disc list-inside space-y-1">
                                                        <li>Giao hàng tiêu chuẩn: <strong>Miễn phí</strong></li>
                                                        <li>Giao hàng nhanh (GrabExpress): <strong>30,000₫</strong></li>
                                                        <li>Giao hàng trong ngày (ShopeeExpress): <strong>20,000₫</strong></li>
                                                    </ul>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="font-medium">Phí vận chuyển: {formatPrice(shippingCost)}</span>
                                                    <br />
                                                    <span className="text-xs">Miễn phí ship tiêu chuẩn cho đơn hàng tại TP. Hồ Chí Minh</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phương thức thanh toán */}
                        <div className="mb-8">
                            <div className="flex items-center border-b border-gray-300 pb-3 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                <h2 className="text-lg font-semibold">PHƯƠNG THỨC THANH TOÁN</h2>
                            </div>

                            <div className="space-y-3">
                                {/* Thanh toán khi nhận hàng */}
                                <label className="block bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            className="form-radio h-4 w-4 text-red-500 focus:ring-red-500 cursor-pointer"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <div className="ml-3">
                                            <div className="font-medium">THANH TOÁN KHI NHẬN HÀNG (COD)</div>
                                            <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</div>
                                        </div>
                                    </div>
                                </label>

                                {/* Thanh toán VNPAY */}
                                <label className="block bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                className="form-radio h-4 w-4 text-red-500 focus:ring-red-500 cursor-pointer"
                                                value="VNPAY"
                                                checked={paymentMethod === 'VNPAY'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className="ml-3">
                                                <div className="font-medium">THANH TOÁN VNPAY</div>
                                                <div className="text-sm text-gray-500">Thanh toán qua cổng VNPAY</div>
                                            </div>
                                        </div>
                                        <img
                                            src="https://cdn0.fahasa.com/skin/frontend/base/default/images/payment_icon/ico_vnpay.svg?q=10908"
                                            alt="VNPAY"
                                            className="h-8 w-auto"
                                        />
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="mb-8">
                            {/* Voucher Selection */}
                            <div className="flex items-center border-b border-gray-300 pb-3 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 012 2v2a2 2 0 01-2 2h-2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4H4a2 2 0 01-2-2V8a2 2 0 012-2h1.17A3 3 0 015 5zm4 1V5a1 1 0 10-2 0v1H5a1 1 0 100 2h2v1a1 1 0 102 0V8h2a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                                <h2 className="text-lg font-semibold">CHỌN MÁ GIẢM GIÁ</h2>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                {suitableVouchers.length > 0 ? (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600 mb-3">
                                            Có {suitableVouchers.length} mã giảm giá phù hợp với đơn hàng của bạn
                                        </p>
                                        <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                                            {suitableVouchers.map((voucher) => (
                                                <div
                                                    key={voucher.id}
                                                    onClick={() => {
                                                        if (selectedVoucher?.id === voucher.id) {
                                                            setSelectedVoucher(null);
                                                            toast.info('Đã bỏ chọn mã giảm giá');
                                                        } else {
                                                            setSelectedVoucher(voucher);
                                                            toast.success(`Đã áp dụng mã ${voucher.code}`);
                                                        }
                                                    }}
                                                    className={`
                                                        border-2 rounded-lg p-4 cursor-pointer transition-all
                                                        ${selectedVoucher?.id === voucher.id 
                                                            ? 'border-red-500 bg-red-50' 
                                                            : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-md'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className={`
                                                                    px-3 py-1 rounded-full text-sm font-semibold
                                                                    ${voucher.discountType === 'PERCENT' 
                                                                        ? 'bg-orange-100 text-orange-600' 
                                                                        : 'bg-blue-100 text-blue-600'
                                                                    }
                                                                `}>
                                                                    {voucher.discountType === 'PERCENT' 
                                                                        ? `Giảm ${voucher.discountValue}%` 
                                                                        : `Giảm ${voucher.discountValue.toLocaleString('vi-VN')}đ`
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                                                    {voucher.code}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 mb-2">
                                                                {voucher.description || 'Không có mô tả'}
                                                            </p>
                                                            <div className="text-xs text-gray-500 space-y-1">
                                                                <p>• Đơn tối thiểu: {voucher.minimumOrderAmount.toLocaleString('vi-VN')}đ</p>
                                                                {voucher.maximumDiscountAmount && (
                                                                    <p>• Giảm tối đa: {voucher.maximumDiscountAmount.toLocaleString('vi-VN')}đ</p>
                                                                )}
                                                                <p>• Hạn sử dụng: {new Date(voucher.endDate).toLocaleDateString('vi-VN')}</p>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className={`
                                                                w-6 h-6 rounded-full border-2 flex items-center justify-center
                                                                ${selectedVoucher?.id === voucher.id 
                                                                    ? 'border-red-500 bg-red-500' 
                                                                    : 'border-gray-300'
                                                                }
                                                            `}>
                                                                {selectedVoucher?.id === voucher.id && (
                                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-gray-500">Không có mã giảm giá phù hợp với đơn hàng này</p>
                                        <p className="text-sm text-gray-400 mt-1">Tổng đơn hàng chưa đạt mức tối thiểu của các mã hiện có</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center border-b border-gray-300 pb-3 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h2 className="text-lg font-semibold">KIỂM TRA LẠI ĐƠN HÀNG</h2>
                            </div>

                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-4 font-medium text-gray-700">Sản phẩm</th>
                                                <th className="p-4 font-medium text-gray-700 text-right">Giá</th>
                                                <th className="p-4 font-medium text-gray-700 text-center">Số lượng</th>
                                                <th className="p-4 font-medium text-gray-700 text-right">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {orderItems.map((item : any) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="p-4">
                                                        {item.product.name}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        {(item.itemTotal / item.quantity).toLocaleString('vi-VN')}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="p-4 font-medium text-right">
                                                        {(item.itemTotal).toLocaleString('vi-VN')}đ
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Order summary */}
                                <div className="p-4 border-t border-gray-200">
                                    <div className="ml-auto w-full md:w-1/2 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Thành tiền:</span>
                                            <span className="font-medium">{formatPrice(totalPrice)}</span>
                                        </div>

                                        {voucherDiscount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Giảm giá từ voucher:</span>
                                                <span className="font-medium">- {formatPrice(voucherDiscount)}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phí vận chuyển:</span>
                                            <span className="font-medium">{formatPrice(shippingCost)}</span>
                                        </div>

                                        <div className="flex justify-between pt-2 border-t border-gray-200 text-lg font-bold">
                                            <span>Tổng tiền:</span>
                                            <span className="text-red-600">{formatPrice(totalPrice + shippingCost - voucherDiscount)}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow transition-colors duration-200 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                                onClick={handleCheckout}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        Xác nhận thanh toán
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>

            </div >
        </>
    );
};

export default Payment;
