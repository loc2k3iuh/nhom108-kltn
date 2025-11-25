import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Truck,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  FileText,
  Tag,
  Loader2,
  AlertCircle,
  Edit,
  Save,
  X,
  Download,
  Eye,
} from "lucide-react";
import { orderService } from "@/services/orderService";
import { Order, UpdateOrderRequest } from "@/types/order";
import { toast } from "sonner";

const statusOptions = [
  { value: "PENDING", label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
  { value: "CONFIRMED", label: "Đã xác nhận", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
  { value: "PACKING", label: "Đang đóng gói", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400" },
  { value: "DELIVERING", label: "Đang giao", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400" },
  { value: "COMPLETED", label: "Hoàn thành", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
  { value: "CANCELLED", label: "Đã hủy", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
];

const shippingMethodOptions = [
  { value: "STANDARD", label: "Tiêu chuẩn" },
  { value: "EXPRESS", label: "Nhanh" },
  { value: "SUPER_EXPRESS", label: "Hỏa tốc" },
];

const paymentMethodOptions = [
  { value: "COD", label: "Thanh toán khi nhận hàng" },
  { value: "BANK_TRANSFER", label: "Chuyển khoản" },
  { value: "CREDIT_CARD", label: "Thẻ tín dụng" },
  { value: "E_WALLET", label: "Ví điện tử" },
];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState<UpdateOrderRequest>({});

  // Get return page from URL params
  const returnPage = searchParams.get("returnPage") || "0";

  // Navigate back to orders list with preserved page
  const navigateBack = () => {
    navigate(`/orders?page=${returnPage}`);
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(Number(id));
      setOrder(response);
      // Initialize form data with current order data
      setFormData({
        order_status: response.status,
        receiver_name: response.full_name,
        receiver_phone: response.phone_number,
        address: response.address,
        city: response.city,
        district: response.district,
        ward: response.ward,
        shipping_method: response.shipping_method,
        shipping_cost: response.shipping_cost,
        payment_method: response.payment_method,
        note: response.note || "",
      });
      console.log("Order detail :", response);
    } catch (error: any) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      toast.error(error.response?.data?.message || "Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!id) return;

    try {
      setSaving(true);
      await orderService.updateOrder(Number(id), formData);
      toast.success("Cập nhật đơn hàng thành công");
      setIsEditing(false);
      // Refresh order data
      await fetchOrderDetail();
    } catch (error: any) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      toast.error(error.response?.data?.message || "Không thể cập nhật đơn hàng");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original order data
    if (order) {
      setFormData({
        order_status: order.status,
        receiver_name: order.full_name,
        receiver_phone: order.phone_number,
        address: order.address,
        city: order.city,
        district: order.district,
        ward: order.ward,
        shipping_method: order.shipping_method,
        shipping_cost: order.shipping_cost,
        payment_method: order.payment_method,
        note: order.note || "",
      });
    }
  };

  const handleViewInvoice = () => {
    if (order?.invoice_url) {
      window.open(order.invoice_url, "_blank");
    }
  };



  const formatMoney = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "0 ₫";
    return amount.toLocaleString("vi-VN") + " ₫";
  };

  const getStatusInfo = (status: string) => {
    const found = statusOptions.find((opt) => opt.value === status);
    return found || { label: status, color: "bg-gray-100 text-gray-800" };
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Không tìm thấy đơn hàng</p>
        <button
          onClick={navigateBack}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={navigateBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Chi tiết đơn hàng #{order.id}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Ngày đặt: {formatDate(order.order_date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
                {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Hủy
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark min-h-[px]">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sản phẩm</h2>
            </div>

            <div className="space-y-4">
              {order.order_details && order.order_details.length > 0 ? (
                order.order_details.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.product_name || "Product"}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-10 h-10 text-gray-400" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                        {item.product_name || "N/A"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Số lượng: {item.quantity || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Đơn giá: {formatMoney(item.price)}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-semibold text-gray-900 dark:text-white text-base">
                        {formatMoney((item.price || 0) * (item.quantity || 0))}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  Không có sản phẩm
                </p>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thông tin khách hàng</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Họ tên</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.receiver_name || ""}
                      onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {order.full_name || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Số điện thoại</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.receiver_phone || ""}
                      onChange={(e) => setFormData({ ...formData, receiver_phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {order.phone_number || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              {order.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{order.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Địa chỉ giao hàng</h2>
            </div>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Địa chỉ chi tiết</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Số nhà, tên đường..."
                    />
                  ) : (
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {order.address || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              {/* City, District, Ward */}
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Tỉnh/Thành phố</label>
                    <input
                      type="text"
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Quận/Huyện</label>
                    <input
                      type="text"
                      value={formData.district || ""}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Phường/Xã</label>
                    <input
                      type="text"
                      value={formData.ward || ""}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 invisible" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {[order.ward, order.district, order.city].filter(Boolean).join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {/* Shipping Method */}
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phương thức vận chuyển</p>
                  {isEditing ? (
                    <select
                      value={formData.shipping_method || ""}
                      onChange={(e) => setFormData({ ...formData, shipping_method: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      {shippingMethodOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {shippingMethodOptions.find(opt => opt.value === order.shipping_method)?.label || order.shipping_method || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Cost */}
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-gray-400 mt-0.5 invisible" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phí vận chuyển</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.shipping_cost || 0}
                      onChange={(e) => setFormData({ ...formData, shipping_cost: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatMoney(order.shipping_cost)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Status */}
          {isEditing && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trạng thái đơn hàng</h2>
              <select
                value={formData.order_status || ""}
                onChange={(e) => setFormData({ ...formData, order_status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Order Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tổng quan đơn hàng</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tạm tính</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatMoney(order.total_amount)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phí vận chuyển</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isEditing ? formatMoney(formData.shipping_cost || 0) : formatMoney(order.shipping_cost)}
                </span>
              </div>

              {order.discount_amount && order.discount_amount > 0 && (
                <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                  <span>Giảm giá</span>
                  <span className="font-semibold">-{formatMoney(order.discount_amount)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Tổng cộng</span>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {formatMoney(order.final_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thanh toán</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phương thức</p>
                  {isEditing ? (
                    <select
                      value={formData.payment_method || ""}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      {paymentMethodOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {paymentMethodOptions.find(opt => opt.value === order.payment_method)?.label || order.payment_method || "N/A"}
                    </p>
                  )}
                </div>
              </div>

              {order.discount_code && (
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mã giảm giá</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{order.discount_code}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ghi chú</h2>
            </div>

            {isEditing ? (
              <textarea
                value={formData.note || ""}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Nhập ghi chú..."
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400">{order.note || "Không có ghi chú"}</p>
            )}
          </div>

          {/* Order Info */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Thông tin đơn</h2>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Mã đơn hàng</span>
                <span className="font-semibold text-gray-900 dark:text-white">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Ngày đặt</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(order.order_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Section */}
          {order.invoice_url && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hóa đơn</h2>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleViewInvoice}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  Xem hóa đơn
                </button>

             
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
