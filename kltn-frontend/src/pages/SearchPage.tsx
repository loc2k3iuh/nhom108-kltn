import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
// Static types and data
interface Product {
  id: number;
  productName: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface Supplier {
  id: number;
  supplierName: string;
}

enum CategoryType {
  VAN_PHONG_PHAM = 'VAN_PHONG_PHAM',
  SACH_NUOC_NGOAI = 'SACH_NUOC_NGOAI', 
  SACH_TRONG_NUOC = 'SACH_TRONG_NUOC'
}

interface Category {
  id: number;
  categoryName: string;
}

interface LocationState {
  groupedCategories: {
    [key in CategoryType]: Category[];
  } | null;
}

// Static product data
const staticProducts: Product[] = [
  {
    id: 1,
    productName: "Áo thun nam thể thao",
    description: "Áo thun nam chất liệu cotton thoáng mát, phù hợp cho tập thể thao",
    price: 299000,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
  },
  {
    id: 2,
    productName: "Giày chạy bộ nam",
    description: "Giày chạy bộ chuyên dụng, đế êm ái, thoáng khí",
    price: 1299000,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
  },
  {
    id: 3,
    productName: "Quần short thể thao",
    description: "Quần short thể thao nam, chất liệu thấm hút mồ hôi tốt",
    price: 199000,
    imageUrl: "https://images.unsplash.com/photo-1506629905607-d5b44b04a032?w=400"
  },
  {
    id: 4,
    productName: "Áo polo nữ",
    description: "Áo polo nữ thanh lịch, phù hợp đi làm và dạo phố",
    price: 399000,
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400"
  }
];

// Static suppliers data
const staticSuppliers: Supplier[] = [
  { id: 1, supplierName: "Nike Vietnam" },
  { id: 2, supplierName: "Adidas Store" },
  { id: 3, supplierName: "Uniqlo Vietnam" },
  { id: 4, supplierName: "H&M Vietnam" },
  { id: 5, supplierName: "Zara Vietnam" },
  { id: 6, supplierName: "Local Brand" }
];

// Static category data
const staticCategories: Record<CategoryType, Category[]> = {
  [CategoryType.VAN_PHONG_PHAM]: [
    { id: 1, categoryName: "Bút viết" },
    { id: 2, categoryName: "Sổ tay" }
  ],
  [CategoryType.SACH_NUOC_NGOAI]: [
    { id: 3, categoryName: "Tiểu thuyết" },
    { id: 4, categoryName: "Khoa học" }
  ],
  [CategoryType.SACH_TRONG_NUOC]: [
    { id: 5, categoryName: "Văn học Việt Nam" },
    { id: 6, categoryName: "Lịch sử" }
  ]
};

const SearchPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LocationState;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllSuppliers, setShowAllSuppliers] = useState(false);
  const groupedCategories = locationState?.groupedCategories || staticCategories;
  const searchTerm = searchParams.get('q') || '';
  const [suppliers, setSuppliers] = useState<Supplier[]>(staticSuppliers);
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 12;

  const displayedSuppliers = showAllSuppliers ? suppliers : suppliers.slice(0, 6);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredProducts = [...staticProducts];
        
        if (searchTerm) {
          // Filter products by search term
          filteredProducts = staticProducts.filter(product => 
            product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        } else if (categoryId) {
          // For demo, show all products regardless of category
          filteredProducts = staticProducts;
        }
        
        // Simulate pagination
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        setProducts(paginatedProducts);
        setTotalPages(Math.ceil(filteredProducts.length / pageSize));
        setTotalElements(filteredProducts.length);
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
        setError('Không thể tải sản phẩm');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [categoryId, currentPage, searchTerm]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleCategoryClick = (category: Category) => {
    setCurrentPage(0);
    navigate(`/category/${category.id}`, {
      state: { groupedCategories: locationState?.groupedCategories }
    });
  };

  const handleSupplierToggle = (supplierId: number) => {
    setCurrentPage(0);
    navigate(`/category/${categoryId}/supplier/${supplierId}`, {
      state: { 
        groupedCategories: locationState?.groupedCategories,
        supplierId: supplierId
      }
    });
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try{
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Use static suppliers data
        setSuppliers(staticSuppliers);
      }catch(error){
        console.error("Error fetching suppliers:", error);
        setSuppliers([]);
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <div className="flex flex-col bg-[#f0f0f0] min-h-screen overflow-x-auto">
      <div className="flex-grow p-4 flex justify-around ml-20 mr-20">
        {/* Bộ lọc */}
        <div className="bg-white p-6 mb-4 rounded-lg w-[280px] h-fit">
          <h2 className="text-lg font-bold mb-4">LỌC SẢN PHẨM</h2>

          <div className="border-t border-gray-200 py-4">
            <h3 className="font-bold mb-3">THỂ LOẠI</h3>
            {groupedCategories && (
              <div className="space-y-4">
                {Object.entries(groupedCategories).map(([type, categories]) => (
                  <div key={type} className="space-y-2">
                    <h4 className="font-semibold text-[15px]">
                      {type === CategoryType.VAN_PHONG_PHAM && 'Văn phòng phẩm'}
                      {type === CategoryType.SACH_NUOC_NGOAI && 'Sách nước ngoài'}
                      {type === CategoryType.SACH_TRONG_NUOC && 'Sách trong nước'}
                    </h4>
                    <ul className="space-y-2">
                      {(categories as Category[]).map((cat: Category) => (
                        <li 
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat)}
                          className={`text-[14px] cursor-pointer hover:text-gray-800 ${
                            Number(categoryId) === cat.id 
                              ? 'text-red-600 font-medium' 
                              : 'text-gray-600'
                          }`}
                        >
                          {cat.categoryName}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 py-4">
            <h3 className="font-bold mb-3">NHÀ CUNG CẤP</h3>
            <div className="space-y-2">
              {displayedSuppliers.map((supplier) => (
                <label key={supplier.id} className='flex items-center text-[14px] text-gray-600'>
                  <input 
                    type="checkbox" 
                    className='form-checkbox mr-2 h-4 w-4 text-blue-600' 
                    checked={selectedSuppliers.includes(supplier.id)}
                    onChange={() => handleSupplierToggle(supplier.id)}
                  />
                  {supplier.supplierName}
                </label>
              ))}
            </div>
            {suppliers.length > 6 && (
              <button
                className="mt-3 text-blue-600 hover:underline text-[14px]"
                onClick={() => setShowAllSuppliers(!showAllSuppliers)}
              >
                {showAllSuppliers ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className={`bg-white p-4 mb-4 rounded-lg ${!searchTerm ? 'ml-5' : ''} flex-grow w-full`}>
          {/* Ẩn banner khi đang search */}
          {!searchTerm && (
            <img
              src="/src/assets/img/Screenshot 2025-03-06 215944.png"
              alt="Banner"
              className="h-80 w-full object-cover rounded"
            />
          )}

          <div className="flex justify-between items-center mt-5 mb-5">
            <div className="bg-blue-200 border-6 border-blue-200 rounded-lg text-blue-700 text-1xl p-2">
              {searchTerm ? (
                <>
                  Kết quả tìm kiếm cho: <span className="font-semibold">"{searchTerm}"</span>
                </>
              ) : null}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-600">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">
                {searchTerm 
                  ? `Không tìm thấy sản phẩm nào phù hợp với "${searchTerm}"`
                  : 'Không có sản phẩm nào trong danh mục này'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/product?id=${product.id}`)}
                  >
                    <img
                      src={product.imageUrl || '/placeholder-product.jpg'}
                      alt={product.productName}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {product.productName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description.replace(/<[^>]*>/g, '')}
                      </p>
                      <p className="text-red-600 font-bold text-lg">
                        {product.price.toLocaleString()} đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 0
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Trước
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === index
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages - 1
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;