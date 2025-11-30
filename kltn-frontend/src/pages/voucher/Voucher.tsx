import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Copy, Search, X } from 'lucide-react';
import { getAllVouchersForUser, VoucherResponse } from '@/services/voucherService';
import { useAuthStore } from '@/stores/useAuthStore';

const VoucherPage: React.FC = () => {
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
  
  const pageSize = 12; // 12 vouchers per page
  
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'PERCENT', name: 'Giảm theo %' },
    { id: 'FIXED', name: 'Giảm theo VND' }
  ];

  // Load vouchers from backend
  const loadVouchers = async (page: number = 0, keyword: string = '', reset: boolean = false) => {
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
      console.error('Error loading vouchers:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách voucher');
      toast.error('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers(0, searchTerm);
  }, [authUser?.id, selectedCategory]);

  const handleSearch = () => {
    if (!searchInput.trim()) {
      toast.error('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    setSearchTerm(searchInput.trim());
    loadVouchers(0, searchInput.trim());
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
    loadVouchers(0, '', true);
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
      loadVouchers(newPage, searchTerm);
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
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 mb-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">🎉 Kho Voucher Siêu Hấp Dẫn</h1>
          <p className="text-lg opacity-90">Săn ngay mã giảm giá hot nhất - Tiết kiệm mọi đơn hàng!</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm mã voucher..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button
              onClick={handleSearch}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Search size={20} />
              <span className="hidden sm:inline">Tìm kiếm</span>
            </button>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={resetSearch}
                className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                title="Xóa bộ lọc"
              >
                <X size={20} />
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
            Kết quả tìm kiếm cho: <span className="font-semibold">"{searchTerm}"</span>
            {totalElements > 0 && <span> - Tìm thấy {totalElements} voucher</span>}
          </div>
        )}
      </div>

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

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow border border-gray-200">
              <div className="h-24 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-3"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : vouchers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy voucher</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? `Không có voucher nào phù hợp với từ khóa "${searchTerm}"`
              : 'Hiện tại chưa có voucher nào khả dụng'
            }
          </p>
          {searchTerm && (
            <button
              onClick={resetSearch}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Xem tất cả voucher
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {vouchers.map((voucher) => {
              const isExpired = isVoucherExpired(voucher.endDate);
              const isActive = isVoucherActive(voucher.startDate, voucher.endDate);
              const remainingDays = getRemainingDays(voucher.endDate);
              
              return (
                <div
                  key={voucher.id}
                  className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 ${
                    isExpired || !voucher.isActive ? 'opacity-60' : ''
                  }`}
                >
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-24 relative flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="font-bold text-2xl">
                        {voucher.discountType === 'PERCENT' && `${voucher.discountValue}%`}
                        {voucher.discountType === 'FIXED' && formatPrice(voucher.discountValue)}
                      </div>
                      <div className="text-xs uppercase tracking-wide">GIẢM GIÁ</div>
                    </div>
                    {/* Status Badges */}
                    {!isExpired && isActive && voucher.isActive && (
                      <div className="absolute top-2 right-2 bg-white text-xs font-bold px-2 py-1 rounded text-red-600 shadow">
                        HOT
                      </div>
                    )}
                    {isExpired && (
                      <div className="absolute top-2 right-2 bg-gray-800 text-xs font-bold px-2 py-1 rounded text-white">
                        HẾT HẠN
                      </div>
                    )}
                    {!voucher.isActive && (
                      <div className="absolute top-2 right-2 bg-gray-600 text-xs font-bold px-2 py-1 rounded text-white">
                        VÔ HIỆU
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[40px]" title={voucher.description}>
                      {voucher.description}
                    </h3>
                    
                    <div 
                      className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-3 mb-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => copyVoucherCode(voucher.code)}
                      title="Nhấp để sao chép mã"
                    >
                      <span className="font-mono font-bold text-gray-700 text-sm truncate">{voucher.code}</span>
                      <Copy size={18} className="text-gray-500 flex-shrink-0 ml-2" />
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>HSD:</span>
                        <span className="font-medium">{formatDate(voucher.endDate)}</span>
                      </div>
                      
                      {voucher.minimumOrderAmount > 0 && (
                        <div className="flex justify-between">
                          <span>Đơn tối thiểu:</span>
                          <span className="font-medium text-red-600">{formatPrice(voucher.minimumOrderAmount)}</span>
                        </div>
                      )}
                      
                      {voucher.maximumDiscountAmount && voucher.discountType === 'PERCENT' && (
                        <div className="flex justify-between">
                          <span>Giảm tối đa:</span>
                          <span className="font-medium text-red-600">{formatPrice(voucher.maximumDiscountAmount)}</span>
                        </div>
                      )}
                      
                      {remainingDays > 0 && remainingDays <= 7 && !isExpired && (
                        <div className="mt-2 text-center">
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                            Còn {remainingDays} ngày
                          </span>
                        </div>
                      )}
                      
                      {voucher.usageLimit && (
                        <div className="flex justify-between">
                          <span>Giới hạn:</span>
                          <span className="font-medium">{voucher.usageLimit} lượt</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
              >
                « Trước
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i;
                  } else if (currentPage < 3) {
                    pageNumber = i;
                  } else if (currentPage > totalPages - 4) {
                    pageNumber = totalPages - 5 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === pageNumber
                          ? 'bg-red-500 text-white font-bold'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {pageNumber + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
              >
                Sau »
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

export default VoucherPage;