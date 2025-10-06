import React, { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { Minus, Plus, ShoppingCart, ArrowRight, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

interface Item {
    id: number;
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
    quantity_in_stock: number;
    image_url: string;
}

interface Cart {
    items: Item[];
    total_price: number;
}

// Dữ liệu tĩnh cho giỏ hàng thời trang
const staticCartData: Cart = {
    items: [
        {
            id: 1,
            product_id: 1,
            product_name: 'Áo Polo Nam Classic Premium',
            price: 399000,
            quantity: 2,
            quantity_in_stock: 45,
            image_url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500'
        },
        {
            id: 2,
            product_id: 2,
            product_name: 'Áo T-shirt Nữ Basic Cotton',
            price: 285000,
            quantity: 1,
            quantity_in_stock: 62,
            image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
        },
        {
            id: 3,
            product_id: 3,
            product_name: 'Túi Thể Thao Nike Premium',
            price: 999000,
            quantity: 1,
            quantity_in_stock: 28,
            image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
        },
        {
            id: 4,
            product_id: 4,
            product_name: 'Giày Chạy Bộ Adidas UltraBoost',
            price: 2375000,
            quantity: 1,
            quantity_in_stock: 5,
            image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
        }
    ],
    total_price: 4058000
};

// Mock functions để thay thế cartService
const mockCartService = {
    getCartByUserId: async (userId: number): Promise<Cart> => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
        return staticCartData;
    },
    updateCartItem: async (userId: number, productId: number, quantity: number): Promise<Cart> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const updatedItems = staticCartData.items.map(item => 
            item.product_id === productId ? {...item, quantity} : item
        );
        const updatedTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return {
            items: updatedItems,
            total_price: updatedTotal
        };
    },
    removeItemFromCart: async (userId: number, productId: number): Promise<Cart> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const updatedItems = staticCartData.items.filter(item => item.product_id !== productId);
        const updatedTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return {
            items: updatedItems,
            total_price: updatedTotal
        };
    }
};

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [cartItems, setCartItems] = useState<Item[]>();
    const [shippingFee] = useState<number>(0);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchCart = async () => {
            setIsLoading(true);
            try {
                // Comment: Thay thế API call bằng mock service
                const data = await mockCartService.getCartByUserId(user.id);
                setCartItems(data.items);
                setTotalPrice(data.total_price);
            } catch (error) {
                console.error("Error fetching cart data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCart();
    }, []);

    const handleChangeQuantity = async (productId: number, quantity: number, stockQuantity: number) => {
        if (quantity < 1) return;
        if (quantity > stockQuantity) {
            toast.error(`Số lượng sản phẩm không đủ trong kho!`);
            return;
        }
        setIsLoading(true);
        try {
            // Comment: Thay thế API call bằng mock service
            const updatedCart = await mockCartService.updateCartItem(user.id, productId, quantity);
            setCartItems(updatedCart.items);
            setTotalPrice(updatedCart.total_price);
        } catch (error) {
            console.error("Failed to update quantity:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm xử lý chọn/bỏ chọn tất cả sản phẩm
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems ? cartItems.map((item) => item.id) : []);
        }
        setSelectAll(!selectAll);
    };

    // Hàm xử lý chọn/bỏ chọn từng sản phẩm
    const handleSelectItem = (itemId: number) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    // Hàm xóa 1 sản phẩm
    const handleRemoveItem = async (itemId: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
            // Comment: Thay thế API call bằng mock service
            const updatedCart = await mockCartService.removeItemFromCart(user.id, itemId);
            console.log("Updated cart:", updatedCart);

            setCartItems(updatedCart.items);
            setTotalPrice(updatedCart.total_price);
        }
    };

    // Tính tổng tiền các sản phẩm đã chọn
    const calculateSelectedTotal = () => {
        if (!cartItems) return 0;

        return cartItems
            .filter(item => selectedItems.includes(item.id))
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const selectedTotal = calculateSelectedTotal();

    // if (!cartItems || cartItems.length === 0) {
    //     return (
    //         <div className="container lg:max-w-7xl mx-auto p-4 min-h-[50vh]">
    //             <div className="bg-white rounded-xl p-8 text-center">
    //                 <div className="flex justify-center mb-4">
    //                     <ShoppingCart size={64} className="text-gray-300" />
    //                 </div>
    //                 <h2 className="text-xl font-semibold mb-2">Giỏ hàng của bạn đang trống</h2>
    //                 <p className="text-gray-500 mb-6">Khám phá những sản phẩm hấp dẫn và thêm vào giỏ hàng ngay!</p>
    //                 <Link to="/" className="inline-block bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition-colors">
    //                     Tiếp tục mua sắm
    //                 </Link>
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
            <div className="container mx-auto p-4 lg:max-w-7xl">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
                    GIỎ HÀNG ({cartItems?.length || 0} sản phẩm)
                </h2>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Giỏ hàng */}
                    <div className="w-full lg:w-3/4 p-2 md:p-4">
                        <div className="p-2 md:p-3 bg-white items-center rounded-xl mb-3 hidden md:grid md:grid-cols-10">
                            <div className="inline-flex items-center space-x-2 col-span-7">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                                <span className="text-sm">Chọn tất cả ({cartItems?.length} sản phẩm)</span>
                            </div>
                            <span className="text-sm col-span-1 text-center">Số lượng</span>
                            <span className="text-sm col-span-1 text-center">Thành tiền</span>
                            <div className="col-span-1"></div>
                        </div>

                        {/* Mobile: Chọn tất cả (hiển thị trên mobile) */}
                        <div className="p-2 bg-white items-center rounded-xl mb-3 flex md:hidden justify-between">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                                <span className="text-sm">Chọn tất cả ({cartItems?.length})</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {cartItems?.map((item) => (
                                <div key={item.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-50 hover:shadow-md transition duration-200">
                                    {/* Desktop layout */}
                                    <div className="hidden md:grid md:grid-cols-10 md:gap-4 md:items-center">
                                        <div className="col-span-1 justify-self-start">
                                            <input
                                                type="checkbox"
                                                className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-4 col-span-6">
                                            <div className="relative">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.product_name}
                                                    className="w-20 h-28 object-cover rounded-lg shadow-sm"
                                                />
                                                {item.quantity_in_stock && (
                                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-br-lg rounded-tl-lg">
                                                        Còn {item.quantity_in_stock}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-800 mb-2 hover:text-red-500 transition duration-200">
                                                    {item.product_name}
                                                </h3>
                                                <div className="space-x-3">
                                                    <span className="text-red-500 font-bold text-lg">
                                                        {item.price.toLocaleString()} ₫
                                                    </span>
                                                    {item.price !== item.price && (
                                                        <span className="text-gray-400 line-through text-sm">
                                                            {item.price.toLocaleString()} ₫
                                                        </span>
                                                    )}
                                                </div>
                                                {item.quantity_in_stock <= 5 && (
                                                    <p className="text-sm text-amber-600 mt-1 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        Sắp hết hàng
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-1 col-span-1 justify-self-center">
                                            <button
                                                onClick={() => handleChangeQuantity(item.product_id, item.quantity - 1, item.quantity_in_stock)}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                                                disabled={item.quantity <= 1}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => handleChangeQuantity(item.product_id, item.quantity + 1, item.quantity_in_stock)}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 cursor-pointer"
                                                disabled={item.quantity >= item.quantity_in_stock}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>

                                        <p className="col-span-1 text-red-500 font-bold text-lg text-center">
                                            {(item.price * item.quantity).toLocaleString()} ₫
                                        </p>

                                        <button
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors duration-200 col-span-1 justify-self-center"
                                            onClick={() => handleRemoveItem(item.product_id)}
                                            title="Xóa sản phẩm"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                            ))}

                            {cartItems?.length === 0 && (
                                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                                    <div className="flex justify-center mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Giỏ hàng của bạn đang trống</h3>
                                    <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
                                    <a href="/" className="inline-flex items-center bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        Tiếp tục mua sắm
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Phần thanh toán */}
                    <div className="w-full lg:w-1/4 sticky top-4">
                        <div className="bg-white p-3 md:p-4 rounded-xl">
                            <h3 className="font-medium mb-3">Thông tin thanh toán</h3>
                            <div className="flex justify-between mb-3">
                                <span className="text-sm md:text-base">Thành tiền</span>
                                <span className="text-sm md:text-base">{totalPrice?.toLocaleString()} ₫</span>
                            </div>
                            <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
                                <span className="text-sm md:text-base">Phí vận chuyển (Tiêu chuẩn)</span>
                                <span className="text-sm md:text-base">{shippingFee.toLocaleString()} ₫</span>
                            </div>
                            <div className="flex justify-between font-semibold mb-4">
                                <span>Tổng cộng (VAT)</span>
                                <span className="text-red-500">{(totalPrice + shippingFee).toLocaleString()} ₫</span>
                            </div>
                            <button
                                className={`bg-red-500 text-white w-full py-2 md:py-3 rounded font-medium hover:bg-red-600 transition-colors cursor-pointer ${(!cartItems || cartItems.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!cartItems || cartItems.length === 0}
                                onClick={e => {
                                    if (!cartItems || cartItems.length === 0) {
                                        e.preventDefault();
                                        alert('Giỏ hàng của bạn đang trống!');
                                    } else {
                                        navigate('/payment');
                                    }
                                }}
                            >
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;