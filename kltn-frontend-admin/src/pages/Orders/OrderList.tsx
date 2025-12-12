import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeftRight,
  FileDown,
  Trash2,
  Edit,
  Search,
  X,
  Banknote,
  Check,
  NotebookPen,
  Truck,
  Loader2,
  Package,
  Plus,
  Printer,
} from "lucide-react";
import ChangeStatusModal from "./ChangeStatusModal";
import { orderService } from "@/services/orderService";
import { Order, OrderFilterRequest } from "@/types/order";
import { toast } from "sonner";

const statusOptions = [
  { value: "ALL", label: "Tất cả trạng thái", icon: ArrowLeftRight },
  { value: "PENDING", label: "Chờ xác nhận", icon: NotebookPen },
  { value: "PROCESSING", label: "Đang đóng gói", icon: Check },
  { value: "SHIPPING", label: "Đang vận chuyển", icon: Truck },
  { value: "COMPLETED", label: "Hoàn thành", icon: Banknote },
  { value: "CANCELLED", label: "Đã hủy", icon: X },
];

const shippingOptions = [
  { value: "ALL", label: "Tất cả vận chuyển" },
  { value: "STANDARD", label: "Tiêu chuẩn" },
  { value: "EXPRESS", label: "Nhanh" },
  { value: "SUPER_EXPRESS", label: "Hỏa tốc" },
];

