import { useState } from "react";
import { Search, X, Plus, Minus } from "lucide-react";

// Mock data
const mockProvinces = [
  { id: 1, name: "Hà Nội" },
  { id: 2, name: "TP Hồ Chí Minh" },
  { id: 3, name: "Đà Nẵng" },
];

const mockDistricts = [
  { id: 1, provinceId: 1, name: "Quận Ba Đình" },
  { id: 2, provinceId: 1, name: "Quận Hoàn Kiếm" },
  { id: 3, provinceId: 2, name: "Quận 1" },
  { id: 4, provinceId: 2, name: "Quận 3" },
];

const mockWards = [
  { id: 1, districtId: 1, name: "Phường Phúc Xá" },
  { id: 2, districtId: 1, name: "Phường Trúc Bạch" },
  { id: 3, districtId: 3, name: "Phường Bến Nghé" },
  { id: 4, districtId: 3, name: "Phường Bến Thành" },
];

const mockProducts = [
  { id: 1, name: "Áo thun nam", price: 250000, image: "/images/product/product-1.jpg" },
  { id: 2, name: "Quần jean nữ", price: 450000, image: "/images/product/product-2.jpg" },
  { id: 3, name: "Giày sneaker", price: 850000, image: "/images/product/product-3.jpg" },
  { id: 4, name: "Túi xách da", price: 1200000, image: "/images/product/product-4.jpg" },
];

const mockVouchers = [
  { id: 1, code: "GIAM50K", discountType: "FIXED", discountValue: 50000, description: "Giảm 50k cho đơn từ 500k" },
  { id: 2, code: "GIAM10PT", discountType: "PERCENT", discountValue: 10, description: "Giảm 10% tối đa 100k" },
  { id: 3, code: "FREESHIP", discountType: "SHIPPING", discountValue: 30000, description: "Miễn phí ship tối đa 30k" },
];

interface OrderProduct {
  product: typeof mockProducts[0];
  quantity: number;
}

