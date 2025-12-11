import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  getAllVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getAllCustomers,
} from '@/services/voucherService';
import { Voucher, CreateVoucherRequest, UpdateVoucherRequest, Customer } from '@/types/voucher';
import VoucherTable from '@/components/voucher/VoucherTable';
import VoucherFormModal from '@/components/voucher/VoucherFormModal';

import { Search, Plus } from 'lucide-react';
import DeleteConfirmModal from '@/components/voucher/DeleteConfirmModal';

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Pagination & filters
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [discountTypeFilter, setDiscountTypeFilter] = useState('');
  
  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, [currentPage, keyword, discountTypeFilter]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const data = await getAllVouchers(
        keyword || undefined,
        discountTypeFilter || undefined,
        currentPage,
        pageSize
      );
      setVouchers(data.content);
      console.log("vouchers: ", data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers...');
      const data = await getAllCustomers();
      console.log('Customers loaded:', data);
      setCustomers(data);
      if (data.length === 0) {
        console.warn('No customers found in database');
      }
    } catch (error: any) {
      console.error('Failed to fetch customers:', error);
      toast.error('Không thể tải danh sách khách hàng');
    }
  };

  const handleSearch = () => {
    setKeyword(searchInput);
    setCurrentPage(0);
  };

  const handleFilterChange = (type: string) => {
    setDiscountTypeFilter(type);
    setCurrentPage(0);
  };

  const handleCreate = () => {
    setSelectedVoucher(null);
    setIsEditMode(false);
    setIsFormModalOpen(true);
  };

  const handleEdit = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsEditMode(true);
    setIsFormModalOpen(true);
  };

  const handleDelete = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsDeleteModalOpen(true);
  };

  const handleSubmitForm = async (data: CreateVoucherRequest | UpdateVoucherRequest) => {
    try {
      if (isEditMode && selectedVoucher) {
        await updateVoucher(selectedVoucher.id, data as UpdateVoucherRequest);
        toast.success('Cập nhật voucher thành công');
      } else {
        await createVoucher(data as CreateVoucherRequest);
        toast.success('Tạo voucher thành công');
      }
      setIsFormModalOpen(false);
      fetchVouchers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedVoucher) return;
    
    try {
      await deleteVoucher(selectedVoucher.id);
      toast.success('Xóa voucher thành công');
      setIsDeleteModalOpen(false);
      fetchVouchers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể xóa voucher');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Quản lý Voucher
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tạo và quản lý các mã giảm giá cho khách hàng
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Card */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="flex flex-1 gap-3">
              <div className="relative flex-1 lg:max-w-md">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã hoặc mô tả..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 text-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-purple-400"
                />
              </div>
              <button
                onClick={handleSearch}
                className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-purple-700 hover:shadow-lg active:scale-95"
              >
                Tìm kiếm
              </button>
            </div>

            {/* Filter & Create Button */}
            <div className="flex gap-3">
              <select
                value={discountTypeFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-3 text-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Tất cả loại</option>
                <option value="PERCENT">Phần trăm</option>
                <option value="FIXED">Số tiền cố định</option>
              </select>

              <button
                onClick={handleCreate}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-xl active:scale-95"
              >
                <Plus className="h-5 w-5" />
                Tạo voucher
              </button>
            </div>
          </div>
        </div>

      {/* Voucher Table */}
      <VoucherTable
        vouchers={vouchers}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      {/* Form Modal */}
      <VoucherFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
        voucher={selectedVoucher}
        isEditMode={isEditMode}
        customers={customers}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        voucherCode={selectedVoucher?.code || ''}
      />
      </div>
    </div>
  );
}
