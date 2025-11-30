import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { getAllVouchersForUser, VoucherResponse } from '@/services/voucherService';

const MyVouchersPage: React.FC = () => {
  const { authUser } = useAuthStore();
  
  const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const pageSize = 12;
  
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'PERCENT', name: 'Giảm theo %' },
    { id: 'FIXED', name: 'Giảm theo VND' }
  ];

  // Load user's vouchers
  const loadMyVouchers = async (page: number = 0, keyword: string = '', reset: boolean = false) => {
    if (!authUser?.id) {
      setLoading(false);
      setError('Vui lòng đăng nhập để xem voucher');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await getAllVouchersForUser(authUser.id, keyword, page, pageSize);
      
      let filteredVouchers = response.content;
      
      // Filter by category
      if (selectedCategory !== 'all') {
        filteredVouchers = filteredVouchers.filter(v => v.discountType === selectedCategory);
      }
      
      setVouchers(filteredVouchers);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(page);
      
      if (reset) {
        setSearchTerm('');
        setSearchInput('');
      }
    } catch (err: any) {
      console.error('Error loading my vouchers:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách voucher');
      toast.error('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyVouchers(0, searchTerm);
  }, [authUser?.id, selectedCategory]);

  const handleSearch = () => {
    if (!searchInput.trim()) {
      toast.error('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    setSearchTerm(searchInput.trim());
    loadMyVouchers(0, searchInput.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setSelectedCategory('all');
    loadMyVouchers(0, '', true);
  };

  const handleFilterChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => toast.success('Đã sao chép mã voucher thành công!'))
      .catch(() => toast.error('Không thể sao chép mã voucher!'));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const isVoucherExpired = (endDateString: string) => {
    return new Date(endDateString) < new Date();
  };

  const isVoucherActive = (startDateString: string, endDateString: string) => {
    const now = new Date();
    return new Date(startDateString) <= now && now <= new Date(endDateString);
  };

  const getRemainingDays = (endDateString: string) => {
    const diffTime = new Date(endDateString).getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadMyVouchers(newPage, searchTerm);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!authUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem danh sách voucher</p>
          <Link 
            to="/login"
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors inline-block"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="bg-gradient-to-r  from-red-500 to-orange-500 rounded-lg p-6 mb-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">💼 Voucher Của Tôi</h1>
          <p className="text-lg opacity-90">Quản lý và sử dụng voucher đã nhận</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6 p-4">
        <div className="flex gap-4">
          <Link 
            to="/voucher/claimable"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            Voucher có thể nhận
          </Link>
          <Link 
            to="/voucher/my-vouchers"
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium"
          >
            Voucher của tôi
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm voucher theo mã hoặc mô tả..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2  bg-red-500  text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Tìm kiếm
            </button>
            {searchTerm && (
              <button
                onClick={resetSearch}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleFilterChange(category.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {searchTerm && (
          <div className="mt-4 text-sm text-gray-600">
            Kết quả tìm kiếm cho: <strong>"{searchTerm}"</strong>
            {totalElements > 0 && <span className="ml-2">({totalElements} voucher)</span>}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow border border-gray-200">
              <div className="h-24 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : vouchers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Bạn chưa có voucher nào</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? `Không có voucher nào phù hợp với từ khóa "${searchTerm}"`
              : 'Hãy đến trang "Voucher có thể nhận" để nhận voucher miễn phí'
            }
          </p>
          <Link
            to="/voucher/claimable"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block"
          >
            Xem voucher có thể nhận
          </Link>
        </div>
      ) : (
        <>
          {/* Voucher Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {vouchers.map((voucher) => {
              const expired = isVoucherExpired(voucher.endDate);
              const active = isVoucherActive(voucher.startDate, voucher.endDate);
              const remainingDays = getRemainingDays(voucher.endDate);
              
              return (
                <div 
                  key={voucher.id} 
                  className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
                    expired ? 'border-gray-300 opacity-60' : active ? 'border-blue-200' : 'border-orange-200'
                  }`}
                >
                  {/* Voucher Header */}
                  <div className={`p-4 text-white ${
                    expired ? 'bg-gray-400' : active ? 'bg-gradient-to-r  from-red-500 to-orange-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold bg-white text-red-600 px-2 py-1 rounded">
                        {voucher.discountType === 'PERCENT' ? 'GIẢM %' : 'GIẢM TIỀN'}
                      </span>
                      {expired ? (
                        <span className="text-xs bg-red-500 px-2 py-1 rounded">
                          Đã hết hạn
                        </span>
                      ) : !active ? (
                        <span className="text-xs bg-yellow-500 px-2 py-1 rounded">
                          Sắp áp dụng
                        </span>
                      ) : remainingDays <= 3 && (
                        <span className="text-xs bg-red-500 px-2 py-1 rounded animate-pulse">
                          Còn {remainingDays} ngày
                        </span>
                      )}
                    </div>
                    <div className="text-3xl font-bold text-center">
                      {voucher.discountType === 'PERCENT' 
                        ? `${voucher.discountValue}%`
                        : formatPrice(voucher.discountValue)
                      }
                    </div>
                    {voucher.discountType === 'PERCENT' && voucher.maximumDiscountAmount && (
                      <div className="text-xs text-center mt-1 opacity-90">
                        Tối đa {formatPrice(voucher.maximumDiscountAmount)}
                      </div>
                    )}
                  </div>

                  {/* Voucher Body */}
                  <div className="p-4">
                    {/* Voucher Code */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-2">
                        <code className="text-sm font-bold text-red-600">{voucher.code}</code>
                        <button
                          onClick={() => copyVoucherCode(voucher.code)}
                          disabled={expired}
                          className="text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Sao chép mã"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2" title={voucher.description}>
                      {voucher.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-1 text-xs text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                        <span>Đơn tối thiểu: <strong>{formatPrice(voucher.minimumOrderAmount)}</strong></span>
                      </div>

                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>Từ: <strong>{formatDate(voucher.startDate)}</strong></span>
                      </div>

                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>Đến: <strong>{formatDate(voucher.endDate)}</strong></span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="text-center">
                      {expired ? (
                        <span className="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                          Đã hết hiệu lực
                        </span>
                      ) : !active ? (
                        <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium">
                          Chưa đến thời gian sử dụng
                        </span>
                      ) : (
                        <span className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium">
                          ✓ Có thể sử dụng
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Trước
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (currentPage <= 2) {
                    pageNum = i;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau →
              </button>
            </div>
          )}

          <div className="mt-4 text-center text-sm text-gray-600">
            Hiển thị {vouchers.length} / {totalElements} voucher
          </div>
        </>
      )}
    </div>
  );
};

export default MyVouchersPage;
