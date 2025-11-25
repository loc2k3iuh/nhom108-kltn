import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Truck,
  CreditCard,
  Plus,
  Trash2,
  Search,
  Loader2,
  ShoppingCart,
  X,
} from "lucide-react";
import { orderService } from "@/services/orderService";
import { getAllUsers } from "@/services/useUserService";
import { filterProducts } from "@/services/productService";
import { getProductVariantsByProductId } from "@/services/productVariantService";
import { CreateOrderRequest } from "@/types/order";
import { Product } from "@/types/product";
import { UserResponse } from "@/types/responses/authResponse";
import { toast } from "sonner";
import { 
  fetchProvinces, 
  fetchDistrictsByProvince, 
  fetchWardsByDistrict,
  Province,
  District,
  Ward
} from "@/services/addressService";

interface OrderItem {
  productVariantId: number;
  productId: number;
  productName: string;
  variantName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  stockQuantity: number;
}

interface ShippingMethod {
  value: string;
  label: string;
  fee: number;
  description?: string;
}

// Shipping methods for Ho Chi Minh City
const hcmShippingMethods: ShippingMethod[] = [
  { value: "STANDARD", label: "Giao hàng tiêu chuẩn", fee: 0, description: "Miễn phí giao hàng trong TP.HCM" },
  { value: "GRAB_EXPRESS", label: "Giao hàng nhanh - GrabExpress", fee: 30000, description: "Giao hàng trong vòng 2-4 giờ" },
  { value: "SHOPEE_EXPRESS", label: "Giao hàng trong ngày - ShopeeExpress", fee: 20000, description: "Giao hàng trong cùng ngày (đặt trước 12h)" },
];

// Shipping methods for other provinces
const otherProvincesShippingMethods: ShippingMethod[] = [
  { value: "STANDARD", label: "Giao hàng tiêu chuẩn", fee: 30000, description: "Phí vận chuyển cố định" },
];

