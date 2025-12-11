import { useEffect, useState } from 'react';
import { Voucher, CreateVoucherRequest, UpdateVoucherRequest, Customer } from '@/types/voucher';

interface VoucherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVoucherRequest | UpdateVoucherRequest) => void;
  voucher: Voucher | null;
  isEditMode: boolean;
  customers: Customer[];
}

export default function VoucherFormModal({
  isOpen,
  onClose,
  onSubmit,
  voucher,
  isEditMode,
  customers,
}: VoucherFormModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENT',
    discountValue: 0,
    minimumOrderAmount: 0,
    maximumDiscountAmount: 0,
    usageLimit: null as number | null,
    usageLimitPerUser: null as number | null,
    startDate: '',
    endDate: '',
    active: true,
  });

  const [userSelection, setUserSelection] = useState<'all' | 'specific'>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [searchCustomer, setSearchCustomer] = useState('');

  // Helper function to convert UTC to local datetime-local format
  const formatDateTimeLocal = (isoString: string | null): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (voucher && isEditMode) {
      setFormData({
        code: voucher.code,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        minimumOrderAmount: voucher.minimumOrderAmount,
        maximumDiscountAmount: voucher.maximumDiscountAmount,
        usageLimit: voucher.usageLimit,
        usageLimitPerUser: voucher.usageLimitPerUser,
        startDate: formatDateTimeLocal(voucher.startDate),
        endDate: formatDateTimeLocal(voucher.endDate),
        active: voucher.isActive,
      });
    } else {
      // Reset form for create mode
      setFormData({
        code: '',
        description: '',
        discountType: 'PERCENT',
        discountValue: 0,
        minimumOrderAmount: 0,
        maximumDiscountAmount: 0,
        usageLimit: null,
        usageLimitPerUser: null,
        startDate: '',
        endDate: '',
        active: true,
      });
      setUserSelection('all');
      setSelectedUserIds([]);
    }
  }, [voucher, isEditMode, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: CreateVoucherRequest | UpdateVoucherRequest = {
      ...formData,
      eligibleUserIds: userSelection === 'all' ? null : selectedUserIds.length > 0 ? selectedUserIds : null,
      // Nếu chọn tất cả khách hàng, set usageLimitPerUser = 1
      usageLimitPerUser: userSelection === 'all' ? 1 : formData.usageLimitPerUser,
    };

    // Convert datetime-local to ISO string (treating input as local time)
    if (data.startDate) {
      // Parse datetime-local string as local time and convert to UTC
      const localDate = new Date(data.startDate);
      data.startDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
    }
    if (data.endDate) {
      // Parse datetime-local string as local time and convert to UTC
      const localDate = new Date(data.endDate);
      data.endDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
    }

    onSubmit(data);
  };

  const handleToggleUser = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUserIds.length === filteredCustomers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredCustomers.map((c) => c.id));
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.full_name?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      customer.phone_number?.includes(searchCustomer)
  );

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div 
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl transition-all duration-200 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditMode ? 'Chỉnh sửa voucher' : 'Tạo voucher mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mã voucher <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="VD: SUMMER2024"
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Loại giảm giá <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="PERCENT">Phần trăm (%)</option>
                <option value="FIXED">Số tiền cố định (VNĐ)</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Giá trị giảm <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step={formData.discountType === 'PERCENT' ? '1' : '1000'}
                max={formData.discountType === 'PERCENT' ? '100' : undefined}
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder={formData.discountType === 'PERCENT' ? 'VD: 10' : 'VD: 50000'}
              />
            </div>

            {/* Maximum Discount (for PERCENT only) */}
            {formData.discountType === 'PERCENT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Giảm tối đa (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.maximumDiscountAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, maximumDiscountAmount: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="VD: 100000"
                />
              </div>
            )}

            {/* Minimum Order Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Đơn hàng tối thiểu (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={formData.minimumOrderAmount}
                onChange={(e) => setFormData({ ...formData, minimumOrderAmount: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="VD: 200000"
              />
            </div>

            {/* Usage Limit - Chỉ hiện khi chọn tất cả khách hàng hoặc ở chế độ edit */}
            {(isEditMode || userSelection === 'all') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Số lượng sử dụng (để trống = không giới hạn)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.usageLimit || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value ? Number(e.target.value) : null })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="VD: 100"
                />
              </div>
            )}

            {/* Usage Per User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Số lần dùng mỗi người {!isEditMode && userSelection === 'all' && <span className="text-xs text-gray-500">(tự động = 1)</span>}
                {(isEditMode || userSelection === 'specific') && <span className="text-xs text-gray-500">(để trống = không giới hạn)</span>}
              </label>
              <input
                type="number"
                min="0"
                value={!isEditMode && userSelection === 'all' ? 1 : formData.usageLimitPerUser || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usageLimitPerUser: e.target.value ? Number(e.target.value) : null,
                  })
                }
                disabled={!isEditMode && userSelection === 'all'}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:bg-gray-900 dark:disabled:text-gray-500"
                placeholder="VD: 1"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Description - Full width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mô tả
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Mô tả chi tiết về voucher..."
              />
            </div>

            {/* Active Status (only for edit mode) */}
            {isEditMode && (
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Voucher đang hoạt động</span>
                </label>
              </div>
            )}
          </div>

          {/* User Selection - Only for create mode */}
          {!isEditMode && (
            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                Phát voucher cho khách hàng
              </h3>

              {/* Selection Type */}
              <div className="mb-4 flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userSelection"
                    value="all"
                    checked={userSelection === 'all'}
                    onChange={() => setUserSelection('all')}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Tất cả khách hàng
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="userSelection"
                    value="specific"
                    checked={userSelection === 'specific'}
                    onChange={() => setUserSelection('specific')}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Chọn khách hàng cụ thể
                  </span>
                </label>
              </div>

              {/* Customer List */}
              {userSelection === 'specific' && (
                <div className="rounded-lg border border-gray-300 dark:border-gray-600">
                  {/* Search */}
                  <div className="border-b border-gray-300 p-3 dark:border-gray-600">
                    <input
                      type="text"
                      placeholder="Tìm theo tên, email, số điện thoại..."
                      value={searchCustomer}
                      onChange={(e) => setSearchCustomer(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Select All */}
                  <div className="border-b border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-900">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                        onChange={handleSelectAllUsers}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Chọn tất cả ({selectedUserIds.length} / {filteredCustomers.length})
                      </span>
                    </label>
                  </div>

                  {/* Customer List */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredCustomers.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Không tìm thấy khách hàng
                      </div>
                    ) : (
                      filteredCustomers.map((customer) => (
                        <label
                          key={customer.id}
                          className="flex items-center border-b border-gray-200 px-3 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(customer.id)}
                            onChange={() => handleToggleUser(customer.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {customer.full_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {customer.email} • {customer.phone_number}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              {isEditMode ? 'Cập nhật' : 'Tạo voucher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
