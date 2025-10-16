import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Truck, RefreshCcw, Gift, Plus, Minus, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Swal from 'sweetalert2';
import { Trash2, Edit, Loader, Heart } from 'lucide-react';

import { getProductById } from "@/services/productService";
import { addToCart } from "@/services/cartService";
import { useAuthStore } from "@/stores/useAuthStore";
import { AddToCartPayload } from "@/types/cart";
import { ProductDetail, Variant as ProductVariant, Size, Color } from "@/types/product";

interface Brand {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  category?: Category; // parent category
}

interface RelatedProduct {
  id: number;
  name: string;
  imageUrl: string;
  basePrice: number;
  stockQuantity: number;
  category: Category;
  brand: Brand;
}

interface Review {
  id: number;
  comment: string;
  rating: number;
  createdAt: string | number[];
  updatedAt: string;
  user: {
    id: number;
    username: string;
    full_name: string;
    avatar_url: string;
  };
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

// Dữ liệu tĩnh cho reviews
const staticReviewsData: Record<string, Review[]> = {
  '1': [
    {
      id: 1,
      comment: 'Chất liệu áo rất tốt, mặc thoáng mát. Kiểu dáng đẹp, phù hợp đi làm.',
      rating: 5,
      createdAt: [2024, 9, 15, 10, 30, 0],
      updatedAt: '2024-09-15T10:30:00Z',
      user: { id: 1, username: 'nguyenvan', full_name: 'Nguyễn Văn A', avatar_url: 'https://i.pravatar.cc/150?img=1' }
    },
    {
      id: 2,
      comment: 'Màu sắc đẹp, size chuẩn. Giao hàng nhanh.',
      rating: 4,
      createdAt: [2024, 9, 20, 14, 15, 0],
      updatedAt: '2024-09-20T14:15:00Z',
      user: { id: 2, username: 'tranthib', full_name: 'Trần Thị B', avatar_url: 'https://i.pravatar.cc/150?img=2' }
    }
  ],
  '2': [
    {
      id: 3,
      comment: 'Áo thun mềm mại, form dáng đẹp. Giá cả hợp lý.',
      rating: 5,
      createdAt: [2024, 9, 18, 16, 45, 0],
      updatedAt: '2024-09-18T16:45:00Z',
      user: { id: 3, username: 'lethic', full_name: 'Lê Thị C', avatar_url: 'https://i.pravatar.cc/150?img=3' }
    }
  ],
  '3': [
    {
      id: 4,
      comment: 'Túi chất lượng tốt, nhiều ngăn tiện dụng. Rất thích hợp đi gym.',
      rating: 5,
      createdAt: [2024, 9, 25, 9, 20, 0],
      updatedAt: '2024-09-25T09:20:00Z',
      user: { id: 4, username: 'phamvand', full_name: 'Phạm Văn D', avatar_url: 'https://i.pravatar.cc/150?img=4' }
    }
  ],
  '4': [
    {
      id: 5,
      comment: 'Giày rất êm, chạy bộ cả ngày không mệt chân. Thiết kế đẹp.',
      rating: 5,
      createdAt: [2024, 9, 22, 8, 10, 0],
      updatedAt: '2024-09-22T08:10:00Z',
      user: { id: 5, username: 'hoangthie', full_name: 'Hoàng Thị E', avatar_url: 'https://i.pravatar.cc/150?img=5' }
    }
  ]
};

// Dữ liệu tĩnh cho related products
const staticRelatedProducts: RelatedProduct[] = [
  {
    id: 5,
    name: 'Quần Short Thể Thao Nam',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    basePrice: 299000,
    stockQuantity: 35,
    category: { id: 5, name: 'Quần nam', description: 'Quần áo nam thể thao' },
    brand: { id: 1, name: 'DAVINCI Fashion', description: 'Thương hiệu thời trang Việt Nam' }
  },
  {
    id: 6,
    name: 'Áo Khoác Bomber Nữ',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    basePrice: 659000,
    stockQuantity: 18,
    category: { id: 6, name: 'Áo khoác nữ', description: 'Áo khoác nữ thời trang' },
    brand: { id: 1, name: 'DAVINCI Fashion', description: 'Thương hiệu thời trang Việt Nam' }
  },
  {
    id: 7,
    name: 'Găng Tay Tập Gym',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    basePrice: 249000,
    stockQuantity: 42,
    category: { id: 7, name: 'Đồ tập gym', description: 'Phụ kiện tập gym' },
    brand: { id: 4, name: 'FitGear', description: 'Chuyên phụ kiện thể thao' }
  },
  {
    id: 8,
    name: 'Quần Jeans Skinny Nam',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    basePrice: 799000,
    stockQuantity: 23,
    category: { id: 5, name: 'Quần nam', description: 'Quần jeans cao cấp' },
    brand: { id: 5, name: 'Denim Pro', description: 'Chuyên quần jeans' }
  },
  {
    id: 9,
    name: 'Váy Maxi Hoa Nhí',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    basePrice: 545000,
    stockQuantity: 15,
    category: { id: 8, name: 'Váy nữ', description: 'Váy thời trang' },
    brand: { id: 1, name: 'DAVINCI Fashion', description: 'Thương hiệu thời trang Việt Nam' }
  },
  {
    id: 10,
    name: 'Giày Sneaker Trắng',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    basePrice: 1299000,
    stockQuantity: 30,
    category: { id: 4, name: 'Giày thể thao', description: 'Giày sneaker thời trang' },
    brand: { id: 2, name: 'Nike', description: 'Thương hiệu thể thao toàn cầu' }
  },
  {
    id: 11,
    name: 'Áo Hoodie Unisex',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
    basePrice: 699000,
    stockQuantity: 28,
    category: { id: 9, name: 'Áo hoodie', description: 'Áo hoodie unisex' },
    brand: { id: 6, name: 'UrbanWear', description: 'Thời trang đường phố' }
  },
  {
    id: 12,
    name: 'Balo Laptop Cao Cấp',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    basePrice: 1199000,
    stockQuantity: 20,
    category: { id: 3, name: 'Phụ kiện thể thao', description: 'Balo và túi xách' },
    brand: { id: 7, name: 'TechBag', description: 'Chuyên balo công nghệ' }
  },
  {
    id: 13,
    name: 'Đồng Hồ Thể Thao',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400',
    basePrice: 2299000,
    stockQuantity: 12,
    category: { id: 10, name: 'Phụ kiện', description: 'Đồng hồ và trang sức' },
    brand: { id: 8, name: 'SportTime', description: 'Đồng hồ thể thao' }
  },
  {
    id: 14,
    name: 'Kính Mát Thời Trang',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    basePrice: 899000,
    stockQuantity: 25,
    category: { id: 10, name: 'Phụ kiện', description: 'Kính mát và phụ kiện' },
    brand: { id: 9, name: 'SunStyle', description: 'Kính mát thời trang' }
  }
];

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { authUser } = useAuthStore();

  //Product
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>(staticRelatedProducts);
  const [detailedDescription, setDetailedDescription] = useState('');

  //User / Review
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const isLoadingReviews = false;

