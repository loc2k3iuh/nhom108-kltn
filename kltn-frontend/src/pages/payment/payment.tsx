import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { District, fetchDistrictsByProvince, fetchWardsByDistrict, Province, Ward } from '../../services/addressService';

const staticCartData = {
    items: [
        {
            id: 1,
            product_id: 1,
            product_name: 'Áo Polo Nam Classic Premium',
            price: 299250, // Giá sau giảm 25%
            quantity: 2,
            stockQuantity: 45,
            image_url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500'
        },
        {
            id: 2,
            product_id: 2,
            product_name: 'Áo T-shirt Nữ Basic Cotton',
            price: 199500, // Giá sau giảm 30% 
            quantity: 1,
            stockQuantity: 62,
            image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
        },
        {
            id: 3,
            product_id: 3,
            product_name: 'Túi Thể Thao Nike Premium',
            price: 849150, // Giá sau giảm 15%
            quantity: 1,
            stockQuantity: 28,
            image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
        }
    ],
    total_price: 1347900
};

// Dữ liệu tĩnh cho voucher thời trang
const staticVouchersData = [
    {
        id: 1,
        code: 'FASHION15',
        discount_name: 'Giảm giá thời trang 15%',
        discount_amount: 150000,
        min_order_value: 500000,
        start_date: [2024, 1, 1],
        end_date: [2024, 12, 31]
    },
    {
        id: 2,
        code: 'DAVINCI20',
        discount_name: 'Ưu đãi DAVINCI 20%',
        discount_amount: 200000,
        min_order_value: 800000,
        start_date: [2024, 1, 1],
        end_date: [2024, 12, 31]
    }
];

// Dữ liệu tĩnh cho địa chỉ
const staticAddressesData = [
    {
        id: 1,
        userId: 1,
        phoneNumber: '0987654321',
        city: 'TP Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        detailAddress: '123 Đường Nguyễn Huệ',
        street: 'Nguyễn Huệ'
    },
    {
        id: 2,
        userId: 1,
        phoneNumber: '0976543210',
        city: 'Hà Nội',
        district: 'Quận Hoàn Kiếm',
        ward: 'Phường Hàng Bồ',
        detailAddress: '456 Phố Hàng Bạc',
        street: 'Hàng Bạc'
    }
];

// Mock functions để thay thế API calls
const mockCartService = {
    getCartByUserId: async (userId: number) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return staticCartData;
    },
    searchVouchersByCode: async (code: string) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return staticVouchersData.filter(v => v.code === code);
    },
    createPayment: async (paymentData: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=134790000&vnp_Command=pay&vnp_CreateDate=20241006143000&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+thoi+trang&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3000%2Fvnpay-return&vnp_TmnCode=DAVINCI&vnp_TxnRef=12345&vnp_Version=2.1.0&vnp_SecureHash=abc123';
    },
    createOrder: async (orderData: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { id: Math.floor(100000 + Math.random() * 900000) };
    },
    clearCart: async (userId: number) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return true;
    }
};

const mockAddressService = {
    getAddresses: async (userId: number) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return staticAddressesData;
    }
};