const paymentMethods = [
  { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
];

export default function CreateOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // User selection
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Shipping info
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  
  // Address data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [productPage, setProductPage] = useState(0);
  const [productTotalPages, setProductTotalPages] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Order details
  const [availableShippingMethods, setAvailableShippingMethods] = useState<ShippingMethod[]>(otherProvincesShippingMethods);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(otherProvincesShippingMethods[0].value);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0].value);
  const [discountCode, setDiscountCode] = useState("");
  const [note, setNote] = useState("");

  // Load users and products
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load users and provinces
      const [usersData, provincesData] = await Promise.all([
        getAllUsers({ 
          searchTerm: "", 
          stateParam: "true", 
          currentPage: 0, 
          itemsPerPage: 1000 
        }),
        fetchProvinces()
      ]);
      
      console.log("Users data:", usersData);
      setUsers(usersData.users || []);
      setProvinces(provincesData || []);
    } catch (error: any) {
      console.error("Lỗi khi tải dữ liệu:", error);
      console.error("Error details:", error.response?.data || error.message);
      toast.error("Không thể tải dữ liệu: " + (error.response?.data?.message || error.message || "Lỗi không xác định"));
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill shipping info when user is selected
  useEffect(() => {
    if (selectedUser) {
      setReceiverName(selectedUser.full_name || "");
      setReceiverPhone(selectedUser.phone_number || "");
      setAddress(selectedUser.address || "");
    }
  }, [selectedUser]);

  // Load districts when province changes
  const handleProvinceChange = async (provinceCode: string) => {
    setCity(provinceCode);
    setDistrict("");
    setWard("");
    setDistricts([]);
    setWards([]);
    
    if (provinceCode) {
      try {
        const districtsData = await fetchDistrictsByProvince(provinceCode);
        setDistricts(districtsData || []);
        
        // Check if selected province is Ho Chi Minh City (code: 79)
        const isHCM = provinceCode === "79";
        const newShippingMethods = isHCM ? hcmShippingMethods : otherProvincesShippingMethods;
        setAvailableShippingMethods(newShippingMethods);
        setSelectedShippingMethod(newShippingMethods[0].value);
      } catch (error) {
        console.error("Error loading districts:", error);
        toast.error("Không thể tải danh sách quận/huyện");
      }
    }
  };

  // Load wards when district changes
  const handleDistrictChange = async (districtCode: string) => {
    setDistrict(districtCode);
    setWard("");
    setWards([]);
    
    if (districtCode) {
      try {
        const wardsData = await fetchWardsByDistrict(districtCode);
        setWards(wardsData || []);
      } catch (error) {
        console.error("Error loading wards:", error);
        toast.error("Không thể tải danh sách phường/xã");
      }
    }
  };

  // Filter users for dropdown
  const filteredUsers = users.filter((user) =>
    user.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.phone_number?.includes(userSearchTerm) ||
    user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // Load products with pagination
  const loadProducts = async (page: number = 0, search: string = "") => {
    try {
      setLoadingProducts(true);
      const response = await filterProducts({
        keyword: search || undefined,
        page,
        size: 12,
        sortBy: "name",
        sortDirection: "ASC",
      });
      
      setProducts(response.content || []);
      setProductTotalPages(response.totalPages || 0);
      setProductPage(page);
    } catch (error: any) {
      console.error("Lỗi khi tải sản phẩm:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Load products when modal opens
  useEffect(() => {
    if (isProductModalOpen) {
      loadProducts(0, productSearchTerm);
    }
  }, [isProductModalOpen]);

  // Search products with debounce
  useEffect(() => {
    if (!isProductModalOpen) return;
    
    const timer = setTimeout(() => {
      loadProducts(0, productSearchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [productSearchTerm]);

  // Add product to order
  const handleAddProduct = async (product: Product) => {
    try {
      // Get variants for the selected product
      const variants = await getProductVariantsByProductId(product.id);
      
      if (!variants || variants.length === 0) {
        toast.error("Sản phẩm không có biến thể nào");
        return;
      }

      // For simplicity, use the first available variant
      const variant = variants[0];

      // Check if already added
      const existingItem = orderItems.find((item) => item.productVariantId === variant.id);
      if (existingItem) {
        toast.warning("Sản phẩm đã có trong đơn hàng");
        return;
      }

      const newItem: OrderItem = {
        productVariantId: variant.id,
        productId: product.id,
        productName: product.name,
        variantName: `${variant.size?.name || ""} - ${variant.color?.name || ""}`,
        imageUrl: variant.imageUrl || product.imageUrls?.[0],
        price: variant.price || 0,
        quantity: 1,
        stockQuantity: variant.stockQuantity || 0,
      };

      setOrderItems([...orderItems, newItem]);
      setIsProductModalOpen(false);
      setProductSearchTerm("");
      toast.success("Đã thêm sản phẩm vào đơn hàng");
    } catch (error: any) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      toast.error("Không thể thêm sản phẩm");
    }
  };

  // Update quantity
  const updateQuantity = (index: number, newQuantity: number) => {
    const item = orderItems[index];
    if (newQuantity < 1) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }
    if (newQuantity > item.stockQuantity) {
      toast.error(`Chỉ còn ${item.stockQuantity} sản phẩm trong kho`);
      return;
    }

    const updatedItems = [...orderItems];
    updatedItems[index].quantity = newQuantity;
    setOrderItems(updatedItems);
  };

  // Remove item
  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // Calculate totals
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = availableShippingMethods.find((m) => m.value === selectedShippingMethod)?.fee || 0;
  const total = subtotal + shippingFee;

  // Format money
  const formatMoney = (amount: number) => {
    return amount.toLocaleString("vi-VN") + " ₫";
  };

  // Submit order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedUser) {
      toast.error("Vui lòng chọn khách hàng");
      return;
    }
    if (orderItems.length === 0) {
      toast.error("Vui lòng thêm ít nhất một sản phẩm");
      return;
    }
    if (!receiverName.trim()) {
      toast.error("Vui lòng nhập tên người nhận");
      return;
    }
    if (!receiverPhone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    if (!address.trim() || !city.trim() || !district.trim() || !ward.trim()) {
      toast.error("Vui lòng nhập đầy đủ địa chỉ");
      return;
    }

    try {
      setLoading(true);

      const orderData: CreateOrderRequest = {
        user_id: selectedUser.id,
        items: orderItems.map((item) => ({
          product_variant_id: item.productVariantId,
          quantity: item.quantity,
        })),
        receiver_name: receiverName.trim(),
        receiver_phone: receiverPhone.trim(),
        address: address.trim(),
        city: city.trim(),
        district: district.trim(),
        ward: ward.trim(),
        shipping_method: selectedShippingMethod,
        shipping_cost: shippingFee,
        payment_method: selectedPaymentMethod,
        discount_code: discountCode.trim() || undefined,
        note: note.trim() || undefined,
      };

      const result = await orderService.createOrder(orderData);
      toast.success("Tạo đơn hàng thành công!");
      navigate(`/orders/${result.id}`);
    } catch (error: any) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      toast.error(error.response?.data?.message || "Không thể tạo đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại danh sách
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tạo đơn hàng mới</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Thêm thông tin đơn hàng cho khách hàng</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thông tin khách hàng</h2>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chọn khách hàng *
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={selectedUser ? `${selectedUser.full_name} - ${selectedUser.phone_number}` : userSearchTerm}
                  onChange={(e) => {
                    setUserSearchTerm(e.target.value);
                    setIsUserDropdownOpen(true);
                    setSelectedUser(null);
                  }}
                  onFocus={() => setIsUserDropdownOpen(true)}
                  placeholder="Tìm kiếm theo tên, SĐT, email..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              {isUserDropdownOpen && filteredUsers.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsUserDropdownOpen(false);
                        setUserSearchTerm("");
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{user.full_name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {user.phone_number} • {user.email}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thông tin giao hàng</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên người nhận *
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Nhập tên người nhận"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số điện thoại *
              </label>
              <input
                type="tel"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Địa chỉ chi tiết *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Số nhà, tên đường..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tỉnh/Thành phố *
              </label>
              <select
                value={city}
                onChange={(e) => handleProvinceChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                required
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quận/Huyện *
              </label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={!city}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phường/Xã *
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                disabled={!district}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              >
                <option value="">Chọn phường/xã</option>
                {wards.map((ward) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sản phẩm</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsProductModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Thêm sản phẩm
            </button>
          </div>

          {orderItems.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.productName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.variantName}</p>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">
                      {formatMoney(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatMoney(item.price * item.quantity)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shipping & Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Method */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Vận chuyển</h2>
            </div>
            <div className="space-y-2">
              {availableShippingMethods.map((method) => (
                <label
                  key={method.value}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value={method.value}
                      checked={selectedShippingMethod === method.value}
                      onChange={(e) => setSelectedShippingMethod(e.target.value)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="text-gray-900 dark:text-white font-medium">{method.label}</div>
                      {method.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{method.description}</div>
                      )}
                    </div>
                  </div>
                  <span className="font-semibold text-purple-600 dark:text-purple-400 ml-2">
                    {method.fee === 0 ? "Miễn phí" : formatMoney(method.fee)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thanh toán</h2>
            </div>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={selectedPaymentMethod === method.value}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 mr-3"
                  />
                  <span className="text-gray-900 dark:text-white">{method.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ghi chú
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Nhập ghi chú cho đơn hàng"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tổng kết đơn hàng</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Tạm tính:</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Phí vận chuyển:</span>
              <span>{formatMoney(shippingFee)}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
              <span>Tổng cộng:</span>
              <span className="text-purple-600 dark:text-purple-400">{formatMoney(total)}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || orderItems.length === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo đơn hàng"
            )}
          </button>
        </div>
      </form>

      {/* Product Selection Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1000000000 p-4">
          <div className="bg-white dark:bg-gray-dark rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Chọn sản phẩm</h3>
                <button
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setProductSearchTerm("");
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-240px)]">
              {loadingProducts ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Đang tải sản phẩm...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  Không tìm thấy sản phẩm nào
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleAddProduct(product)}
                      className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-all text-left"
                    >
                      {product.imageUrls && product.imageUrls.length > 0 && (
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{product.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {product.brand?.name} • {product.category?.name}
                        </p>
                        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">
                          {formatMoney(product.discountedPrice || product.basePrice || 0)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {!loadingProducts && products.length > 0 && productTotalPages > 1 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => loadProducts(Math.max(0, productPage - 1), productSearchTerm)}
                    disabled={productPage === 0}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Trước
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Trang {productPage + 1} / {productTotalPages}
                  </span>
                  <button
                    onClick={() => loadProducts(Math.min(productTotalPages - 1, productPage + 1), productSearchTerm)}
                    disabled={productPage >= productTotalPages - 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
