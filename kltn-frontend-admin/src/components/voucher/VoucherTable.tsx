import { Voucher } from '@/types/voucher';

interface VoucherTableProps {
  vouchers: Voucher[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onEdit: (voucher: Voucher) => void;
  onDelete: (voucher: Voucher) => void;
  onPageChange: (page: number) => void;
}

export default function VoucherTable({
  vouchers,
  loading,
  currentPage,
  totalPages,
  totalElements,
  onEdit,
  onDelete,
  onPageChange,
}: VoucherTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm dark:bg-gray-800">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-sm dark:bg-gray-800">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <svg className="mx-auto mb-4 h-20 w-20 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Không tìm thấy voucher</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Thử tìm kiếm với từ khóa khác hoặc tạo voucher mới</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Mã voucher
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Loại
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Giá trị
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Đơn tối thiểu
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Sử dụng
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Thời gian
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {vouchers.map((voucher) => (
              <tr key={voucher.id} className="transition-colors hover:bg-purple-50/50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{voucher.code}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{voucher.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      voucher.discountType === 'PERCENT'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    }`}
                  >
                    {voucher.discountType === 'PERCENT' ? 'Phần trăm' : 'Số tiền'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white">
                  {voucher.discountType === 'PERCENT'
                    ? `${voucher.discountValue}%`
                    : formatCurrency(voucher.discountValue)}
                  {voucher.maximumDiscountAmount > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tối đa: {formatCurrency(voucher.maximumDiscountAmount)}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-900 dark:text-white">
                  {formatCurrency(voucher.minimumOrderAmount)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-gray-900 dark:text-white">
                      {voucher.usedCount} / {voucher.usageLimit || '∞'}
                    </p>
                    {voucher.usageLimitPerUser && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Mỗi người: {voucher.usageLimitPerUser}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-gray-900 dark:text-white">{formatDateTime(voucher.startDate)}</p>
                    <p className="text-gray-500 dark:text-gray-400">{formatDateTime(voucher.endDate)}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      voucher.isActive
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                        : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${voucher.isActive ? 'bg-white' : 'bg-white'}`}></span>
                    {voucher.isActive ? 'Hoạt động' : 'Tắt'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(voucher)}
                      className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-all hover:bg-blue-100 hover:shadow-md active:scale-95 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(voucher)}
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 hover:shadow-md active:scale-95 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Hiển thị <span className="font-semibold text-purple-600 dark:text-purple-400">{vouchers.length}</span> / <span className="font-semibold">{totalElements}</span> voucher
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Trước
          </button>
          <span className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white">
            Trang {currentPage + 1} / {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