interface Address {
    id: number;
    userId: number;
    phoneNumber: string;
    city: string;
    district: string;
    ward: string;
    detailAddress: string;
    street: string;
}

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
// Thêm interface ở đầu file
interface OrderData {
    user_id: number;
    full_name: string;
    email: string;
    phone_number: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    shipping_method: string;
    payment_method: string;
    discount_code: string;
    note: string;
    voucher_ids: number[];
    cart_items: Array<{
        product_id: number;
        quantity: number;
    }>;
}
const Payment: React.FC = () => {
    // Lấy dữ liệu user từ localStorage hoặc sử dụng dữ liệu mặc định
    const getUserData = () => {
        try {
            const userData = localStorage.getItem('vuvisa_user_data');
            if (userData) {
                return JSON.parse(userData);
            }
            // Trả về dữ liệu mặc định cho demo
            return {
                id: 1,
                full_name: 'Khách hàng',
                email: 'khachhang@email.com',
                phone_number: '0123456789',
                address: 'Địa chỉ mặc định',
                city: 'TP Hồ Chí Minh',
                district: 'Quận 1',
                ward: 'Phường Bến Nghé'
            };
        } catch (error) {
            console.error('Error getting user data:', error);
            return {
                id: 1,
                full_name: 'Khách hàng',
                email: 'khachhang@email.com',
                phone_number: '0123456789'
            };
        }
    };
    
    const user = getUserData();

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
    const [paymentMethod, setPaymentMethod] = useState('CASH_ON_DELIVERY'); // Mặc định là thanh toán khi nhận hàng

    // Mã khuyến mãi / quà tặng
    const [voucher, setVoucher] = useState('');

    // Danh sách sản phẩm (ví dụ)
    const [orderItems, setOrderItems] = useState<any>([]);
    const [totalPrice, setTotalPrice] = useState(0);


    const [promoCode, setPromoCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [voucherError, setVoucherError] = useState<string | null>(null);
    const [appliedVouchers, setAppliedVouchers] = useState<any[]>([]);
    const [appliedCodes, setAppliedCodes] = useState<string[]>([]);

    //Address
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [applyingAddressId, setApplyingAddressId] = useState<number | null>(null);

    const navigate = useNavigate();

    const fetchAddresses = async () => {
        if (!user.id) return;

        try {
            setLoadingAddresses(true);
            // Comment: Thay thế API call bằng mock service
            const response = await mockAddressService.getAddresses(user.id);
            if (response) {
                const mappedAddresses: Address[] = response.map((addr: any) => ({
                    id: addr.id,
                    userId: addr.userId,
                    phoneNumber: addr.phoneNumber,
                    city: addr.city,
                    district: addr.district,
                    ward: addr.ward,
                    detailAddress: addr.detailAddress,
                    street: addr.street,
                }));
                setAddresses(mappedAddresses);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    useEffect(() => {
        if (user.id) {
            fetchAddresses();
        }
    }, [user.id]);

    // Apply selected address to form
    const applyAddress = async (address: Address) => {

        try {

            setApplyingAddressId(address.id);

            setPhone(address.phoneNumber || '');
            setAddressDetail(address.detailAddress || '');

            // Tìm province trong danh sách provinces
            const selectedProvince = provinces.find(p => p.name === address.city);
            if (selectedProvince) {
                setCity(selectedProvince.code);
                setCityName(address.city);

                // Fetch districts cho province đã chọn
                const districtsList = await fetchDistrictsByProvince(selectedProvince.code);
                setDistricts(districtsList);

                // Tìm district trong danh sách districts
                const selectedDistrict = districtsList.find((d: District) => d.name === address.district);
                if (selectedDistrict) {
                    setDistrict(selectedDistrict.code);
                    setDistrictName(address.district);

                    // Fetch wards cho district đã chọn
                    const wardsList = await fetchWardsByDistrict(selectedDistrict.code);
                    setWards(wardsList);

                    // Tìm ward trong danh sách wards
                    const selectedWard = wardsList.find((w: Ward) => w.name === address.ward);
                    if (selectedWard) {
                        setWard(selectedWard.code);
                        setWardName(address.ward);
                    }
                }
            }

            // Thông báo thành công
            toast.success("Đã áp dụng địa chỉ thành công!");
        } catch (error) {
            console.error("Lỗi khi áp dụng địa chỉ:", error);
            toast.error("Có lỗi xảy ra khi áp dụng địa chỉ");
        } finally {
            // Reset trạng thái loading và đóng modal
            setApplyingAddressId(null);
            setIsAddressModalOpen(false);
        }
    };

    const handleApplyCode = async () => {
        setIsApplying(true);
        setVoucherError(null);
        try {
            const code = promoCode.trim();
            if (appliedCodes.includes(code)) {
                setVoucherError('Mã này đã được áp dụng');
                setIsApplying(false);
                return;
            }
            // Comment: Thay thế API call bằng mock service
            const result = await mockCartService.searchVouchersByCode(code);
            if (result && result.length > 0) {
                const voucher = result[0];
                const startDate = new Date(voucher.start_date[0], voucher.start_date[1] - 1, voucher.start_date[2]);
                const endDate = new Date(voucher.end_date[0], voucher.end_date[1] - 1, voucher.end_date[2]);
                const now = new Date();

                if (now < startDate || now > endDate) {
                    setVoucherError('Mã này đã hết hạn hoặc chưa đến thời gian sử dụng');
                    setIsApplying(false);
                    return;
                }
                if (totalPrice < voucher.min_order_value) {
                    setVoucherError(`Đơn hàng cần tối thiểu ${voucher.min_order_value.toLocaleString('vi-VN')} đ để áp dụng mã này`);
                    setIsApplying(false);
                    return;
                }
                setAppliedVouchers([...appliedVouchers, voucher]);
                setAppliedCodes([...appliedCodes, code]);
                setPromoCode('');
                setVoucherError(null);
            } else {
                setVoucherError('Mã không hợp lệ hoặc đã hết hạn');
            }
        } catch (err) {
            setVoucherError('Có lỗi khi kiểm tra mã');
        } finally {
            setIsApplying(false);
        }
    };

    const handleRemoveVoucher = (code: string) => {
        setAppliedVouchers(appliedVouchers.filter(v => v.code !== code));
        setAppliedCodes(appliedCodes.filter(c => c !== code));
    };

    const totalDiscount = appliedVouchers.reduce(
        (sum, v) => sum + (v.discount_amount || 0),
        0
    );

    const fetchProvinces = async () => {
        try {
            const response = await fetch('https://provinces.open-api.vn/api/p/');
            const data = await response.json();
            setProvinces(data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
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

    const shippingCost = 0;

    useEffect(() => {
        const fetchCart = async () => {
            // Comment: Thay thế API call bằng mock service
            const data = await mockCartService.getCartByUserId(user.id);
            setOrderItems(data.items);
            setTotalPrice(data.total_price);
        };
        fetchCart();
    }, []);

    useEffect(() => {
        setFullName(user.full_name || '');
        setEmail(user.email || '');
        setPhone(user.phone_number || '');
        setCity(user.city || '');
        setDistrict(user.district || '');
        setWard(user.ward || '');
        setAddressDetail(user.address || '');
        fetchProvinces();
    }, []);

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
        const errors = validateOrderData();
        if (errors) {
            // Show first error message
            const firstError = Object.values(errors)[0];
            alert(firstError);
            return;
        }
        setIsLoading(true); // Bắt đầu loading
        try {
            // Chuẩn bị dữ liệu đơn hàng
            const orderData: OrderData = {
                user_id: user.id,
                full_name: fullName,
                email: email,
                phone_number: phone,
                address: addressDetail,
                city: cityName,
                district: districtName,
                ward: wardName,
                shipping_method: shippingMethod,
                payment_method: paymentMethod,
                discount_code: voucher || '', // Add discount_code property
                note: note,
                voucher_ids: appliedVouchers.map((voucher) => voucher.id),
                cart_items: orderItems.map((item: any) => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                }))
            };

            console.log('Order Data:', orderData);




            if (paymentMethod === 'VN_PAY') {

                // Lưu orderData tạm vào localStorage
                localStorage.setItem('pendingOrder', JSON.stringify(orderData));

                // Gọi API tạo paymentUrl VNPAY
                const paymentResponse = await mockCartService.createPayment({
                    // order_id: orderResponse.id,
                    amount: totalPrice + shippingCost - totalDiscount
                });

                // Chuyển hướng đến trang thanh toán VNPAY
                // Kiểm tra xem paymentResponse có chứa payment_url không
                // Nếu có, chuyển hướng đến payment_url
                // Nếu không, hiển thị thông báo lỗi

                if (paymentResponse) {
                    window.location.href = paymentResponse;
                    return;
                } else {
                    alert('Không tạo được liên kết thanh toán VNPAY');
                }
            }
            if (paymentMethod === 'CASH_ON_DELIVERY') {
                // Tạo đơn hàng
                const orderResponse = await mockCartService.createOrder(orderData);

                // Xóa giỏ hàng
                await mockCartService.clearCart(user.id);

                const orderSummary = {
                    ...orderData,
                    orderNumber: orderResponse.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
                    totalPrice: totalPrice,
                    totalDiscount: totalDiscount,
                    shippingCost: shippingCost,
                    orderDate: new Date(),
                };

                navigate('/order-success', {
                    state: {
                        orderDetails: orderSummary,
                        orderNumber: orderSummary.orderNumber
                    }
                });

                return;
            }
        } catch (error: any) {
            toast.error(error.message || 'Có lỗi xảy ra khi đặt hàng');
            console.error('Checkout error:', error);
        } finally {
            setIsLoading(false); // Kết thúc loading
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

                                <button
                                    type="button"
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded-md text-sm font-medium flex items-center transition-colors duration-200 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Chọn địa chỉ đã lưu
                                </button>

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

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="shippingMethod"
                                        className="form-radio h-4 w-4 text-red-500 focus:ring-red-500 cursor-pointer"
                                        value="STANDARD"
                                        checked={shippingMethod === 'STANDARD'}
                                        onChange={(e) => setShippingMethod(e.target.value)}
                                    />
                                    <div>
                                        <span className="font-medium">Tiêu chuẩn</span>
                                        <p className="text-sm text-gray-500 mt-1">Giao hàng trong vòng 3-5 ngày làm việc</p>
                                    </div>
                                </label>
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
                                            value="CASH_ON_DELIVERY"
                                            checked={paymentMethod === 'CASH_ON_DELIVERY'}
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
                                                value="VN_PAY"
                                                checked={paymentMethod === 'VN_PAY'}
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
                            {/* Mã khuyến mãi / quà tặng */}
                            <div className="flex items-center border-b border-gray-300 pb-3 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 012 2v2a2 2 0 01-2 2h-2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4H4a2 2 0 01-2-2V8a2 2 0 012-2h1.17A3 3 0 015 5zm4 1V5a1 1 0 10-2 0v1H5a1 1 0 100 2h2v1a1 1 0 102 0V8h2a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                                <h2 className="text-lg font-semibold">MÃ KHUYẾN MÃI/MÃ QUÀ TẶNG</h2>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">

                                <div className="flex items-center mb-2">
                                    <h3 className="text-gray-700 font-medium text-sm">Mã KM/Quà tặng</h3>
                                </div>

                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Nhập mã khuyến mãi/Quà tặng"
                                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                    />
                                    <button
                                        onClick={handleApplyCode}
                                        disabled={isApplying || !promoCode.trim()}
                                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition duration-200 disabled:bg-red-300 whitespace-nowrap cursor-pointer"
                                    >
                                        {isApplying ? 'Đang áp dụng...' : 'Áp dụng'}
                                    </button>
                                </div>

                                {/* Validation error */}
                                {voucherError && (
                                    <div className="text-red-500 text-sm mt-2 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {voucherError}
                                    </div>
                                )}

                                {/* Applied vouchers */}
                                {appliedVouchers.length > 0 && (
                                    <div className="mt-4 space-y-3">
                                        {appliedVouchers.map(voucher => (
                                            <div
                                                key={voucher.code}
                                                className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm flex justify-between items-center"
                                            >
                                                <div>
                                                    <div className="font-medium text-gray-800">{voucher.code}</div>
                                                    <div className="text-green-700 mt-1">
                                                        Giảm: {voucher.discount_amount ? `${voucher.discount_amount.toLocaleString('vi-VN')}đ` : voucher.discount_percent ? `${voucher.discount_percent}%` : ''}
                                                    </div>
                                                </div>
                                                <button
                                                    className="text-red-500 hover:text-red-700 p-1 transition-colors"
                                                    onClick={() => handleRemoveVoucher(voucher.code)}
                                                    aria-label="Xóa voucher"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-gray-500 text-sm flex items-center">
                                        Có thể áp dụng đồng thời nhiều mã
                                        <span className="ml-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                    </p>
                                </div>

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
                                            {orderItems.map((item: { id: number; product_name: string; price: number; quantity: number }) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="p-4">
                                                        {item.product_name}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        {item.price.toLocaleString('vi-VN')} đ
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="p-4 font-medium text-right">
                                                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
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

                                        {totalDiscount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Giảm giá:</span>
                                                <span className="font-medium">- {formatPrice(totalDiscount)}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phí vận chuyển:</span>
                                            <span className="font-medium">{formatPrice(shippingCost)}</span>
                                        </div>

                                        <div className="flex justify-between pt-2 border-t border-gray-200 text-lg font-bold">
                                            <span>Tổng tiền:</span>
                                            <span className="text-red-600">{formatPrice(totalPrice + shippingCost - totalDiscount)}</span>
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

                {/* Modal for choosing saved addresses */}
                {isAddressModalOpen && (
                    <div className="fixed inset-0 bg-black/5 bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                            <div className="flex justify-between items-center border-b p-4">
                                <h3 className="text-lg font-semibold text-gray-900">Chọn địa chỉ đã lưu</h3>
                                <button
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                    disabled={applyingAddressId !== null}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="overflow-y-auto p-4 max-h-[60vh]">
                                {loadingAddresses ? (
                                    <div className="flex justify-center py-8">
                                        <svg className="animate-spin h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                ) : addresses.length === 0 ? (
                                    <div className="text-center py-8">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <p className="mt-2 text-gray-600">Bạn chưa có địa chỉ nào được lưu</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {addresses.map((address) => (
                                            <div
                                                key={address.id}
                                                className={`border rounded-lg p-4 transition-colors hover:bg-gray-50 border-gray-200 ${applyingAddressId === address.id ? 'bg-blue-50 border-blue-300' : ''
                                                    } ${applyingAddressId !== null && applyingAddressId !== address.id ? 'opacity-50' : ''}`}
                                            >
                                                <div className="flex justify-between">
                                                    <div className="font-medium">{address.phoneNumber}</div>
                                                </div>
                                                <div className="text-gray-500 text-sm mt-2">
                                                    {address.detailAddress}, {address.ward}, {address.district}, {address.city}
                                                </div>
                                                <button
                                                    className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium flex items-center cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        applyAddress(address);
                                                    }}
                                                    disabled={applyingAddressId !== null}
                                                >
                                                    {applyingAddressId === address.id ? (
                                                        <>
                                                            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Đang áp dụng...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Sử dụng địa chỉ này
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-t p-4 bg-gray-50 flex justify-end">
                                <button
                                    onClick={() => setIsAddressModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
                                    disabled={applyingAddressId !== null}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div >
        </>
    );
};

export default Payment;