export default function EditOrder() {
  // Customer info
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  // Address
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);
  const [detailedAddress, setDetailedAddress] = useState("");

  // Products
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  // Voucher
  const [selectedVoucher, setSelectedVoucher] = useState<typeof mockVouchers[0] | null>(null);
  const [voucherSearch, setVoucherSearch] = useState("");
  const [isVoucherDropdownOpen, setIsVoucherDropdownOpen] = useState(false);

  // Shipping
  const [shippingMethod, setShippingMethod] = useState("STANDARD");
  const [shippingFee, setShippingFee] = useState(30000);

  // Note
  const [note, setNote] = useState("");

  // Filtered data
  const filteredDistricts = mockDistricts.filter(d => d.provinceId === selectedProvince);
  const filteredWards = mockWards.filter(w => w.districtId === selectedDistrict);
  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );
  const filteredVouchers = mockVouchers.filter(v =>
    v.code.toLowerCase().includes(voucherSearch.toLowerCase()) ||
    v.description.toLowerCase().includes(voucherSearch.toLowerCase())
  );

  // Add product to order
  const addProduct = (product: typeof mockProducts[0]) => {
    const existing = orderProducts.find(op => op.product.id === product.id);
    if (existing) {
      setOrderProducts(orderProducts.map(op =>
        op.product.id === product.id ? { ...op, quantity: op.quantity + 1 } : op
      ));
    } else {
      setOrderProducts([...orderProducts, { product, quantity: 1 }]);
    }
    setProductSearch("");
    setIsProductDropdownOpen(false);
  };

  // Remove product
  const removeProduct = (productId: number) => {
    setOrderProducts(orderProducts.filter(op => op.product.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId: number, delta: number) => {
    setOrderProducts(orderProducts.map(op => {
      if (op.product.id === productId) {
        const newQuantity = op.quantity + delta;
        return newQuantity > 0 ? { ...op, quantity: newQuantity } : op;
      }
      return op;
    }).filter(op => op.quantity > 0));
  };

  // Calculations
  const subtotal = orderProducts.reduce((sum, op) => sum + op.product.price * op.quantity, 0);
  
  let discount = 0;
  if (selectedVoucher) {
    if (selectedVoucher.discountType === "FIXED") {
      discount = selectedVoucher.discountValue;
    } else if (selectedVoucher.discountType === "PERCENT") {
      discount = Math.min(subtotal * selectedVoucher.discountValue / 100, 100000);
    } else if (selectedVoucher.discountType === "SHIPPING") {
      discount = Math.min(shippingFee, selectedVoucher.discountValue);
    }
  }
  
  const total = subtotal - discount + shippingFee;

  // Format money
  const formatMoney = (amount: number) => amount.toLocaleString("vi-VN") + " ₫";

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Lưu đơn hàng:", {
      customer: { fullName, phoneNumber, email },
      address: { selectedProvince, selectedDistrict, selectedWard, detailedAddress },
      products: orderProducts,
      voucher: selectedVoucher,
      shipping: { method: shippingMethod, fee: shippingFee },
      note,
      total,
    });
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thêm/Sửa đơn hàng</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Info */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Thông tin khách hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Họ tên *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border border-stroke bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SĐT *</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border border-stroke bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded border border-stroke bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Địa chỉ giao hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tỉnh/TP *</label>
              <select
                value={selectedProvince || ""}
                onChange={(e) => {
                  setSelectedProvince(Number(e.target.value));
                  setSelectedDistrict(null);
                  setSelectedWard(null);
                }}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {mockProvinces.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quận/Huyện *</label>
              <select
                value={selectedDistrict || ""}
                onChange={(e) => {
                  setSelectedDistrict(Number(e.target.value));
                  setSelectedWard(null);
                }}
                required
                disabled={!selectedProvince}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">Chọn quận/huyện</option>
                {filteredDistricts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phường/Xã *</label>
              <select
                value={selectedWard || ""}
                onChange={(e) => setSelectedWard(Number(e.target.value))}
                required
                disabled={!selectedDistrict}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">Chọn phường/xã</option>
                {filteredWards.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Địa chỉ chi tiết *</label>
            <input
              type="text"
              value={detailedAddress}
              onChange={(e) => setDetailedAddress(e.target.value)}
              required
              placeholder="Số nhà, tên đường..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Products */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Sản phẩm</h2>
          
          {/* Search Product */}
          <div className="relative mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Tìm sản phẩm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setIsProductDropdownOpen(true);
                }}
                onFocus={() => setIsProductDropdownOpen(true)}
                placeholder="Nhập tên sản phẩm..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isProductDropdownOpen && filteredProducts.length > 0 && (
              <div className="absolute z-10 mt-2 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addProduct(product)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-600 flex items-center gap-3 border-b border-gray-600 last:border-0"
                  >
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-sm text-gray-400">{formatMoney(product.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Products */}
          {orderProducts.length > 0 ? (
            <div className="space-y-3">
              {orderProducts.map(op => (
                <div key={op.product.id} className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg">
                  <img src={op.product.image} alt={op.product.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="text-white font-medium">{op.product.name}</p>
                    <p className="text-sm text-gray-400">{formatMoney(op.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(op.product.id, -1)}
                      className="p-1 bg-gray-600 hover:bg-gray-500 rounded"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    <span className="text-white w-12 text-center">{op.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(op.product.id, 1)}
                      className="p-1 bg-gray-600 hover:bg-gray-500 rounded"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <p className="text-white font-semibold w-32 text-right">
                    {formatMoney(op.product.price * op.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeProduct(op.product.id)}
                    className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">Chưa có sản phẩm nào</p>
          )}
        </div>

        {/* Voucher */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Mã giảm giá</h2>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">Chọn voucher</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={selectedVoucher?.code || voucherSearch}
                onChange={(e) => {
                  setVoucherSearch(e.target.value);
                  setIsVoucherDropdownOpen(true);
                  if (!e.target.value) setSelectedVoucher(null);
                }}
                onFocus={() => setIsVoucherDropdownOpen(true)}
                placeholder="Tìm mã giảm giá..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isVoucherDropdownOpen && filteredVouchers.length > 0 && !selectedVoucher && (
              <div className="absolute z-10 mt-2 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredVouchers.map(voucher => (
                  <button
                    key={voucher.id}
                    type="button"
                    onClick={() => {
                      setSelectedVoucher(voucher);
                      setVoucherSearch("");
                      setIsVoucherDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-600 border-b border-gray-600 last:border-0"
                  >
                    <p className="text-white font-medium">{voucher.code}</p>
                    <p className="text-sm text-gray-400">{voucher.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedVoucher && (
            <div className="mt-3 bg-green-500/20 border border-green-500/50 rounded-lg p-3">
              <p className="text-green-400 font-medium">✓ Đã áp dụng: {selectedVoucher.code}</p>
              <p className="text-sm text-gray-300">{selectedVoucher.description}</p>
            </div>
          )}
        </div>

        {/* Shipping */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Vận chuyển</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phương thức</label>
              <select
                value={shippingMethod}
                onChange={(e) => {
                  setShippingMethod(e.target.value);
                  if (e.target.value === "EXPRESS") setShippingFee(50000);
                  else if (e.target.value === "SUPER_EXPRESS") setShippingFee(80000);
                  else setShippingFee(30000);
                }}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="STANDARD">Tiêu chuẩn (30k)</option>
                <option value="EXPRESS">Nhanh (50k)</option>
                <option value="SUPER_EXPRESS">Hỏa tốc (80k)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phí vận chuyển</label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Ghi chú</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Ghi chú đơn hàng..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Summary */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Tổng kết</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Tạm tính:</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Giảm giá:</span>
                <span>-{formatMoney(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-300">
              <span>Phí vận chuyển:</span>
              <span>{formatMoney(shippingFee)}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 flex justify-between text-white text-xl font-bold">
              <span>Tổng cộng:</span>
              <span className="text-blue-400">{formatMoney(total)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Lưu đơn hàng
          </button>
        </div>
      </form>
    </div>
  );
}