  // Address
  const [userAddress, setUserAddress] = useState("Phường Bến Nghé, Quận 1, Hồ Chí Minh");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("Thứ 2 - 07/10");

  //Description
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDescriptionOverflow, setIsDescriptionOverflow] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // Thêm state để theo dõi số lượng trong giỏ
  const [cartQuantity, setCartQuantity] = useState<number>(0);
  const [maxQuantityAvailable, setMaxQuantityAvailable] = useState<number>(0);

  //Favorite
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [processingFavorite, setProcessingFavorite] = useState<boolean>(false);

  // Thêm state cho lightbox (đặt trong component)
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxMedia, setLightboxMedia] = useState<string>("");
  const [lightboxType, setLightboxType] = useState<"image" | "video">("image");
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState<number>(0);
  const [allMedia, setAllMedia] = useState<{ url: string, type: "image" | "video" }[]>([]);

  const [scrollX, setScrollX] = useState(0);

  const scrollLeft = () => {
    setScrollX(scrollX + 300);
  };

  const scrollRight = () => {
    setScrollX(scrollX - 300);
  };

  useEffect(() => {
    const fetchProduct = async (productId: number) => {
      const toastId = toast.loading("Đang tải sản phẩm...");
      try {
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);

        const mainImage = fetchedProduct.primaryImageUrl || fetchedProduct.imageUrls?.[0] || '';
        setSelectedImage(mainImage);

        if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
          const defaultVariant = fetchedProduct.variants[0];
          setSelectedVariant(defaultVariant);
          setSelectedSize(defaultVariant.size);
          setSelectedColor(defaultVariant.color);
        }

        const productReviews = staticReviewsData[fetchedProduct.id.toString()] || [];
        setReviews(productReviews);

        const descriptionHtml = `
          <p>${fetchedProduct.description}</p>
          <br/>
          <h4><strong>Thông tin chi tiết sản phẩm:</strong></h4>
          <ul>
            <li><strong>Thương hiệu:</strong> ${fetchedProduct.brand.name}</li>
            <li><strong>Danh mục:</strong> ${fetchedProduct.category.name}</li>
            <li><strong>Chất liệu:</strong> ${fetchedProduct.availableMaterials.join(', ')}</li>
            <li><strong>Đánh giá:</strong> ${fetchedProduct.averageRating.toFixed(1)}/5 sao từ ${fetchedProduct.reviewCount} lượt đánh giá.</li>
            <li><strong>Lượt mua:</strong> ${fetchedProduct.orderCount} sản phẩm đã được bán.</li>
          </ul>
          <br/>
          <p>Sản phẩm đến từ thương hiệu <strong>${fetchedProduct.brand.name}</strong>, ${fetchedProduct.brand.description}.</p>
          <p>Thuộc danh mục <strong>${fetchedProduct.rootCategory.name} > ${fetchedProduct.category.name}</strong>.</p>
        `;
        setDetailedDescription(descriptionHtml);

        document.title = `${fetchedProduct.name} | DAVINCI`;
        toast.success("Tải sản phẩm thành công!", { id: toastId });

      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
        toast.error("Không thể tải được sản phẩm.", { id: toastId });
      }
    };

    if (id) {
      const productId = parseInt(id, 10);
      if (!isNaN(productId)) {
        fetchProduct(productId);
      }
    }
  }, [id]);

  /**
   * Helper function to get available sizes for the product
   */
  const getAvailableSizes = (): Size[] => {
    if (!product?.variants) return [];
    const sizes = product.variants.map(variant => variant.size);
    return Array.from(new Map(sizes.map(size => [size.id, size])).values());
  };

  /**
   * Helper function to get available colors for selected size
   */
  const getAvailableColors = (sizeId?: number): Color[] => {
    if (!product?.variants) return [];
    let filteredVariants = product.variants;
    if (sizeId) {
      filteredVariants = product.variants.filter(variant => variant.size.id === sizeId);
    }
    const colors = filteredVariants.map(variant => variant.color);
    return Array.from(new Map(colors.map(color => [color.id, color])).values());
  };

  /**
   * Helper function to get variant by size and color
   */
  const getVariantBySizeAndColor = (sizeId: number, colorId: number): ProductVariant | null => {
    if (!product?.variants) return null;
    return product.variants.find(variant => 
      variant.size.id === sizeId && variant.color.id === colorId
    ) || null;
  };

  // Hàm mở lightbox
  const openLightbox = (mediaUrl: string) => {
    setLightboxMedia(mediaUrl);
    setLightboxType(mediaUrl.endsWith('.mp4') ? 'video' : 'image');

    // Tìm index của media được click trong mảng allMedia
    const index = allMedia.findIndex(item => item.url === mediaUrl);
    setCurrentLightboxIndex(index >= 0 ? index : 0);

    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Ngăn cuộn khi lightbox mở
  };

  // Hàm đóng lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = ''; // Restore scrolling
  };

  // Hàm điều hướng giữa các hình ảnh trong lightbox
  const navigateLightbox = (direction: 'next' | 'prev') => {
    if (!allMedia.length) return;

    let newIndex = currentLightboxIndex;

    if (direction === 'next') {
      newIndex = (currentLightboxIndex + 1) % allMedia.length;
    } else {
      newIndex = (currentLightboxIndex - 1 + allMedia.length) % allMedia.length;
    }

    // Cập nhật media và loại media
    setLightboxMedia(allMedia[newIndex].url);
    setLightboxType(allMedia[newIndex].type);
    setCurrentLightboxIndex(newIndex);
  };

  // Thêm bắt sự kiện phím để điều hướng bằng bàn phím
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          navigateLightbox('prev');
          break;
        case 'ArrowRight':
          navigateLightbox('next');
          break;
        case 'Escape':
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [lightboxOpen, currentLightboxIndex, allMedia]);

  useEffect(() => {
    if (!product) return;
    
    // Mock cart data
    setCartQuantity(0); // Chưa có trong giỏ
    
    // Calculate max quantity based on selected variant or total stock
    const totalStock = selectedVariant?.stockQuantity || product.totalStock || 0;
    setMaxQuantityAvailable(totalStock);
  }, [product, selectedVariant, authUser]);

  // Comment: Mock submit review function
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    try {
      // Mock thêm review mới
      const newReview: Review = {
        id: Math.floor(Math.random() * 1000),
        comment: reviewText,
        rating: rating,
        createdAt: [2024, 10, 5, 14, 30, 0],
        updatedAt: new Date().toISOString(),
        user: {
          id: 1,
          username: 'testuser',
          full_name: 'Người dùng test',
          avatar_url: 'https://i.pravatar.cc/150?img=1'
        }
      };

      // Thêm vào đầu danh sách reviews
      setReviews(prev => [newReview, ...prev]);

      // Reset form
      setRating(5);
      setReviewText('');

      toast.success('Cảm ơn bạn đã gửi đánh giá!');
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error('Không thể gửi đánh giá. Vui lòng thử lại sau.');
    }
  };

  const handleEditReview = async (reviewId: number, currentContent: string) => {
    const { value: newContent } = await Swal.fire({
      title: 'Chỉnh sửa đánh giá',
      input: 'textarea',
      inputValue: currentContent,
      inputPlaceholder: 'Nhập đánh giá mới của bạn',
      showCancelButton: true,
      confirmButtonText: 'Lưu',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      inputValidator: (value) => {
        if (!value) {
          return 'Vui lòng nhập nội dung đánh giá!';
        }
        return null;
      }
    });

    if (newContent) {
      try {
        // Mock update review
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { ...review, comment: newContent }
            : review
        ));
        toast.success('Đánh giá đã được cập nhật!');
      } catch (error) {
        console.error("Error updating review:", error);
        toast.error('Không thể cập nhật đánh giá. Vui lòng thử lại sau.');
      }
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    const result = await Swal.fire({
      title: 'Xóa đánh giá?',
      text: 'Bạn có chắc chắn muốn xóa đánh giá này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
    });

    if (result.isConfirmed) {
      try {
        // Mock delete review
        setReviews(prev => prev.filter(review => review.id !== reviewId));
        toast.success('Đánh giá đã được xóa!');
      } catch (error) {
        console.error("Error deleting review:", error);
        toast.error('Không thể xóa đánh giá. Vui lòng thử lại sau.');
      }
    }
  };

  const formatDate = (dateInput: string | number[]): string => {
    let date: Date;

    if (Array.isArray(dateInput)) {
      // Handle array format [year, month, day, hour, minute, second]
      const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
      // Note: JavaScript months are 0-indexed (0 = January, 11 = December)
      // But it looks like the input array has 1-indexed months, so we subtract 1
      date = new Date(year, month - 1, day, hour, minute, second);
    } else {
      // Handle string format
      date = new Date(dateInput);
    }

    // Return formatted date
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Thay thế hàm getUserLocation hiện tại bằng hàm sau
  const getUserLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Sử dụng Nominatim API (OpenStreetMap) - hoàn toàn miễn phí
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1&accept-language=vi`
            );
            const data = await response.json();

            if (data && data.address) {
              // Lấy thông tin địa chỉ từ kết quả
              const road = data.address.road || '';
              const ward = data.address.neighbourhood || data.address.quarter || '';
              const district = data.address.city_district || data.address.district || data.address.suburb || '';
              const city = data.address.city || data.address.state || data.address.province || '';

              // Tạo chuỗi địa chỉ
              const addressParts = [road, ward, district, city].filter(Boolean);
              const formattedAddress = addressParts.length > 0
                ? addressParts.join(', ')
                : "Phường Bến Nghé, Quận 1, Hồ Chí Minh";

              setUserAddress(formattedAddress);
              localStorage.setItem('userAddress', formattedAddress);
            } else {
              throw new Error("Không thể phân tích địa chỉ");
            }
          } catch (error) {
            console.error("Không thể lấy địa chỉ từ tọa độ:", error);
            toast.error("Không thể xác định địa chỉ của bạn. Vui lòng thử lại.");
            setUserAddress("Phường Bến Nghé, Quận 1, Hồ Chí Minh");
          } finally {
            setLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Lỗi định vị:", error);
          setLoadingLocation(false);

          // Hiển thị thông báo lỗi phù hợp
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              toast.error("Vui lòng cấp quyền truy cập vị trí để xác định địa chỉ của bạn.");
              break;
            case 2: // POSITION_UNAVAILABLE
              toast.error("Không thể xác định vị trí của bạn. Vui lòng thử lại sau.");
              break;
            case 3: // TIMEOUT
              toast.error("Đã hết thời gian chờ xác định vị trí. Vui lòng thử lại.");
              break;
            default:
              toast.error("Đã xảy ra lỗi khi xác định vị trí của bạn.");
          }
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setLoadingLocation(false);
      toast.error("Trình duyệt của bạn không hỗ trợ định vị.");
    }
  };

  // Hàm tính toán thời gian giao hàng
  const predictDeliveryTime = async (userAddress: string) => {
    try {
      // Chuyển đổi địa chỉ cửa hàng và người dùng thành tọa độ
      const storeAddress = "12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, Hồ Chí Minh";

      // Lấy tọa độ của cửa hàng
      const storeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(storeAddress)}&limit=1`
      );
      const storeData = await storeResponse.json();

      // Lấy tọa độ của người dùng
      const userResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(userAddress)}&limit=1`
      );
      const userData = await userResponse.json();

      if (!storeData.length || !userData.length) {
        return "3-5 ngày tới"; // Trả về ước tính mặc định
      }

      // Sử dụng OSRM API để tính toán thời gian
      const storeCoords = `${storeData[0].lon},${storeData[0].lat}`;
      const userCoords = `${userData[0].lon},${userData[0].lat}`;

      const routeResponse = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${storeCoords};${userCoords}?overview=false`
      );
      const routeData = await routeResponse.json();

      if (routeData.routes && routeData.routes.length > 0) {
        // Thời gian di chuyển (giây)
        const durationInSeconds = routeData.routes[0].duration;

        // Tính toán ngày giao hàng dự kiến
        const processingTime = 24; // Giờ xử lý đơn hàng
        const durationInHours = durationInSeconds / 3600;

        // Tùy thuộc vào khoảng cách, điều chỉnh thời gian giao hàng
        let deliveryDays;
        if (durationInHours < 0.5) {
          deliveryDays = 1; // Giao hàng trong ngày nếu gần
        } else if (durationInHours < 2) {
          deliveryDays = 2; // 2 ngày nếu trong thành phố
        } else {
          deliveryDays = 3; // 3 ngày nếu xa
        }

        // Tính ngày giao hàng
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

        // Format kết quả
        const dayNames = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
        const dayOfWeek = dayNames[deliveryDate.getDay()];
        const formattedDate = `${deliveryDate.getDate().toString().padStart(2, '0')}/${(deliveryDate.getMonth() + 1).toString().padStart(2, '0')}`;

        return `${dayOfWeek} - ${formattedDate}`;
      }

      return "3-5 ngày tới"; // Mặc định
    } catch (error) {
      console.error("Lỗi khi dự đoán thời gian giao hàng:", error);
      return "3-5 ngày tới"; // Mặc định nếu có lỗi
    }
  };

  useEffect(() => {
    // Chỉ tính toán khi đã có địa chỉ người dùng
    if (userAddress && userAddress !== "Chưa rõ địa chỉ.") {
      // Bọc trong một hàm async để sử dụng await
      const fetchDeliveryDate = async () => {
        const deliveryDate = await predictDeliveryTime(userAddress);
        setEstimatedDeliveryDate(deliveryDate);
      };
      fetchDeliveryDate();
    }
  }, [userAddress]);

  useEffect(() => {
    if (product) {
      // Tạo mảng chứa tất cả ảnh từ product images
      const mediaItems = (product.imageUrls || []).map(url => ({
        url: url,
        type: url.endsWith(".mp4") ? "video" as const : "image" as const
      }));
      setAllMedia(mediaItems);
    }
  }, [product]);

  // Thêm useEffect để kiểm tra chiều cao của mô tả
  useEffect(() => {
    if (descriptionRef.current) {
      // Kiểm tra xem mô tả có bị overflow không
      const isOverflow = descriptionRef.current.scrollHeight > 200; // 200px là chiều cao tối đa trước khi "Xem thêm"
      setIsDescriptionOverflow(isOverflow);
    }
  }, [product?.description, detailedDescription]);

  // Hàm toggle hiển thị mô tả đầy đủ
  const toggleDescriptionView = () => {
    setShowFullDescription(!showFullDescription);
  };

  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (isBuyNow = false) => {
    if (!product || !selectedVariant) {
        toast.error("Vui lòng chọn đầy đủ phiên bản sản phẩm (kích thước, màu sắc).");
        return;
    }

    if (quantity < 1) {
        toast.error("Số lượng phải lớn hơn 0!");
        return;
    }

    if (quantity > selectedVariant.stockQuantity) {
        toast.error("Số lượng vượt quá số lượng trong kho!");
        return;
    }

    // If user is NOT logged in
    if (!authUser) {
        // Handle "Buy Now" for guest
        if (isBuyNow) {
            const buyNowItem = {
                productId: product.id,
                productVariantId: selectedVariant.id,
                quantity: quantity,
            };
            // Store item and redirect to login
            localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
            toast.info("Vui lòng đăng nhập để mua ngay.");
            window.location.href = '/signin';
            return;
        }

        // Handle "Add to Cart" for guest
        const toastId = toast.loading("Đang thêm vào giỏ hàng...");
        try {
            const localCart: any[] = JSON.parse(localStorage.getItem("cart") || "[]");

            const existingItemIndex = localCart.findIndex(
                (item) => item.productVariantId === selectedVariant.id
            );

            if (existingItemIndex > -1) {
                const newQuantity = localCart[existingItemIndex].quantity + quantity;
                if (newQuantity > selectedVariant.stockQuantity) {
                    toast.error(`Số lượng tối đa cho sản phẩm này là ${selectedVariant.stockQuantity}. Bạn đã có ${localCart[existingItemIndex].quantity} trong giỏ hàng.`);
                    toast.dismiss(toastId);
                    return;
                }
                localCart[existingItemIndex].quantity = newQuantity;
            } else {
                const newItem = {
                    productId: product.id,
                    productVariantId: selectedVariant.id,
                    quantity: quantity,
                    name: product.name,
                    price: selectedVariant.price || product.basePrice,
                    imageUrl: selectedImage,
                    size: selectedSize?.name,
                    color: selectedColor?.name,
                    stockQuantity: selectedVariant.stockQuantity,
                    sku: selectedVariant.sku,
                    brandName: product.brand.name,
                };
                localCart.push(newItem);
            }

            localStorage.setItem("cart", JSON.stringify(localCart));
            toast.success("Đã thêm sản phẩm vào giỏ hàng!", { id: toastId });

            Swal.fire({
                title: 'Thành công!',
                text: 'Sản phẩm đã được thêm vào giỏ hàng tạm của bạn.',
                icon: 'success',
                confirmButtonColor: '#C92127',
                confirmButtonText: 'Xem giỏ hàng',
                showCancelButton: true,
                cancelButtonText: 'Tiếp tục mua sắm'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/cart';
                }
            });

        } catch (error) {
            console.error("Error adding to local cart:", error);
            toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại.", { id: toastId });
        }
        return;
    }

    // --- Logic for LOGGED IN user ---
    setIsAddingToCart(true);
    const toastId = toast.loading("Đang thêm vào giỏ hàng...");

    try {
        const payload: AddToCartPayload = {
            userId: authUser.id,
            productId: product.id,
            productVariantId: selectedVariant.id,
            quantity: quantity,
        };

        await addToCart(payload);

        toast.success("Đã thêm sản phẩm vào giỏ hàng!", { id: toastId });

        if (isBuyNow) {
            window.location.href = '/cart';
        } else {
            Swal.fire({
                title: 'Thành công!',
                text: 'Đã thêm sản phẩm vào giỏ hàng',
                icon: 'success',
                confirmButtonColor: '#C92127',
                confirmButtonText: 'Xem giỏ hàng',
                showCancelButton: true,
                cancelButtonText: 'Tiếp tục mua sắm'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/cart';
                }
            });
        }
    } catch (error: any) {
        console.error("Error adding to cart:", error);
        const errorMessage = error.response?.data?.message || error.message || "Không thể thêm vào giỏ hàng. Vui lòng thử lại.";
        toast.error(errorMessage, { id: toastId });
        Swal.fire({
            title: 'Lỗi!',
            text: errorMessage,
            icon: 'error',
            confirmButtonColor: '#C92127',
        });
    } finally {
        setIsAddingToCart(false);
    }
  };



  if (!product) {
    return (
      <div className="container mx-auto px-4 lg:max-w-7xl py-8">
        <div className="flex flex-col items-center justify-center">

          {/* Skeleton UI */}
          <div className="w-full mt-8 flex flex-col md:flex-row gap-6">
            {/* Left column - Image skeleton */}
            <div className="w-full md:w-2/5 bg-white rounded-lg shadow-lg p-4">
              <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="flex mt-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-16 h-16 bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-1/2"></div>
                <div className="h-10 bg-red-200 animate-pulse rounded-lg w-1/2"></div>
              </div>
            </div>

            {/* Right column - Info skeletons */}
            <div className="w-full md:w-3/5">
              {/* Product info skeleton */}
              <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4 mb-4"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-1/2 mb-3"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-2/3 mb-3"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-1/3 mb-5"></div>
                <div className="h-8 bg-red-200 animate-pulse rounded w-1/4"></div>
              </div>

              {/* Shipping info skeleton */}
              <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4 mb-4"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-full mb-3"></div>
                <div className="h-5 bg-gray-200 animate-pulse rounded w-2/3 mb-3"></div>
              </div>

              {/* Product detail skeleton */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3 mb-4"></div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between mb-2">
                    <div className="w-1/4 h-5 bg-gray-200 animate-pulse rounded"></div>
                    <div className="w-1/3 h-5 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:max-w-7xl">
      {/* Product Section */}
      <div className="flex flex-col p-4 md:p-6 rounded-lg shadow-lg bg-gray-200">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:relative">
          {/* Left Column */}
          <div className="w-full md:w-2/5 md:self-start md:sticky md:top-6" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
            {/* Image Section */}
            <div className="flex flex-col items-center p-4 bg-white md:p-6 rounded-lg shadow-lg md:max-h-[calc(100vh-3rem)] md:overflow-y-auto">
              {/* Ảnh lớn */}
              <div className="w-full h-[270px] flex items-center justify-center overflow-hidden" onClick={() => openLightbox(selectedImage)}>
                {selectedImage.endsWith(".mp4") ? (
                  <video
                    src={selectedImage}
                    controls
                    playsInline
                    preload="metadata"
                    className="object-contain h-full"
                    aria-label={`Video of ${product.name}`}
                  />
                ) : (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="object-contain h-full"
                    loading="eager"
                  />
                )}
              </div>

              {/* Ảnh nhỏ */}
              <div className="flex flex-nowrap overflow-x-auto overflow-y-hidden justify-start w-full p-2 mt-4 bg-gray-200 rounded-lg md:mt-6 gap-2 hide-scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                style={{ height: '90px', maxHeight: '90px' }}
              >
                {/* Hiển thị tất cả ảnh từ product.images */}
                {(product.imageUrls || [])
                  .map((imageUrl, index) =>
                  imageUrl.endsWith(".mp4") ? (
                    <div
                      key={index}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-lg border cursor-pointer flex-shrink-0 relative ${selectedImage === imageUrl ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200 hover:border-blue-300"}
                        }`}
                      onMouseEnter={() => setSelectedImage(imageUrl)}
                      onClick={() => {
                        setSelectedImage(imageUrl);
                        openLightbox(imageUrl);
                      }}
                      aria-label="Product video thumbnail"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedImage(imageUrl);
                          openLightbox(imageUrl);
                        }
                      }}
                    >
                      <video
                        src={imageUrl}
                        preload="metadata"
                        className="object-cover w-full h-full rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black rounded-lg bg-opacity-20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-lg border cursor-pointer flex-shrink-0 ${selectedImage === imageUrl ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200 hover:border-blue-300"}
                        }`}
                      onMouseEnter={() => setSelectedImage(imageUrl)}
                      onClick={() => {
                        setSelectedImage(imageUrl);
                        openLightbox(imageUrl);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedImage(imageUrl);
                          openLightbox(imageUrl);
                        }
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt="Product image"
                        loading="lazy"
                        className="object-contain w-full h-full rounded-lg"
                      />
                    </div>
                  )
                )}
              </div>

              {lightboxOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
                  onClick={closeLightbox}
                >
                  <div className="relative w-full max-w-4xl max-h-full">
                    {/* Navigation Buttons */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateLightbox('prev');
                      }}
                      className="absolute z-10 p-2 text-white transition-all transform -translate-y-1/2 bg-black/30 rounded-full cursor-pointer left-2 top-1/2 hover:bg-black/50"
                      aria-label="Previous image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateLightbox('next');
                      }}
                      className="absolute z-10 p-2 text-white transition-all transform -translate-y-1/2 bg-black/30 rounded-full cursor-pointer right-2 top-1/2 hover:bg-black/50"
                      aria-label="Next image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Close button */}
                    <button
                      onClick={closeLightbox}
                      className="absolute right-0 text-white transition-colors cursor-pointer -top-10 hover:text-gray-300"
                      aria-label="Close lightbox"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Media content */}
                    <div
                      className="flex items-center justify-center w-full h-full"
                      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on media
                    >
                      {lightboxType === 'image' ? (
                        <img
                          src={lightboxMedia}
                          alt={product.name}
                          className="object-contain mx-auto max-w-full max-h-[70vh]"
                        />
                      ) : (
                        <div className="overflow-hidden bg-black rounded-lg">
                          <video
                            src={lightboxMedia}
                            className="mx-auto max-w-full max-h-[70vh]"
                            controls
                            autoPlay
                            controlsList="nodownload"
                          />
                        </div>
                      )}
                    </div>

                    {/* Caption & Image counter */}
                    <div className="flex flex-col mt-4 text-center text-white">
                      <span className="mb-1 text-sm">
                        {currentLightboxIndex + 1}/{allMedia.length}
                      </span>
                      <p className="mx-auto truncate max-w-md">{product.name}</p>
                    </div>

                    {/* Thumbnail Navigation (Optional for larger screens) */}
                    <div className="hidden py-2 mt-4 overflow-x-auto md:flex justify-center gap-2 max-w-full">
                      {allMedia.map((media, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxMedia(media.url);
                            setLightboxType(media.url.endsWith('.mp4') ? 'video' : 'image');
                            setCurrentLightboxIndex(index);
                          }}
                          className={`w-12 h-12 border-2 flex-shrink-0 cursor-pointer ${lightboxMedia === media.url ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}
                            } transition-all rounded-md overflow-hidden focus:outline-none`}
                          aria-label={`View image ${index + 1}`}
                        >
                          {media.url.endsWith('.mp4') ? (
                            <div className="relative w-full h-full">
                              <video
                                src={media.url}
                                className="object-cover w-full h-full"
                                preload="metadata"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={media.url}
                              alt=""
                              className="object-cover w-full h-full"
                              loading="lazy"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex w-full gap-4 mt-6">
                <button
                  className={`w-full px-2 py-2 text-red-500 border border-red-500 rounded-lg ${isAddingToCart ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-red-50'
                    }`}
                  onClick={() => handleAddToCart(false)}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 mr-2 border-b-2 border-red-500 rounded-full animate-spin"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    '🛒 Thêm vào giỏ hàng'
                  )}
                </button>
                <button
                  className={`w-full px-2 py-2 bg-red-500 rounded-lg ${isAddingToCart ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-red-600 text-white'
                    }`}
                  onClick={() => handleAddToCart(true)}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? 'Đang xử lý...' : 'Mua ngay'}
                </button>
              </div>

              {/* Details Section */}
              <div className="w-full mt-4 rounded-lg">
                <div className="flex items-center gap-3 font-semibold">
                  <p>Chính sách ưu đãi của DAVINCI:</p>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Truck className="text-red-500" />
                  <p className="font-semibold">Thời gian giao hàng: <span className="font-normal">Giao nhanh và uy tín</span></p>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <RefreshCcw className="text-red-500" />
                  <p className="font-semibold">Chính sách đổi trả: <span className="font-normal">Đổi trả miễn phí toàn quốc</span></p>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Gift className="text-red-500" />
                  <p className="font-semibold">Chính sách khách sỉ: <span className="font-normal">Ưu đãi khi mua số lượng lớn</span></p>
                </div>
              </div>



            </div>

          </div>

          {/* Right Column */}
          <div className="w-full md:w-3/5 md:flex md:flex-col">
            {/* Product Info */}
            <div className="p-4 bg-white md:p-6 rounded-lg shadow-lg">
              <div className="flex items-start justify-between">
                <h1 className="text-base font-bold break-words md:text-xl">
                  {product.name}
                </h1>

                <button
                  onClick={() => {}}
                  disabled={processingFavorite}
                  className={`ml-2 p-2 rounded-full transition-all ${isFavorite ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-50'}
                    } ${processingFavorite ? 'cursor-wait opacity-60' : 'cursor-pointer'}`}
                  title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                >
                  {processingFavorite ? (
                    <div className="w-5 h-5 border-2 rounded-full animate-spin border-t-red-500 border-r-red-500 border-b-red-500 border-l-transparent"></div>
                  ) : isFavorite ? (
                    <Heart className="w-5 h-5 fill-red-500 stroke-red-500" />
                  ) : (
                    <Heart className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Rating and Sales Info - Modern Design */}
              <div className="flex flex-wrap gap-3 mt-2">
                {/* Rating Section */}
                <div className="flex items-center px-3 py-1.5 transition-all bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="flex mr-1.5">
                    {Array(5).fill(0).map((_, index) => (
                      <span
                        key={index}
                        className={`${product.averageRating > index ? "text-yellow-400" : "text-gray-300"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {product.averageRating.toFixed(1)}
                  </span>
                  <span className="mx-1 text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-600">{product.reviewCount} đánh giá</span>
                </div>

                {/* Sales Section */}
                <div className="flex items-center px-3 py-1.5 transition-all bg-gray-50 rounded-lg hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 text-blue-500">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  <span className="text-xs text-gray-600">Đã bán <span className="font-medium">{product.orderCount}</span></span>
                </div>

                {/* Favorites Section */}
                <div className="flex items-center px-3 py-1.5 transition-all bg-gray-50 rounded-lg hover:bg-gray-100">
                  <Heart className="w-3.5 h-3.5 mr-1.5 fill-red-500 stroke-red-500" />
                  <span className="text-xs text-gray-600"><span className="font-medium">{product.favoriteCount}</span> yêu thích</span>
                </div>
              </div>


              <div className="grid grid-cols-1 gap-3 mt-2 md:grid-cols-2 md:gap-1">

                <p className="text-xs text-gray-700 md:text-sm">
                  Thương hiệu: <span className="font-semibold text-blue-500 cursor-pointer">{product.brand.name}</span>
                </p>

                <p className="text-xs text-gray-700 md:text-sm">
                  Danh mục: <span className="font-semibold">{product.category.name}</span>
                </p>

                {selectedVariant && (
                  <>
                    <p className="text-xs text-gray-700 md:text-sm">
                      Chất liệu: <span className="font-semibold">{selectedVariant.material || 'Chưa cập nhật'}</span>
                    </p>

                    <p className="text-xs text-gray-700 md:text-sm">
                      SKU: <span className="font-semibold">{selectedVariant.sku}</span>
                    </p>
                  </>
                )}

              </div>

              {/* Price Section */}
              <div className="flex flex-wrap items-center gap-2 mt-3 md:gap-3">
                {(() => {
                  const basePrice = selectedVariant?.price || product.basePrice;
                  const discountPercent = product.currentDiscountPercent;

                  if (discountPercent && discountPercent > 0) {
                    const finalPrice = basePrice * (1 - discountPercent / 100);
                    return (
                      <>
                        <span className="text-xl font-semibold text-red-500 md:text-2xl">
                          {Math.round(finalPrice).toLocaleString('vi-VN')} đ
                        </span>
                        <span className="text-sm text-gray-500 line-through md:text-base">
                          {basePrice.toLocaleString('vi-VN')} đ
                        </span>
                        <span className="px-2 py-1 text-xs text-white bg-red-500 rounded">
                          -{discountPercent}%
                        </span>
                      </>
                    );
                  } else {
                    return (
                      <span className="text-xl font-semibold text-red-500 md:text-2xl">
                        {basePrice.toLocaleString('vi-VN')} đ
                      </span>
                    );
                  }
                })()}
              </div>

              {/* Availability Info */}
              <div className="p-2 mt-4 text-xs text-blue-600 bg-blue-100 rounded md:text-sm">
                Còn {selectedVariant?.stockQuantity || product.totalStock || 0} sản phẩm
              </div>
            </div>

            {/* Shipping Info */}
            <div className="p-4 mt-4 bg-white md:p-6 rounded-lg shadow-lg md:mt-6">
              <h2 className="text-base font-semibold md:text-lg">Thông tin vận chuyển</h2>
              <div className="flex flex-wrap items-center gap-1 mt-2 text-xs text-gray-700 md:gap-2 md:text-sm">
                <MapPin className="text-blue-500" size={16} />
                <p>
                  Giao hàng đến {" "}
                  <span className="font-semibold">
                    {loadingLocation ? (
                      <span className="inline-flex items-center">
                        <Loader size={12} className="mr-1 animate-spin" /> Đang xác định...
                      </span>
                    ) : (
                      userAddress
                    )}
                  </span>
                  <button
                    onClick={getUserLocation}
                    className="block mt-1 ml-1 text-blue-500 cursor-pointer md:inline md:mt-0 md:ml-2 hover:underline"
                  >
                    {loadingLocation ? "Đang xác định..." : "Xác định vị trí của tôi"}
                  </button>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1 mt-2 text-xs text-gray-700 md:gap-2 md:text-sm">
                <Truck className="text-green-500" size={16} />
                <p>Giao hàng tiêu chuẩn - Dự kiến giao <span className="font-semibold">{estimatedDeliveryDate}</span></p>
              </div>

              {/* Related Offers */}
              <h2 className="mt-4 text-base font-semibold md:text-lg">Ưu đãi liên quan <span className="text-xs text-blue-500 cursor-pointer md:text-sm">Xem thêm</span></h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="flex items-center px-2 py-1 text-xs bg-yellow-100 border rounded-lg md:px-3 md:text-sm">
                  <img className="w-3 h-3 mr-1 bg-yellow-500 md:w-4 md:h-4 md:mr-2" src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/event_cart_2/ico_promotion.svg?q=10908" alt="Promotion Icon" />
                  Giảm 10%
                </div>
                <div className="flex items-center px-2 py-1 text-xs bg-green-100 border rounded-lg md:px-3 md:text-sm">
                  <img className="w-3 h-3 mr-1 bg-green-500 md:w-4 md:h-4 md:mr-2" src="https://cdn0.fahasa.com/skin/frontend/ma_vanese/fahasa/images/event_cart_2/ico_freeship.svg?q=10908" alt="Promotion Icon" />
                  Mã freeship
                </div>
              </div>

              {/* Size and Color Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-4">
                  {/* Size Selection */}
                  <h3 className="mb-2 text-sm font-semibold md:text-base">Kích thước:</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {getAvailableSizes().map((size) => (
                      <button
                        key={size.id}
                        onClick={() => {
                          setSelectedSize(size);
                          const availableColors = getAvailableColors(size.id);
                          if (availableColors.length > 0) {
                            const newColor = selectedColor && availableColors.some(c => c.id === selectedColor.id) 
                              ? selectedColor 
                              : availableColors[0];
                            setSelectedColor(newColor);
                            const variant = getVariantBySizeAndColor(size.id, newColor.id);
                            setSelectedVariant(variant);
                          }
                        }}
                        className={`px-3 py-2 text-sm border rounded-lg transition-all ${
                          selectedSize?.id === size.id
                            ? 'border-red-500 bg-red-50 text-red-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>

                  {/* Color Selection */}
                  {selectedSize && (
                    <>
                      <h3 className="mb-2 text-sm font-semibold md:text-base">Màu sắc:</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getAvailableColors(selectedSize.id).map((color) => (
                          <button
                            key={color.id}
                            onClick={() => {
                              setSelectedColor(color);
                              const variant = getVariantBySizeAndColor(selectedSize.id, color.id);
                              setSelectedVariant(variant);
                            }}
                            className={`px-3 py-2 text-sm border rounded-lg transition-all ${
                              selectedColor?.id === color.id
                                ? 'border-red-500 bg-red-50 text-red-600'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {color.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Selected Variant Info */}
                  {selectedVariant && (
                    <div className="p-3 mb-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">SKU:</span> {selectedVariant.sku}
                        </div>
                        <div>
                          <span className="font-medium">Còn lại:</span> {selectedVariant.stockQuantity} sản phẩm
                        </div>
                        {selectedVariant.material && (
                          <div className="col-span-2">
                            <span className="font-medium">Chất liệu:</span> {selectedVariant.material}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <h2 className="mt-4 text-base font-semibold md:text-lg" id="quantity-label">Số lượng:</h2>
              <div className="flex items-center w-max mt-2 border border-gray-300 rounded-lg" role="group" aria-labelledby="quantity-label">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className={`p-1 md:p-2 border-r border-gray-300 flex items-center justify-center cursor-pointer ${quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}
                    }`}
                  aria-label="Giảm số lượng"
                  type="button"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      if (value < 1) {
                        setQuantity(1);
                      } else if (value > maxQuantityAvailable) {
                        setQuantity(maxQuantityAvailable);
                        const remainMsg = cartQuantity > 0
                          ? `(Bạn đã có ${cartQuantity} sản phẩm trong giỏ hàng)`
                          : '';
                        Swal.fire({
                          title: 'Thông báo',
                          text: `Số lượng tối đa có thể mua là ${maxQuantityAvailable} ${remainMsg}`,
                          icon: 'warning',
                          confirmButtonColor: '#C92127'
                        });
                      } else {
                        setQuantity(value);
                      }
                    }
                  }}
                  className="w-12 text-sm text-center border-none md:w-16 focus:outline-none md:text-base"
                  min="1"
                  max={maxQuantityAvailable}
                  aria-label="Số lượng sản phẩm"
                />
                <button
                  onClick={() => {
                    if (quantity < maxQuantityAvailable) {
                      setQuantity(quantity + 1);
                    } else {
                      const remainMsg = cartQuantity > 0
                        ? `(Bạn đã có ${cartQuantity} sản phẩm trong giỏ hàng)`
                        : '';
                      Swal.fire({
                        title: 'Thông báo',
                        text: `Số lượng tối đa có thể mua là ${maxQuantityAvailable} ${remainMsg}`,
                        icon: 'warning',
                        confirmButtonColor: '#C92127'
                      });
                    }
                  }}
                  disabled={quantity >= maxQuantityAvailable}
                  className={`p-1 md:p-2 border-l border-gray-300 flex items-center justify-center cursor-pointer ${quantity >= maxQuantityAvailable ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}
                    }`}
                  aria-label="Tăng số lượng"
                  type="button"
                >
                  <Plus size={14} />
                </button>
              </div>

              {cartQuantity > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  Bạn đã có {cartQuantity} sản phẩm trong giỏ hàng
                </p>
              )}

            </div>

            {/* Product Detail */}
            <div className="p-4 mt-4 bg-white md:p-6 rounded-lg shadow-lg md:mt-6">
              <h2 className="mb-3 text-base font-semibold md:mb-4 md:text-lg">Thông tin chi tiết</h2>
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                <DetailRow label="Mã sản phẩm" value={product.id.toString()} />
                <DetailRow label="Tên sản phẩm" value={product.name} />
                <DetailRow label="Thương hiệu" value={<a href="#" className="text-blue-500">{product.brand.name}</a>} />
                <DetailRow label="Danh mục" value={product.category.name} />
                <DetailRow label="Trạng thái" value={product.status === 'ACTIVE' ? 'Còn hàng' : 'Hết hàng'} />
                
                {selectedVariant && (
                  <>
                    <DetailRow label="SKU" value={selectedVariant.sku} />
                    <DetailRow label="Size" value={selectedVariant.size.name} />
                    <DetailRow label="Màu sắc" value={selectedVariant.color.name} />
                    <DetailRow label="Chất liệu" value={selectedVariant.material || 'Chưa cập nhật'} />
                    <DetailRow label="Số lượng trong kho" value={selectedVariant.stockQuantity.toString()} />
                  </>
                )}

                {!selectedVariant && product.variants && (
                  <DetailRow 
                    label="Tổng số lượng" 
                    value={product.totalStock.toString()} 
                  />
                )}
              </div>
              <p className="mt-3 text-xs md:mt-4 md:text-sm">
                Sản phẩm bán chạy nhất: <a href="#" className="text-blue-500">Top 100 sản phẩm thời trang của tháng</a>
              </p>
              <p className="mt-2 text-xs text-gray-600 md:text-sm">
                Giá sản phẩm đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tùy vào loại sản phẩm, hình thức
                và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như Phụ phí đóng gói, phí vận chuyển, phụ phí hàng cồng kềnh,...
              </p>
              <p className="mt-2 text-xs font-semibold text-red-500 md:text-sm">
                Chính sách khuyến mãi không áp dụng cho Hệ thống Cửa hàng thời trang trên toàn quốc
              </p>
            </div>

            {/* Product Description */}
            <div className="p-4 mt-4 bg-white md:p-6 rounded-lg shadow-lg md:mt-6">
              <h2 className="text-base font-semibold md:text-lg">Mô tả sản phẩm</h2>
              <div
                  ref={descriptionRef}
                  className={`prose prose-sm max-w-none text-gray-700 overflow-hidden ${!showFullDescription && isDescriptionOverflow ? 'max-h-[200px]' : ''}
                    }`}>
                  <div className="space-y-3 text-xs text-justify md:text-sm" dangerouslySetInnerHTML={{ __html: detailedDescription }} />
              </div>

              {isDescriptionOverflow && (
                <div className="mt-2 text-xs text-center text-blue-500 cursor-pointer md:text-sm hover:underline"
                  onClick={toggleDescriptionView}>
                  {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <div className="p-4 mt-6 bg-white md:p-6 rounded-lg shadow-lg">
          <h2 className="mb-3 text-lg font-semibold">Đánh giá sản phẩm</h2>
          <div className="flex flex-col items-center md:flex-row md:gap-10">
            <div className="flex flex-col items-center w-full mb-4 md:w-1/4 md:mb-0">
              <p className="text-4xl font-semibold">
                {reviews.length > 0
                  ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                  : "0"}
                <span className="text-xl">/5</span>
              </p>
              <div className="flex mt-1 space-x-1">
                {Array(5).fill(0).map((_, index) => (
                  <span
                    key={index}
                    className={`text-xl ${reviews.length > 0 && index < Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
                      ? "text-yellow-400"
                      : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500">({reviews.length} đánh giá)</p>
            </div>

            <div className="flex flex-col w-full mb-4 space-y-2 md:w-1/4 md:mb-0">
              {Array(5).fill(0).map((_, index) => {
                const starCount = 5 - index;
                const reviewsWithThisStar = reviews.filter(review => review.rating === starCount).length;
                const percentage = reviews.length > 0
                  ? (reviewsWithThisStar / reviews.length) * 100
                  : 0;

                return (
                  <div key={index} className="flex items-center">
                    <span className="w-12 text-sm">{starCount} sao</span>
                    <div className="w-32 h-2 ml-2 bg-gray-200 rounded md:w-48">
                      <div
                        className="h-full bg-yellow-400 rounded"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-500">{percentage.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>

            {authUser ? (
              <div className="w-full p-5 ml-2 bg-white border border-gray-100 rounded-lg shadow-sm md:w-2/4">
                <h3 className="flex items-center mb-4 text-base font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Viết đánh giá của bạn
                </h3>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Đánh giá của bạn</label>
                    <div className="relative flex items-center gap-1.5 mb-1 group">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setRating(star)}
                          className="text-3xl transition-transform cursor-pointer focus:outline-none hover:scale-110"
                          aria-label={`Đánh giá ${star} sao`}
                        >
                          <span className={`${star <= rating ? "text-yellow-400" : "text-gray-300"} drop-shadow-sm transition-colors`}>
                            ★
                          </span>
                        </button>
                      ))}

                      {/* Rating description */}
                      <span className="ml-3 text-sm italic text-gray-600 min-w-[100px]">
                        {rating === 1 && "Rất tệ"}
                        {rating === 2 && "Tệ"}
                        {rating === 3 && "Bình thường"}
                        {rating === 4 && "Tốt"}
                        {rating === 5 && "Xuất sắc"}
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="reviewText" className="block mb-2 text-sm font-medium text-gray-700">
                      Nội dung đánh giá
                    </label>
                    <textarea
                      id="reviewText"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full p-3 text-sm border border-gray-300 rounded-lg min-h-[120px] focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                      placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
                      required
                      maxLength={500}
                    />
                    <div className="absolute text-xs text-gray-500 bottom-3 right-3">
                      {reviewText.length}/500
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="flex items-center px-5 py-2.5 text-sm font-medium text-white rounded-lg cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Gửi đánh giá
                    </button>

                    <div className="text-xs text-gray-500">
                      * Đánh giá của bạn sẽ được hiển thị công khai
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="w-full text-sm text-center text-gray-700 md:w-1/3 md:text-left">
                Chỉ có thành viên mới có thể viết nhận xét. Vui lòng
                <a href="/user/login" className="text-blue-500 cursor-pointer hover:underline"> đăng nhập </a>
                hoặc
                <a href="/user/register" className="text-blue-500 cursor-pointer hover:underline"> đăng ký.</a>
              </div>
            )}
          </div>

          {/* Review List Section */}
          <div className="pt-4 mt-8 border-t border-gray-300">
            <h3 className="mb-4 text-lg font-semibold">Đánh giá từ khách hàng</h3>

            {isLoadingReviews ? (
              <div className="flex justify-center py-6">
                <div className="w-10 h-10 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="pb-4 border-b border-gray-300">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <img
                          src={review.user.avatar_url || 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYVcJXjU8HnMTXVmjER0yIET4AwAuHp0LO_YCiQjUsf1228qq0lYbABHFTSasYlk61e6Y-1ygAjWXFLEUTCloPcTvbAwe7nNba7SW9ot9QMce7BYus-H6eDIUvyFXh9UmAmV5eVTMultDo57c048MmDws-a65QYOzoBfUkHLv5OiMhMaUfh2WeP_3ej9du/s1600/istockphoto-1337144146-612x612.jpg'}
                          alt={review.user.full_name}
                          className="object-cover w-10 h-10 rounded-full"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-semibold">{review.user.full_name}</p>
                          <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>

                      {authUser && authUser.username === review.user.username && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditReview(review.id, review.comment)}
                            className="p-1 text-blue-500 hover:text-blue-700"
                            title="Chỉnh sửa đánh giá"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Xóa đánh giá"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center mb-1">
                        {Array(5).fill(0).map((_, index) => (
                          <span
                            key={index}
                            className={`text-sm ${index < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-sm text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                Chưa có đánh giá nào cho sản phẩm này.
              </div>
            )}
          </div>


        </div>

        {/* Related Products */}
        <div className="mt-6">
          <div className="p-5 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center text-lg font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
                Sản phẩm tương tự
              </h2>
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={scrollLeft}
                  className="flex items-center justify-center w-8 h-8 transition-colors duration-200 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 focus:outline-none"
                  disabled={scrollX >= 0}
                  aria-label="Xem sản phẩm trước"
                >
                  <ChevronLeft size={18} className={scrollX >= 0 ? "text-gray-300" : "text-gray-700"} />
                </button>
                <button
                  onClick={scrollRight}
                  className="flex items-center justify-center w-8 h-8 transition-colors duration-200 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 focus:outline-none"
                  disabled={relatedProducts.length <= 4 || scrollX <= -(relatedProducts.length - 4 - 1) * 220}
                  aria-label="Xem sản phẩm tiếp theo"
                >
                  <ChevronRight size={18} className={relatedProducts.length <= 4 || scrollX <= -(relatedProducts.length - 4 - 1) * 220 ? "text-gray-300" : "text-gray-700"} />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(${scrollX}px)` }}
              >
                {relatedProducts.length > 0 ? (
                  relatedProducts.map((relProduct) => (
                    <a
                      href={`/product/${relProduct.id}`}
                      key={relProduct.id}
                      className="min-w-[220px] mx-2 group"
                    >
                      <div className="overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={relProduct.imageUrl}
                            alt={relProduct.name}
                            className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 transition-opacity duration-200 opacity-0 bg-gradient-to-t from-black/10 via-transparent to-transparent group-hover:opacity-100"></div>
                        </div>

                        <div className="p-3">
                          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] transition-colors duration-200 group-hover:text-red-500">
                            {relProduct.name}
                          </h3>

                          <div className="flex items-center justify-between mt-2">
                            <span className="font-semibold text-red-600">
                              {relProduct.basePrice.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-xs text-gray-500">
                              Còn {relProduct.stockQuantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="w-full py-8 my-4 text-center">
                    <div className="mb-2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-gray-500">Không có sản phẩm tương tự</p>
                  </div>
                )}
              </div>

              {relatedProducts.length > 4 && (
                <div className="flex justify-center gap-1.5 mt-4">
                  {Array.from({ length: Math.ceil(relatedProducts.length / 4) }).map((_, index) => {
                    const isActive = Math.abs(scrollX / 220) >= index * 4 && Math.abs(scrollX / 220) < (index + 1) * 4;
                    return (
                      <button
                        key={index}
                        onClick={() => setScrollX(-(index * 4 * 220))}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive ? 'bg-red-500 w-4' : 'bg-gray-300'}`}
                        aria-label={`Trang ${index + 1}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile navigation */}
            <div className="flex justify-center gap-4 mt-4 md:hidden">
              <button
                onClick={() => setScrollX(Math.min(0, scrollX + 220))}
                className="flex items-center justify-center w-10 h-10 text-white bg-red-500 rounded-full shadow-md focus:outline-none"
                disabled={scrollX >= 0}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setScrollX(Math.max(-(relatedProducts.length - 1) * 220, scrollX - 220))}
                className="flex items-center justify-center w-10 h-10 text-white bg-red-500 rounded-full shadow-md focus:outline-none"
                disabled={relatedProducts.length <= 1 || scrollX <= -(relatedProducts.length - 1) * 220}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between py-1 border-b border-gray-200 md:py-2">
      <span className="text-xs text-gray-600 md:text-sm">{label}</span>
      <span className="text-xs font-medium text-gray-900 md:text-sm max-w-[60%] text-right break-words">{value}</span>
    </div>
  );
};

export default ProductPage;
