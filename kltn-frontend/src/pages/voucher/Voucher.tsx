import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clipboard, AlertCircle, ChevronLeft, ChevronRight, Search, Clock, Tag, CheckCircle, ShoppingBag, Copy } from 'lucide-react';
import { toast } from 'sonner';

// Interface for Voucher
interface Voucher {
  id: number;
  code: string;
  discount_name: string;
  discount_percentage?: number;
  discount_amount?: number;
  min_order_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_limit?: number;
  used_count?: number;
}

// Static user data
const staticUserData = {
  id: 1,
  username: "user123",
  email: "user@example.com",
  fullName: "Người dùng mẫu",
  phone: "0123456789"
};

// Static voucher data
const staticVouchers: Voucher[] = [
  {
    id: 1,
    code: "VUVISA10",
    discount_name: "Giảm giá 10% cho đơn hàng đầu tiên",
    discount_percentage: 10,
    min_order_value: 100000,
    start_date: "2024-01-01T00:00:00",
    end_date: "2024-12-31T23:59:59",
    is_active: true,
    usage_limit: 100,
    used_count: 25
  },
  {
    id: 2,
    code: "FREESHIP50K",
    discount_name: "Miễn phí vận chuyển",
    discount_amount: 50000,
    min_order_value: 200000,
    start_date: "2024-02-01T00:00:00",
    end_date: "2024-11-30T23:59:59",
    is_active: true,
    usage_limit: 200,
    used_count: 89
  },
  {
    id: 3,
    code: "SACH20",
    discount_name: "Giảm 20% cho sách học thuật",
    discount_percentage: 20,
    min_order_value: 150000,
    start_date: "2024-03-01T00:00:00",
    end_date: "2024-10-31T23:59:59",
    is_active: true,
    usage_limit: 50,
    used_count: 30
  },
  {
    id: 4,
    code: "VANPHONG15",
    discount_name: "Giảm 15% văn phòng phẩm",
    discount_percentage: 15,
    min_order_value: 80000,
    start_date: "2024-01-15T00:00:00",
    end_date: "2024-12-15T23:59:59",
    is_active: true,
    usage_limit: 150,
    used_count: 67
  },
  {
    id: 5,
    code: "MEGA100K",
    discount_name: "Giảm 100K cho đơn từ 500K",
    discount_amount: 100000,
    min_order_value: 500000,
    start_date: "2024-04-01T00:00:00",
    end_date: "2024-12-25T23:59:59",
    is_active: true,
    usage_limit: 30,
    used_count: 15
  },
  {
    id: 6,
    code: "STUDENT25",
    discount_name: "Ưu đãi sinh viên 25%",
    discount_percentage: 25,
    min_order_value: 120000,
    start_date: "2024-02-15T00:00:00",
    end_date: "2024-08-31T23:59:59",
    is_active: false,
    usage_limit: 100,
    used_count: 85
  },
  {
    id: 7,
    code: "SUMMER30",
    discount_name: "Khuyến mãi hè 30%",
    discount_percentage: 30,
    min_order_value: 300000,
    start_date: "2024-06-01T00:00:00",
    end_date: "2024-08-31T23:59:59",
    is_active: false,
    usage_limit: 75,
    used_count: 45
  },
  {
    id: 8,
    code: "WELCOME5K",
    discount_name: "Chào mừng thành viên mới",
    discount_amount: 5000,
    min_order_value: 50000,
    start_date: "2024-01-01T00:00:00",
    end_date: "2024-12-31T23:59:59",
    is_active: true,
    usage_limit: 500,
    used_count: 234
  },
  {
    id: 9,
    code: "BLACKFRIDAY",
    discount_name: "Black Friday Sale 40%",
    discount_percentage: 40,
    min_order_value: 200000,
    start_date: "2024-11-29T00:00:00",
    end_date: "2024-12-02T23:59:59",
    is_active: true,
    usage_limit: 200,
    used_count: 0
  },
  {
    id: 10,
    code: "NEWYEAR2024",
    discount_name: "Chúc mừng năm mới 2024",
    discount_percentage: 15,
    min_order_value: 100000,
    start_date: "2024-01-01T00:00:00",
    end_date: "2024-01-15T23:59:59",
    is_active: false,
    usage_limit: 300,
    used_count: 298
  }
];

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [randomVouchers, setRandomVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchType, setSearchType] = useState<'name' | 'code'>('name');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();
  const pageSize = 8;
  
  // Categories for filtering vouchers
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'percentage', name: 'Giảm theo %' },
    { id: 'amount', name: 'Giảm theo VND' }
  ];

  useEffect(() => {
    // Simulate checking user login status with static data
    setIsLoggedIn(true);
  }, []);

  // Load static data on component mount and when page changes
  useEffect(() => {
    const loadStaticData = () => {
      setLoading(true);
      setError(null);
      
      // Simulate API loading delay
      setTimeout(() => {
        // Paginate static vouchers
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedVouchers = staticVouchers.slice(startIndex, endIndex);
        
        setVouchers(paginatedVouchers);
        setTotalPages(Math.ceil(staticVouchers.length / pageSize));
        
        // Set random vouchers for recommendations (first 4)
        setRandomVouchers(staticVouchers.slice(0, 4));
        
        setLoading(false);
      }, 800);
    };

    loadStaticData();
  }, [currentPage]);

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Vui lòng nhập từ khóa tìm kiếm');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Simulate API loading delay
    setTimeout(() => {
      let filteredVouchers = staticVouchers;
      
      if (searchType === 'name') {
        filteredVouchers = staticVouchers.filter(voucher =>
          voucher.discount_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        filteredVouchers = staticVouchers.filter(voucher =>
          voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply pagination to filtered results
      const startIndex = 0;
      const endIndex = pageSize;
      const paginatedVouchers = filteredVouchers.slice(startIndex, endIndex);
      
      setVouchers(paginatedVouchers);
      setTotalPages(Math.ceil(filteredVouchers.length / pageSize));
      setCurrentPage(0);
      setLoading(false);
    }, 500);
  };

  // Reset search
  const resetSearch = async () => {
    setSearchTerm('');
    setSearchType('name');
    setSelectedCategory('all');
    
    setLoading(true);
    setError(null);
    
    // Simulate API loading delay
    setTimeout(() => {
      // Reset to first page with all vouchers
      const startIndex = 0;
      const endIndex = pageSize;
      const paginatedVouchers = staticVouchers.slice(startIndex, endIndex);
      
      setVouchers(paginatedVouchers);
      setTotalPages(Math.ceil(staticVouchers.length / pageSize));
      setCurrentPage(0);
      setLoading(false);
    }, 500);
  };

  // Filter vouchers by category
  const handleFilterChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    let filteredVouchers = staticVouchers;
    
    if (categoryId !== 'all') {
      // Filter locally based on the selected category
      filteredVouchers = staticVouchers.filter(voucher => {
        if (categoryId === 'percentage') {
          return voucher.discount_percentage !== undefined && voucher.discount_percentage > 0;
        } else if (categoryId === 'amount') {
          return voucher.discount_amount !== undefined && voucher.discount_amount > 0;
        }
        return true;
      });
    }
    
    // Apply pagination to filtered results
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedVouchers = filteredVouchers.slice(startIndex, endIndex);
    
    setVouchers(paginatedVouchers);
    setTotalPages(Math.ceil(filteredVouchers.length / pageSize));
  };

  // Copy voucher code to clipboard
  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success('Đã sao chép mã voucher thành công!');
      })
      .catch(() => {
        toast.error('Không thể sao chép mã voucher!');
      });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Check if voucher is expired
  const isVoucherExpired = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const today = new Date();
    return endDate < today;
  };

  // Check if voucher is active
  const isVoucherActive = (startDateString: string, endDateString: string) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const today = new Date();
    return startDate <= today && today <= endDate;
  };

  // Get remaining days
  const getRemainingDays = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 mb-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-3">Mã Giảm Giá VUVISA</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Khám phá các mã giảm giá độc quyền cho sách và văn phòng phẩm. Tiết kiệm hơn với VUVISA!
          </p>
        </div>
        <div className="absolute right-6 bottom-6 opacity-20 z-0">
          <Clipboard size={120} />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <div className="relative">
              <input
                type="text"
                placeholder={searchType === 'name' ? "Tìm kiếm theo tên voucher..." : "Tìm kiếm theo mã voucher..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'name' | 'code')}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white cursor-pointer"
            >
              <option value="name">Tên voucher</option>
              <option value="code">Mã voucher</option>
            </select>
            <button
              onClick={handleSearch}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 cursor-pointer"
            >
              <Search size={18} className="mr-2" /> Tìm kiếm
            </button>
            <button
              onClick={resetSearch}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Đặt lại
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFilterChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 cursor-pointer ${
                selectedCategory === category.id
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={24} />
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      )}

      {/* Voucher List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-5 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="h-5 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-5 bg-gray-200 rounded mb-4 w-1/3"></div>
              <div className="flex items-center mb-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="flex justify-between">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-red-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : vouchers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center mb-8">
          <div className="text-gray-400 mb-4">
            <Clipboard size={64} className="mx-auto opacity-50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Không tìm thấy voucher</h3>
          <p className="text-gray-500 mb-4">
            Không có voucher nào phù hợp với tìm kiếm của bạn.
          </p>
          <button
            onClick={resetSearch}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 cursor-pointer"
          >
            Xem tất cả voucher
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {vouchers.map((voucher) => {
            const isExpired = isVoucherExpired(voucher.end_date);
            const isActive = isVoucherActive(voucher.start_date, voucher.end_date);
            const remainingDays = getRemainingDays(voucher.end_date);
            
            return (
              <div
                key={voucher.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden relative ${
                  isExpired ? 'opacity-60' : ''
                }`}
              >
                {/* Voucher status badge */}
                {isExpired ? (
                  <div className="bg-gray-500 text-white text-xs font-semibold px-3 py-1 absolute right-0 m-2 rounded-full">
                    Đã hết hạn
                  </div>
                ) : isActive && remainingDays <= 3 ? (
                  <div className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 absolute right-0 m-2 rounded-full">
                    Sắp hết hạn
                  </div>
                ) : isActive ? (
                  <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 absolute right-0 m-2 rounded-full">
                    Đang hoạt động
                  </div>
                ) : (
                  <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 absolute right-0 m-2 rounded-full">
                    Sắp tới
                  </div>
                )}
                
                {/* Voucher content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2 mt-4">
                    {voucher.discount_percentage ? (
                      <Tag className="text-red-500" size={18} />
                    ) : (
                      <ShoppingBag className="text-blue-500" size={18} />
                    )}
                    <h3 className="font-bold text-lg text-gray-800 truncate">
                      {voucher.discount_name}
                    </h3>
                  </div>
                  
                  <div className="mb-4">
                    {voucher.discount_percentage && (
                      <p className="text-red-500 font-semibold text-lg">Giảm {voucher.discount_percentage}%</p>
                    )}
                    
                    {voucher.discount_amount && (
                      <p className="text-red-500 font-semibold text-lg">
                        Giảm {voucher.discount_amount.toLocaleString('vi-VN')}đ
                      </p>
                    )}
                    
                    {voucher.min_order_value > 0 && (
                      <p className="text-gray-600 text-sm">
                        Đơn tối thiểu {voucher.min_order_value.toLocaleString('vi-VN')}đ
                      </p>
                    )}
                  </div>
                  
                  {/* Voucher code */}
                  <div 
                    className="bg-gray-100 border border-dashed border-gray-300 rounded-md p-2 mb-4 flex justify-between items-center cursor-pointer"
                    onClick={() => copyVoucherCode(voucher.code)}
                    title="Nhấp để sao chép"
                  >
                    <span className="font-mono font-semibold text-gray-700">{voucher.code}</span>
                    <Copy size={16} className="text-gray-500" />
                  </div>
                  
                  {/* Date info */}
                  <div className="text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock size={14} />
                      <span>Bắt đầu: {formatDate(voucher.start_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Kết thúc: {formatDate(voucher.end_date)}</span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex justify-between">
                    <button 
                      className="text-gray-500 border border-gray-300 hover:bg-gray-100 rounded-md px-4 py-2 text-sm transition-colors duration-200 flex items-center cursor-pointer"
                      onClick={() => copyVoucherCode(voucher.code)}
                    >
                      <Copy size={14} className="mr-1.5" />
                      Sao chép
                    </button>
                    
                    {isLoggedIn && !isExpired && (
                      <button 
                        className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 text-sm transition-colors duration-200 flex items-center cursor-pointer"
                        onClick={() => {
                          copyVoucherCode(voucher.code);
                          navigate('/cart');
                        }}
                        disabled={isExpired}
                      >
                        <ShoppingBag size={14} className="mr-1.5" />
                        Sử dụng ngay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && vouchers.length > 0 && (
        <div className="flex justify-center items-center gap-2 mb-8">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentPage === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors duration-200 cursor-pointer`}
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculate page numbers to show around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (currentPage < 2) {
                pageNum = i;
              } else if (currentPage > totalPages - 3) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors duration-200`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 3 && (
              <>
                <span className="px-1">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages - 1)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage === totalPages - 1}
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              currentPage === totalPages - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors duration-200 cursor-pointer`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Random/Recommended Vouchers */}
      {randomVouchers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Voucher có thể bạn thích</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {randomVouchers.slice(0, 4).map((voucher) => {
              const isExpired = isVoucherExpired(voucher.end_date);
              
              return (
                <div
                  key={voucher.id}
                  className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${
                    isExpired ? 'opacity-60' : ''
                  }`}
                >
                  <h3 className="font-semibold text-gray-800 mb-2 truncate">
                    {voucher.discount_name}
                  </h3>
                  
                  <div className="mb-2">
                    {voucher.discount_percentage && (
                      <p className="text-red-500 font-semibold">Giảm {voucher.discount_percentage}%</p>
                    )}
                    
                    {voucher.discount_amount && (
                      <p className="text-red-500 font-semibold">
                        Giảm {voucher.discount_amount.toLocaleString('vi-VN')}đ
                      </p>
                    )}
                  </div>
                  
                  <div 
                    className="bg-gray-100 border border-dashed border-gray-300 rounded-md p-2 mb-2 flex justify-between items-center cursor-pointer text-sm"
                    onClick={() => copyVoucherCode(voucher.code)}
                  >
                    <span className="font-mono font-semibold text-gray-700">{voucher.code}</span>
                    <Copy size={14} className="text-gray-500" />
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Hết hạn: {formatDate(voucher.end_date)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherPage;