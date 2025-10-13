import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Loader, AlertCircle, Search } from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import UserSidebar from '../../components/UserSidebar';

const staticFavoriteProducts: Product[] = [
  {
    id: 1,
    productName: 'Áo Polo Nam Classic Premium',
    price: 399000,
    imageUrl: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500',
    stockQuantity: 45,
    description: 'Áo polo nam chất liệu cotton cao cấp, form dáng chuẩn',
    author: { name: 'Nike' },
    publisher: { name: 'Nike Vietnam' },
    discount: { discountPercentage: 25 }
  },
  {
    id: 2,
    productName: 'Áo T-shirt Nữ Basic Cotton',
    price: 285000,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    stockQuantity: 62,
    description: 'Áo thun nữ basic từ cotton 100%, thoáng mát',
    author: { name: 'Adidas' },
    publisher: { name: 'Adidas Store' },
    discount: { discountPercentage: 30 }
  },
  {
    id: 3,
    productName: 'Túi Thể Thao Nike Premium',
    price: 999000,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    stockQuantity: 28,
    description: 'Túi thể thao chống nước, nhiều ngăn tiện dụng',
    author: { name: 'Nike' },
    publisher: { name: 'Nike Sports' },
    discount: { discountPercentage: 15 }
  },
  {
    id: 4,
    productName: 'Giày Sneaker Unisex',
    price: 1250000,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
    stockQuantity: 0, // Hết hàng
    description: 'Giày sneaker thời trang, phù hợp mọi độ tuổi',
    author: { name: 'Converse' },
    publisher: { name: 'Converse Official' },
    discount: { discountPercentage: 20 }
  },
  {
    id: 5,
    productName: 'Áo Khoác Hoodie Premium',
    price: 650000,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    stockQuantity: 33,
    description: 'Áo khoác hoodie thời trang, chất liệu mềm mại',
    author: { name: 'H&M' },
    publisher: { name: 'H&M Fashion' }
  }
];

// Dữ liệu người dùng tĩnh
const staticUserData = {
  id: 1,
  full_name: 'Nguyễn Văn A',
  email: 'nguyenvana@email.com',
  phone_number: '0987654321',
  address: '123 Đường ABC, Phường XYZ',
  city: 'TP Hồ Chí Minh',
  district: 'Quận 1',
  ward: 'Phường Bến Nghé'
};

interface Product {
  id: number;
  productName: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  description?: string;
  author?: {
    name: string;
  };
  publisher?: {
    name: string;
  };
  discount?: {
    discountPercentage: number;
  };
}

const FavoritesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [removingProductIds, setRemovingProductIds] = useState<number[]>([]);
  const [addingToCartIds, setAddingToCartIds] = useState<number[]>([]);
  const navigate = useNavigate();

  // Hàm lấy dữ liệu người dùng từ localStorage hoặc trả về dữ liệu tĩnh
  const getUserResponseFromLocalStorage = () => {
    try {
      const userData = localStorage.getItem('vuvisa_user_data');
      if (userData) {
        return JSON.parse(userData);
      }
      return staticUserData;
    } catch (error) {
      console.error('Error getting user data:', error);
      return staticUserData;
    }
  };

  // Fetch favorite products on component mount
  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mô phỏng độ trễ API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sử dụng dữ liệu tĩnh
        setProducts(staticFavoriteProducts);
        setFilteredProducts(staticFavoriteProducts);
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm yêu thích. Vui lòng thử lại sau.');
        console.error('Error fetching favorite products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [navigate]);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
      return;
    }
    
    const results = products.filter(product => 
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.author?.name && product.author.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.publisher?.name && product.publisher.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredProducts(results);
  }, [searchTerm, products]);

  // Remove a product from favorites
  const removeFromFavorites = async (productId: number) => {
    try {
      setRemovingProductIds(prev => [...prev, productId]);
      
      // Confirm deletion
      const result = await Swal.fire({
        title: 'Xóa khỏi yêu thích?',
        text: 'Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
      });
      
      if (!result.isConfirmed) {
        setRemovingProductIds(prev => prev.filter(id => id !== productId));
        return;
      }
      
      // Mô phỏng độ trễ API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state - xóa sản phẩm khỏi danh sách
      setProducts(prev => prev.filter(product => product.id !== productId));
      toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích');
    } catch (err) {
      toast.error('Xóa sản phẩm khỏi yêu thích thất bại');
      console.error('Error removing product from favorites:', err);
    } finally {
      setRemovingProductIds(prev => prev.filter(id => id !== productId));
    }
  };

  // Add a product to cart
  const addToCart = async (product: Product) => {
    try {
      setAddingToCartIds(prev => [...prev, product.id]);
      
      // Check if product is in stock
      if (product.stockQuantity <= 0) {
        toast.error('Sản phẩm đã hết hàng');
        setAddingToCartIds(prev => prev.filter(id => id !== product.id));
        return;
      }
      
      // Mô phỏng độ trễ API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
      
      // Ask if user wants to go to cart
      const result = await Swal.fire({
        title: 'Thêm vào giỏ hàng thành công!',
        text: 'Bạn có muốn đến giỏ hàng ngay bây giờ?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Đến giỏ hàng',
        cancelButtonText: 'Tiếp tục mua sắm'
      });
      
      if (result.isConfirmed) {
        navigate('/cart');
      }
    } catch (err) {
      toast.error('Thêm vào giỏ hàng thất bại');
      console.error('Error adding product to cart:', err);
    } finally {
      setAddingToCartIds(prev => prev.filter(id => id !== product.id));
    }
  };

  // Calculate final price with discount
  const calculateFinalPrice = (product: Product) => {
    if (!product.discount || !product.discount.discountPercentage) {
      return product.price;
    }
    
    return product.price * (1 - product.discount.discountPercentage / 100);
  };

  // Get user data for the sidebar
  const userData = getUserResponseFromLocalStorage();

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row">
        {/* Sidebar */}
        <UserSidebar userData={userData} />
        
        {/* Main Content */}
        <div className="w-full md:w-3/4 mt-3 md:mt-0 space-y-4 ml-0 md:ml-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <div className="flex items-center mb-4 sm:mb-0">
                <Heart className="text-red-500 mr-2" size={24} />
                <h1 className="text-xl font-bold">Sản phẩm yêu thích</h1>
              </div>
              
              {/* Search */}
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>
              </div>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex items-center">
                  <AlertCircle className="text-red-500 mr-2" size={24} />
                  <p className="text-red-500">{error}</p>
                </div>
              </div>
            )}
            
            {/* Loading state */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-pulse">
                    <div className="h-40 bg-gray-200 w-full"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                      <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                      <div className="flex justify-between">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-8 bg-red-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Chưa có sản phẩm yêu thích nào</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? 'Không tìm thấy sản phẩm phù hợp với tìm kiếm của bạn.' : 'Hãy thêm sản phẩm vào yêu thích để xem tại đây.'}
                </p>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Khám phá sản phẩm
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    {/* Product Image */}
                    <div 
                      className="h-40 bg-gray-100 relative cursor-pointer"
                      onClick={() => navigate(`/product?id=${product.id}`)}
                    >
                      <img 
                        src={product.imageUrl} 
                        alt={product.productName}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                      
                      {/* Discount badge */}
                      {product.discount && product.discount.discountPercentage > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount.discountPercentage}%
                        </span>
                      )}
                      
                      {/* Out of stock badge */}
                      {product.stockQuantity <= 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Hết hàng
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <h3 
                        className="font-medium text-gray-900 mb-1 line-clamp-2 min-h-[48px] cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => navigate(`/product?id=${product.id}`)}
                      >
                        {product.productName}
                      </h3>
                      
                      {/* Price */}
                      <div className="mb-4 flex items-center">
                        <span className="font-semibold text-red-500 text-lg">
                          {calculateFinalPrice(product).toLocaleString('vi-VN')}đ
                        </span>
                        
                        {product.discount && product.discount.discountPercentage > 0 && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {product.price.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex justify-between gap-2">
                        <button 
                          onClick={() => removeFromFavorites(product.id)}
                          className="flex items-center justify-center border border-gray-300 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 flex-1 cursor-pointer"
                          disabled={removingProductIds.includes(product.id)}
                        >
                          {removingProductIds.includes(product.id) ? (
                            <Loader className="animate-spin h-4 w-4" />
                          ) : (
                            <>
                              <Trash2 size={16} className="mr-1" />
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => addToCart(product)}
                          className={`flex items-center justify-center px-3 py-2 rounded-md flex-1 transition-colors duration-200 cursor-pointer ${
                            product.stockQuantity <= 0 
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                          disabled={product.stockQuantity <= 0 || addingToCartIds.includes(product.id)}
                        >
                          {addingToCartIds.includes(product.id) ? (
                            <Loader className="animate-spin h-4 w-4 text-white" />
                          ) : (
                            <>
                              <ShoppingCart size={16} className="mr-1" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;