export default function OrderList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [shippingFilter, setShippingFilter] = useState("ALL");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [shippingDropdownOpen, setShippingDropdownOpen] = useState(false);
  const [statusSearch, setStatusSearch] = useState("");
  const [shippingSearch, setShippingSearch] = useState("");
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const ordersPerPage = 10;

  // Track previous search term to detect actual changes
  const prevSearchTermRef = useRef(searchTerm);

  // Get current page from URL params
  const currentPage = parseInt(searchParams.get("page") || "0");

  // Helper to update page
  const updatePage = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Build filter
      const filter: OrderFilterRequest = {};
      if (searchTerm) {
        filter.fullName = searchTerm;
        filter.phoneNumber = searchTerm;
      }
      if (statusFilter !== "ALL") {
        filter.status = [statusFilter];
      }
      if (shippingFilter !== "ALL") {
        filter.shippingMethod = [shippingFilter];
      }

      // Call API
      let result;
      if (Object.keys(filter).length > 0) {
        result = await orderService.filterOrders(filter, currentPage, ordersPerPage);
      } else {
        result = await orderService.getAllOrders(currentPage, ordersPerPage);
      }

      setOrders(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      console.log("Orders loaded:", result.content);
    } catch (error: any) {
      console.error("Lỗi khi tải đơn hàng:", error);
      toast.error(error.response?.data?.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and filter changes
  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, shippingFilter, searchTerm]);

  // Search with debounce - reset to page 0 when search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only reset page if search term actually changed
      if (searchTerm !== prevSearchTermRef.current && currentPage !== 0) {
        prevSearchTermRef.current = searchTerm;
        updatePage(0);
      } else {
        prevSearchTermRef.current = searchTerm;
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Toggle chọn đơn hàng
  const toggleOrderSelection = (id: number) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id]
    );
  };

  // Toggle chọn tất cả
  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  };

  // Lọc status options theo search
  const filteredStatusOptions = statusOptions.filter((opt) =>
    opt.label.toLowerCase().includes(statusSearch.toLowerCase())
  );

  // Lọc shipping options theo search
  const filteredShippingOptions = shippingOptions.filter((opt) =>
    opt.label.toLowerCase().includes(shippingSearch.toLowerCase())
  );

  // Xóa đơn hàng
  const handleDelete = async () => {
    if (selectedOrders.length === 0) {
      toast.warning("Vui lòng chọn đơn hàng cần xóa");
      return;
    }

    // Kiểm tra tất cả đơn hàng được chọn phải có trạng thái CANCELLED
    const selectedOrderObjects = orders.filter(o => selectedOrders.includes(o.id));
    const hasNonCancelledOrders = selectedOrderObjects.some(o => o.status !== "CANCELLED");
    
    if (hasNonCancelledOrders) {
      toast.error("Chỉ có thể xóa đơn hàng ở trạng thái 'Đã hủy'");
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa ${selectedOrders.length} đơn hàng?`)) {
      return;
    }

    try {
      setLoading(true);
      await orderService.deleteOrders(selectedOrders);
      toast.success("Xóa đơn hàng thành công");
      setSelectedOrders([]);
      fetchOrders();
    } catch (error: any) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      toast.error(error.response?.data?.message || "Không thể xóa đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Mở modal đổi trạng thái
  const handleChangeStatus = () => {
    if (selectedOrders.length > 0) {
      setIsChangeStatusModalOpen(true);
    } else {
      toast.warning("Vui lòng chọn đơn hàng cần đổi trạng thái");
    }
  };

  // Xác nhận đổi trạng thái
  const handleConfirmStatusChange = async (newStatus: string) => {
    try {
      setLoading(true);
      await orderService.updateOrdersStatus(selectedOrders, newStatus);
      toast.success("Cập nhật trạng thái thành công");
      setSelectedOrders([]);
      setIsChangeStatusModalOpen(false);
      fetchOrders();
    } catch (error: any) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error(error.response?.data?.message || "Không thể cập nhật trạng thái");
    } finally {
      setLoading(false);
    }
  };

  // In PDF
  const handleGeneratePdfs = async () => {
    if (selectedOrders.length === 0) {
      toast.warning("Vui lòng chọn đơn hàng cần in");
      return;
    }

    try {
      setLoading(true);
      toast.info("Đang tạo file PDF...");
      const pdf = await orderService.generateOrderPdfs(selectedOrders);
      
      // Download merged PDF
      const url = window.URL.createObjectURL(pdf);
      const link = document.createElement("a");
      link.href = url;
      // Create filename based on number of orders selected
      const fileName = selectedOrders.length === 1 
        ? `hoa-don-${selectedOrders[0]}.pdf`
        : `hoa-don-${selectedOrders.length}-don-hang-${Date.now()}.pdf`;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Tải xuống PDF thành công (${selectedOrders.length} đơn hàng)`);
    } catch (error: any) {
      console.error("Lỗi khi tạo PDF:", error);
      toast.error(error.response?.data?.message || "Không thể tạo PDF");
    } finally {
      setLoading(false);
    }
  };

  // In PDF cho một đơn hàng
  const handlePrintOrder = async (orderId: number) => {
    try {
      toast.info("Đang tạo file PDF...");
      const pdf = await orderService.generateOrderPdfs([orderId]);
      
      // Download PDF
      const url = window.URL.createObjectURL(pdf);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hoa-don-${orderId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success("Tải xuống PDF thành công");
    } catch (error: any) {
      console.error("Lỗi khi tạo PDF:", error);
      toast.error(error.response?.data?.message || "Không thể tạo PDF");
    }
  };

  // Format tiền VNĐ
  const formatMoney = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "0 ₫";
    return amount.toLocaleString("vi-VN") + " ₫";
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    const found = statusOptions.find((opt) => opt.value === status);
    return found ? found.label : status;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
      CONFIRMED: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      PACKING: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
      DELIVERING: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
      COMPLETED: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
      CANCELLED: "bg-gradient-to-r from-red-500 to-rose-600 text-white",
    };
    return colors[status] || "bg-gray-500 text-white";
  };

  return (
    <div className="min-h-screen">
      {/* Header with gradient */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý đơn hàng</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Tổng số: {totalElements} đơn hàng
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-dark mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:focus:border-purple-400 transition-all"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setShippingDropdownOpen(false);
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white text-left flex items-center justify-between hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:hover:border-purple-400 dark:focus:border-purple-400 transition-all"
            >
              <span>
                {statusOptions.find((opt) => opt.value === statusFilter)?.label ||
                  "Chọn trạng thái"}
              </span>
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            {statusDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-80 overflow-hidden">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Tìm trạng thái..."
                      value={statusSearch}
                      onChange={(e) => setStatusSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 dark:focus:border-purple-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredStatusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setStatusFilter(option.value);
                          setStatusDropdownOpen(false);
                          setStatusSearch("");
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-900 dark:text-white flex items-center gap-2 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Shipping Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShippingDropdownOpen(!shippingDropdownOpen);
                setStatusDropdownOpen(false);
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white text-left flex items-center justify-between hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:hover:border-purple-400 dark:focus:border-purple-400 transition-all"
            >
              <span>
                {shippingOptions.find((opt) => opt.value === shippingFilter)?.label ||
                  "Chọn vận chuyển"}
              </span>
              <Truck className="w-4 h-4" />
            </button>

            {shippingDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-80 overflow-hidden">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Tìm vận chuyển..."
                      value={shippingSearch}
                      onChange={(e) => setShippingSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 dark:focus:border-purple-400"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredShippingOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setShippingFilter(option.value);
                        setShippingDropdownOpen(false);
                        setShippingSearch("");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-900 dark:text-white transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link
              to="/orders/create"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Tạo mới
            </Link>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Đã chọn {selectedOrders.length} đơn hàng
            </span>
            <button
              onClick={handleChangeStatus}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Đổi trạng thái
            </button>
            <button
              onClick={handleGeneratePdfs}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <FileDown className="w-4 h-4" />
              In PDF
            </button>
            {/* Chỉ hiện nút xóa khi tất cả đơn hàng được chọn đều có trạng thái CANCELLED */}
            {orders.filter(o => selectedOrders.includes(o.id)).every(o => o.status === "CANCELLED") && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-dark overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Không có đơn hàng nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === orders.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Mã ĐH
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      SĐT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Ngày đặt
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {order.full_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {order.phone_number || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatMoney(order.final_amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-md ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {order.order_date ? new Date(order.order_date).toLocaleDateString("vi-VN") : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/orders/${order.id}?returnPage=${currentPage}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                            title="Xem chi tiết"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handlePrintOrder(order.id)}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
                            title="In hóa đơn"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Trang {currentPage + 1} / {totalPages} (Tổng {totalElements} đơn hàng)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updatePage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i)
                  .filter(
                    (page) =>
                      page === 0 ||
                      page === totalPages - 1 ||
                      Math.abs(page - currentPage) <= 2
                  )
                  .map((page, index, array) => (
                    <span key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => updatePage(page)}
                        className={`px-3 py-2 rounded-lg transition-all ${
                          currentPage === page
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                            : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {page + 1}
                      </button>
                    </span>
                  ))}
                <button
                  onClick={() => updatePage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Change Status Modal */}
      <ChangeStatusModal
        isOpen={isChangeStatusModalOpen}
        onClose={() => setIsChangeStatusModalOpen(false)}
        selectedOrderIds={selectedOrders}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
}
