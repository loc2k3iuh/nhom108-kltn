import React, { useEffect, useState, useMemo } from "react";
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import Swal from 'sweetalert2';

import { getCartByUserId, updateCartItem, removeCartItem, clearCart } from "@/services/cartService";
import { useAuthStore } from "@/stores/useAuthStore";
import { Cart, CartItem } from "@/types/cart";

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { authUser } = useAuthStore();
    const [cart, setCart] = useState<Cart | null>(null);
    const [shippingFee] = useState<number>(30000); // Giả sử phí ship cố định
    const [selectAll, setSelectAll] = useState(true);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<number | null>(null); // ID của item đang được cập nhật

    const fetchCart = async () => {
        if (!authUser) return; // Should be handled by the other effect
        setIsLoading(true);
        try {
            const data = await getCartByUserId(authUser.id);
            setCart(data);
            setSelectedItems(data.cartItems.map(item => item.id));
        } catch (error) {
            console.error("Error fetching cart data:", error);
            toast.error("Không thể tải giỏ hàng của bạn.");
            setCart(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Giỏ hàng của bạn | DAVINCI";
        if (authUser) {
            fetchCart();
        } else {
            // Load cart from localStorage for guest users
            setIsLoading(true);
            try {
                const localCartData = localStorage.getItem('cart');
                if (localCartData) {
                    const localCartItems: any[] = JSON.parse(localCartData);

                    const cartItems: CartItem[] = localCartItems.map((item) => ({
                        id: item.productVariantId, // Use variant ID as a unique key
                        product: {
                            id: item.productId,
                            name: item.name,
                            primaryImageUrl: item.imageUrl,
                            description: '', basePrice: item.price, totalStock: item.stockQuantity, averageRating: 0, reviewCount: 0, orderCount: 0, favoriteCount: 0, status: 'ACTIVE', imageUrls: [], videoUrls: [], availableMaterials: [],
                            brand: { id: 0, name: item.brandName, description: '' },
                            category: { id: 0, name: '', description: '' },
                            rootCategory: { id: 0, name: '', description: '' },
                            currentDiscountPercent: 0, variants: [],
                        },
                        productVariant: {
                            id: item.productVariantId, price: item.price, stockQuantity: item.stockQuantity, imageUrl: item.imageUrl, sku: item.sku, material: '',
                            size: { id: 0, name: item.size },
                            color: { id: 0, name: item.color },
                        },
                        quantity: item.quantity,
                        itemTotal: item.price * item.quantity,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    }));

                    const totalAmount = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
                    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

                    setCart({
                        id: 0, user: null, cartItems, totalAmount, totalItems,
                        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
                    });
                    setSelectedItems(cartItems.map(item => item.id));
                } else {
                    setCart(null);
                }
            } catch (error) {
                console.error("Error loading local cart:", error);
                toast.error("Không thể tải giỏ hàng tạm thời.");
                setCart(null);
            } finally {
                setIsLoading(false);
            }
        }
    }, [authUser]);

    const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
        if (newQuantity < 1) return;
        if (newQuantity > item.productVariant.stockQuantity) {
            toast.error(`Chỉ còn ${item.productVariant.stockQuantity} sản phẩm trong kho!`);
            return;
        }

        setIsUpdating(item.id);

        if (!authUser) {
            try {
                const localCart: any[] = JSON.parse(localStorage.getItem("cart") || "[]");
                const itemIndex = localCart.findIndex(i => i.productVariantId === item.id);
                if (itemIndex > -1) {
                    localCart[itemIndex].quantity = newQuantity;
                    localStorage.setItem("cart", JSON.stringify(localCart));

                    setCart(prevCart => {
                        if (!prevCart) return null;
                        const updatedItems = prevCart.cartItems.map(i =>
                            i.id === item.id ? { ...i, quantity: newQuantity, itemTotal: i.productVariant.price * newQuantity } : i
                        );
                        const newTotalAmount = updatedItems.reduce((sum, current) => sum + current.itemTotal, 0);
                        const newTotalItems = updatedItems.reduce((sum, current) => sum + current.quantity, 0);
                        return { ...prevCart, cartItems: updatedItems, totalAmount: newTotalAmount, totalItems: newTotalItems };
                    });
                }
            } catch (error) {
                console.error("Failed to update local cart quantity:", error);
                toast.error("Cập nhật số lượng thất bại.");
            } finally {
                setIsUpdating(null);
            }
            return;
        }

        try {
            const updatedItem = await updateCartItem(item.id, { quantity: newQuantity });
            setCart(prevCart => {
                if (!prevCart) return null;
                const updatedItems = prevCart.cartItems.map(i => i.id === item.id ? { ...updatedItem, product: i.product, productVariant: i.productVariant } : i);
                const newTotalAmount = updatedItems.reduce((sum, current) => sum + current.itemTotal, 0);
                return { ...prevCart, cartItems: updatedItems, totalAmount: newTotalAmount };
            });
            toast.success("Đã cập nhật số lượng sản phẩm");
        } catch (error) {
            console.error("Failed to update quantity:", error);
            toast.error("Cập nhật số lượng thất bại.");
            // Re-fetch to get the correct state from server
            fetchCart();
        } finally {
            setIsUpdating(null);
        }
    };

    const handleRemoveItem = async (cartItemId: number) => {
        const result = await Swal.fire({
            title: 'Xóa sản phẩm?',
            text: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#C92127',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            if (!authUser) {
                try {
                    let localCart: any[] = JSON.parse(localStorage.getItem("cart") || "[]");
                    localCart = localCart.filter(i => i.productVariantId !== cartItemId);
                    localStorage.setItem("cart", JSON.stringify(localCart));

                    const updatedItems = cart!.cartItems.filter(i => i.id !== cartItemId);
                    if (updatedItems.length === 0) {
                        setCart(null);
                    } else {
                        const newTotalAmount = updatedItems.reduce((sum, current) => sum + current.itemTotal, 0);
                        const newTotalItems = updatedItems.reduce((sum, current) => sum + current.quantity, 0);
                        setCart(prev => ({ ...prev!, cartItems: updatedItems, totalAmount: newTotalAmount, totalItems: newTotalItems }));
                    }
                    setSelectedItems(prev => prev.filter(id => id !== cartItemId));
                    toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
                } catch (error) {
                    console.error("Failed to remove item from local cart:", error);
                    toast.error("Xóa sản phẩm thất bại.");
                } finally {
                    setIsLoading(false);
                }
                return;
            }

            try {
                await removeCartItem(cartItemId);
                await fetchCart();
                toast.success("Đã xóa sản phẩm khỏi giỏ hàng.");
            } catch (error) {
                console.error("Failed to remove item:", error);
                toast.error("Xóa sản phẩm thất bại.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleClearCart = async () => {
        if (!cart || cart.cartItems.length === 0) return;

        const result = await Swal.fire({
            title: 'Xóa tất cả sản phẩm?',
            text: "Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#C92127',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Xóa tất cả',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            setIsLoading(true);
            if (!authUser) {
                try {
                    localStorage.removeItem("cart");
                    setCart(null);
                    setSelectedItems([]);
                    toast.success("Đã xóa toàn bộ giỏ hàng.");
                } catch (error) {
                    toast.error("Xóa giỏ hàng thất bại.");
                } finally {
                    setIsLoading(false);
                }
                return;
            }

            try {
                await clearCart(authUser.id);
                await fetchCart();
                toast.success("Đã xóa toàn bộ giỏ hàng.");
            } catch (error) {
                console.error("Failed to clear cart:", error);
                toast.error("Xóa giỏ hàng thất bại.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSelectAll = () => {
        if (!cart) return;
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        if (newSelectAll) {
            setSelectedItems(cart.cartItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (itemId: number) => {
        const newSelectedItems = selectedItems.includes(itemId)
            ? selectedItems.filter(id => id !== itemId)
            : [...selectedItems, itemId];
        setSelectedItems(newSelectedItems);
        setSelectAll(newSelectedItems.length === cart?.cartItems.length);
    };

    const selectedTotal = useMemo(() => {
        if (!cart) return 0;
        return cart.cartItems
            .filter(item => selectedItems.includes(item.id))
            .reduce((sum, item) => sum + item.itemTotal, 0);
    }, [cart, selectedItems]);

    const handleCheckout = () => {
        if (selectedItems.length === 0) return;
        if (authUser) {
            // Store selected items to process in payment page
            const itemsToCheckout = cart?.cartItems.filter(item => selectedItems.includes(item.id));
            localStorage.setItem('itemsToCheckout', JSON.stringify(itemsToCheckout));
            navigate('/payment');
        } else {
            toast.info("Vui lòng đăng nhập để tiếp tục thanh toán.", {
                action: {
                    label: 'Đăng nhập',
                    onClick: () => navigate('/signin'),
                },
            });
            navigate('/signin');
        }
    };

    if (isLoading && !isUpdating) {
        return (
            <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!cart || cart.cartItems.length === 0) {
        return (
            <div className="container lg:max-w-7xl mx-auto p-4 min-h-[60vh] flex items-center justify-center">
                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                    <div className="flex justify-center mb-6">
                        <ShoppingCart size={64} className="text-gray-300" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Giỏ hàng của bạn đang trống</h2>
                    <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
                    <Link to="/" className="inline-flex items-center bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" richColors />
            <div className="container mx-auto p-4 lg:max-w-7xl">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
                    GIỎ HÀNG ({cart.totalItems || 0} sản phẩm)
                </h2>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Giỏ hàng */}
                    <div className="w-full lg:w-3/4">
                        <div className="p-3 bg-white items-center rounded-xl mb-3 hidden md:flex justify-between">
                            <div className="inline-flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                                <span className="text-sm font-medium">Chọn tất cả ({cart.cartItems.length} sản phẩm)</span>
                            </div>
                            <button onClick={handleClearCart} className="flex items-center text-sm text-gray-500 hover:text-red-500 transition-colors">
                                <Trash2 size={16} className="mr-1" />
                                Xóa tất cả
                            </button>
                        </div>

                        <div className="space-y-4">
                            {cart.cartItems.map((item) => {
                                const originalPrice = item.productVariant.price;
                                const discountedPrice = item.itemTotal / item.quantity;
                                const hasDiscount = discountedPrice < originalPrice;
                                const discountPercentage = hasDiscount ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;

                                return (
                                <div key={item.id} className={`p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition duration-200 ${isUpdating === item.id ? 'opacity-50' : ''}`}>
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-1 flex justify-center">
                                            <input
                                                type="checkbox"
                                                className="h-5 w-5 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                            />
                                        </div>

                                        <div className="col-span-11 md:col-span-6 flex items-center space-x-4">
                                            <Link to={`/product/${item.product.id}`}>
                                                <img
                                                    src={item.productVariant.imageUrl || item.product.primaryImageUrl}
                                                    alt={item.product.name}
                                                    className="w-20 h-28 object-cover rounded-lg shadow-sm"
                                                />
                                            </Link>
                                            <div className="flex-1">
                                                <Link to={`/product/${item.product.id}`} className="font-medium text-gray-800 mb-1 hover:text-red-500 transition duration-200 line-clamp-2">
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-sm text-gray-500">{item.productVariant.color.name} / {item.productVariant.size.name}</p>
                                                
                                                {hasDiscount ? (
                                                    <div className="mt-1">
                                                        <span className="text-red-500 font-bold text-lg">
                                                            {discountedPrice.toLocaleString()} ₫
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-400 line-through text-sm">
                                                                {originalPrice.toLocaleString()} ₫
                                                            </span>
                                                            <span className="text-xs font-semibold text-white bg-red-500 px-1.5 py-0.5 rounded-md">
                                                                -{discountPercentage}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-800 font-bold text-lg mt-1">
                                                        {originalPrice.toLocaleString()} ₫
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-span-6 md:col-span-3 flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={item.quantity <= 1 || !!isUpdating}
                                            >
                                                <Minus size={16} className="text-gray-600" />
                                            </button>
                                            <div className="w-10 text-center font-medium relative">
                                                {isUpdating === item.id ? <Loader2 className="animate-spin mx-auto" /> : item.quantity}
                                            </div>
                                            <button
                                                onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={item.quantity >= item.productVariant.stockQuantity || !!isUpdating}
                                            >
                                                <Plus size={16} className="text-gray-600" />
                                            </button>
                                        </div>

                                        <p className="col-span-4 md:col-span-1 text-red-500 font-bold text-lg text-right flex items-center justify-end whitespace-nowrap">
                                            {item.itemTotal.toLocaleString()} ₫
                                        </p>

                                        <div className="col-span-2 md:col-span-1 flex justify-center">
                                            <button
                                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors duration-200"
                                                onClick={() => handleRemoveItem(item.id)}
                                                title="Xóa sản phẩm"
                                                disabled={!!isUpdating}
                                            >
                                                <Trash2 size={16} className="text-gray-500  hover:text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )} )}
                        </div>
                    </div>

                    {/* Phần thanh toán */}
                    <div className="w-full lg:w-1/4 lg:sticky top-6 h-fit">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-medium mb-4 text-lg">Thông tin thanh toán</h3>
                            <div className="flex justify-between mb-3 text-gray-600">
                                <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                                <span>{selectedTotal.toLocaleString()} ₫</span>
                            </div>
                            <div className="flex justify-between mb-3 pb-3 border-b border-gray-200 text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span>{shippingFee.toLocaleString()} ₫</span>
                            </div>
                            <div className="flex justify-between font-semibold mb-4 text-lg">
                                <span>Tổng cộng</span>
                                <span className="text-red-500">{(selectedTotal + shippingFee).toLocaleString()} ₫</span>
                            </div>
                            <button
                                className={`bg-red-500 text-white w-full py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={selectedItems.length === 0}
                                onClick={handleCheckout}
                            >
                                Mua hàng ({selectedItems.length})
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;
