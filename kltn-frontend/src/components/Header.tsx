import { useState, useEffect, useRef } from 'react'
import vuvisaLogo from '/logo_v2.png'
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

enum NotificationType {
  CALENDAR = 'CALENDAR',
  ORDER = 'ORDER',
  PRODUCT = 'PRODUCT',
  PROMOTION = 'PROMOTION',
  SYSTEM = 'SYSTEM'
}

interface NotificationResponseDTO {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: NotificationType; 
  originalType: string; 
}

// Static user data
const staticUserData = {
  id: 1,
  username: "user123",
  fullName: "Nguyễn Văn A",
  avatar_url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYVcJXjU8HnMTXVmjER0yIET4AwAuHp0LO_YCiQjUsf1228qq0lYbABHFTSasYlk61e6Y-1ygAjWXFLEUTCloPcTvbAwe7nNba7SW9ot9QMce7BYus-H6eDIUvyFXh9UmAmV5eVTMultDo57c048MmDws-a65QYOzoBfUkHLv5OiMhMaUfh2WeP_3ej9du/s1600/istockphoto-1337144146-612x612.jpg",
  role: "USER",
  roles: [{ name: "USER" }]
};

// Static notifications data
const staticNotifications: NotificationResponseDTO[] = [
  {
    id: 1,
    title: "Đơn hàng của bạn đã được xác nhận",
    message: "Đơn hàng #DH001 đã được xác nhận và đang được chuẩn bị",
    createdAt: "2024-10-05T10:30:00",
    isRead: false,
    type: NotificationType.ORDER,
    originalType: 'ORDER'
  },
  {
    id: 2,
    title: "Khuyến mãi đặc biệt cho bạn",
    message: "Giảm giá 20% cho tất cả sản phẩm thời trang - Chỉ còn 2 ngày",
    createdAt: "2024-10-04T15:45:00",
    isRead: false,
    type: NotificationType.PROMOTION,
    originalType: 'PROMOTION'
  },
  {
    id: 3,
    title: "Cập nhật hệ thống",
    message: "Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng ngày mai",
    createdAt: "2024-10-03T14:20:00",
    isRead: true,
    type: NotificationType.SYSTEM,
    originalType: 'SYSTEM'
  },
  {
    id: 4,
    title: "Sản phẩm mới đã có mặt",
    message: "Khám phá bộ sưu tập thời trang mùa thu mới nhất",
    createdAt: "2024-10-02T09:15:00",
    isRead: true,
    type: NotificationType.PRODUCT,
    originalType: 'PRODUCT'
  }
];

interface ProductCategoriesProps {
  handleClick: () => void;
  isOpen: boolean; // Thêm prop isOpen để kiểm soát từ component cha
}

// Static category data
const categories = [
  {
    title: 'Thời trang nam',
    subCategories: ['T-shirt', 'Polo', 'Shirt', 'Quần'],
  },
  {
    title: 'Thời trang nữ',
    subCategories: ['T-shirt', 'Polo', 'Shirt', 'Quần'],
  },
  {
    title: 'Phụ kiện thể thao',
    subCategories: ['Túi thể thao', 'Băng đô', 'Băng cổ tay', 'Mũ thể thao'],
  },
  {
    title: 'Giày thể thao',
    subCategories: ['Giày chạy bộ', 'Giày tập gym', 'Giày tennis', 'Giày cầu lông'],
  },
  {
    title: 'Dụng cụ thể thao',
    subCategories: ['Vợt tennis', 'Vợt cầu lông', 'Bóng tennis', 'Bóng đá'],
  },
  {
    title: 'Đồ tập gym',
    subCategories: ['Găng tay tập gym', 'Dây kháng lực', 'Bình nước', 'Thảm tập yoga'],
  },
  {
    title: 'Đồ bơi',
    subCategories: ['Đồ bơi nam', 'Đồ bơi nữ', 'Kính bơi', 'Mũ bơi'],
  },
  {
    title: 'Dinh dưỡng thể thao',
    subCategories: ['Protein', 'BCAA', 'Pre-workout', 'Vitamin & khoáng chất'],
  }
];

const ProductCategories: React.FC<ProductCategoriesProps> = ({ handleClick, isOpen }) => {
  // const [groupedCategories, setGroupedCategories] = useState<Record<CategoryType, Category[]> | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const fetchedRef = useRef(false); // Thêm ref để track đã fetch chưa
  const navigate = useNavigate(); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Comment out API fetch function
    // const fetchCategories = async () => {
    //   if (fetchedRef.current || isLoading) return;
    //   
    //   setError(null);
    //   setIsLoading(true);
    //   try {
    //     const storedCategories = localStorage.getItem("vuvisa_product_categories");

    //     if (storedCategories) {
    //       setGroupedCategories(JSON.parse(storedCategories));
    //       fetchedRef.current = true;
    //       setIsLoading(false);
    //       return;
    //     }

    //     const data = await getAllCategoriesGroupedByType();

    //     if (!fetchedRef.current) { // Kiểm tra thêm
    //       setGroupedCategories(data);
    //       fetchedRef.current = true;

    //       try {
    //         localStorage.setItem("vuvisa_product_categories", JSON.stringify(data));
    //       } catch (storageError) {
    //         console.error("Không thể lưu danh mục vào localStorage:", storageError);
    //       }

    //     }
    //   } catch (err) {
    //     setError("Không thể tải danh mục. Vui lòng thử lại sau.");
    //     console.error("Fetch error:", err);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // useEffect(() => {
    //   if (isOpen && !fetchedRef.current) {
    //     fetchCategories();
    //   }
    // }, [isOpen]);

    const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${categoryName}`, {
      state: { categories } // Truyền dữ liệu categories qua state
    });
    handleClick();
  };


  // đóng menu khi chuột ra ngoài
  const handleMouseLeave = () => {
    // Đặt timeout 300ms trước khi đóng dropdown
    leaveTimerRef.current = setTimeout(() => {
      handleClick();
    }, 300);
  };
  
  const handleMouseEnter = () => {
    // Nếu chuột quay lại dropdown, hủy timeout đóng
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      // Dọn dẹp timeout khi component unmount
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      handleClick();
    }
  };

  return (
    <div   className="relative px-4">
      <h2 
        className="text-xl font-bold mb-4 text-white md:text-black flex cursor-pointer"
      >
        <div className="flex items-center justify-center md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24">
            <rect className="fill-none" width="24" height="24" />
            <line className="stroke-white stroke-1.5 strokeLinecapRound strokeLinejoinRound" x1="16.5" y1="12" x2="3.75" y2="12" />
            <path className="stroke-white stroke-1.5 strokeLinecapRound strokeLinejoinRound" d="M46.75,56L40,62.75l6.75,6.75" transform="translate(-36.25 -50.75)" />
          </svg>
        </div>
        <span className="pl-4 md:pl-0">Danh mục sản phẩm</span>
      </h2>

      {isOpen && (
        <div ref={dropdownRef} className="" 
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter} >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="border border-gray-200 p-3 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {category.title}
                </h3>
                <ul className="space-y-1">
                  {category.subCategories.map((subCategory, subIndex) => (
                    <li 
                    key={subIndex}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('List item clicked:', subCategory);
                      handleCategoryClick(subCategory)}}
                      className="text-gray-600 hover:text-red-600 cursor-pointer transition-colors"
                    >
                      {subCategory}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
  
const Header: React.FC = () => {
  
  //State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Static notification state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');
  const [displayLimit, setDisplayLimit] = useState(3);
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>([]); // Empty notifications for non-logged-in users
  
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Static unread count - starts at 0, set when logged in

  // Static user info (simulating logged in user)
  const [userInfo, setUserInfo] = useState<{ fullName: string; username: string; avatar_url: string; role: string } | null>(staticUserData);
  // Comment out API call for categories
  // const [groupedCategories, setGroupedCategories] = useState<Record<CategoryType, Category[]> | null>(null);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const data = await getAllCategoriesGroupedByType();
  //       setGroupedCategories(data);
  //     } catch (error) {
  //       console.error('Error fetching categories:', error);
  //     }
  //   };
  // 
  //   fetchCategories();
  // }, []);


  // Filter notifications based on active filter
  const getFilteredNotifications = () => {
    if (activeFilter === 'all') {
      return notifications;
    }
    return (notifications ?? []).filter(notification => notification.type === activeFilter);
  };

  // Cập nhật hàm thay đổi filter
  const changeFilter = (filter: NotificationType | 'all') => {
    setActiveFilter(filter);
    setDisplayLimit(3); // Reset display limit khi thay đổi filter
  };

  // Handle notification click
  const toggleNotifications = () => {
    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      navigate('/auth/login');
      return;
    }

    setIsNotificationsOpen(prev => !prev);
    setIsOpen(false);
    setIsUserMenuOpen(false);

    // Simulate loading for 500ms
    if (!isNotificationsOpen) {
      setIsLoadingNotifications(true);
      setTimeout(() => {
        setIsLoadingNotifications(false);
      }, 500);
    }
  };

  // Mark a single notification as read
  const markAsReadFunction = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsReadFunction = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
    toast.success("Đã đánh dấu tất cả là đã đọc!");
  };

  // Format date for display
  const formatDate = (dateArray: number[]) => {
    // Chuyển array thành Date object
    const date = new Date(
      dateArray[0], // year
      dateArray[1] - 1, // month (0-11)
      dateArray[2], // day
      dateArray[3], // hour
      dateArray[4], // minute
      dateArray[5] // second
    );
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Format giờ và phút
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    
    if (diffDays === 0) {
      return `Hôm nay, ${formattedTime}`;
    } else if (diffDays === 1) {
      return `Hôm qua, ${formattedTime}`;
    } else {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  };
  const [cartItemCount, setCartItemCount] = useState(0); // Static cart count - starts at 0, set to 3 when logged in

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("vuvisa_access_token");
      const userData = localStorage.getItem("vuvisa_user_data");
      
      if (token && userData) {
        setIsLoggedIn(true);
        setCartItemCount(3); // Static cart count for logged-in users
        setUnreadCount(5); // Static unread notifications count
        // Static notifications for logged-in users
        setNotifications([
          { id: 1, title: "Đơn hàng #123 đã được xác nhận", message: "Đơn hàng của bạn đang được xử lý", createdAt: "2024-01-15T10:00:00", isRead: false, type: NotificationType.ORDER, originalType: "ORDER" },
          { id: 2, title: "Khuyến mãi đặc biệt", message: "Giảm giá 50% cho tất cả sản phẩm", createdAt: "2024-01-14T15:30:00", isRead: true, type: NotificationType.PROMOTION, originalType: "PROMOTION" },
          { id: 3, title: "Đơn hàng #124 đã giao thành công", message: "Cảm ơn bạn đã mua sắm tại VuVisa", createdAt: "2024-01-13T09:45:00", isRead: false, type: NotificationType.ORDER, originalType: "ORDER" },
        ]);

        try {
          const user = JSON.parse(userData);
          setUserInfo({
            fullName: user.full_name || user.fullName || "Người dùng",
            username: user.username || "user",
            avatar_url: user.avatar_url || staticUserData.avatar_url,
            role: "USER"
          });
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
        setUnreadCount(0);
        setNotifications([]);
        setCartItemCount(0);
      }
    };

    checkAuthStatus();
    
    // Listen for storage changes (when user logs in from another tab)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleClick = () => {
    setIsNotificationsOpen(false);
    setIsOpen((prev) => !prev);
    setIsUserMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const navigate = useNavigate();
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(searchTerm);
  }; 

  const handleLogout = () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    setIsLoggingOut(true);
    
    // Simulate logout process
    setTimeout(() => {
      // Clear localStorage
      localStorage.removeItem("vuvisa_access_token");
      localStorage.removeItem("vuvisa_user_data");
      
      // Reset state
      setIsLoggedIn(false);
      setUserInfo(null);
      setUnreadCount(0);
      setNotifications([]);
      setCartItemCount(0);
      setIsUserMenuOpen(false);
      
      toast.success("Đăng xuất thành công!");
      setIsLoggingOut(false);
      window.location.href = "/";
    }, 1000);
  }

  const toggleUserMenu = () => {
    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      navigate('/auth/login');
      return;
    }

    setIsUserMenuOpen((prev) => !prev);
    setIsNotificationsOpen(false);
    setIsOpen(false);
  };

  // Static cart - no API calls needed

  return (
    <nav className="bg-white">
      <div className="max-w-7xl h-auto md:h-[68px] mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between bg-[#C92127] md:bg-white gap-3 md:gap-0 pt-2">
        <div className="flex items-center">
          <a href="/">
            <img src={vuvisaLogo} alt="Vuvia Logo" className="h-auto w-[130px] md:w-[200px]" />
          </a>
        </div>
        <div className="flex items-center w-full justify-between">
          <div className="w-auto md:w-[200px] flex justify-end">
            <div
              className="cursor-pointer flex items-center relative"
              onClick={handleClick}
            >
              <svg className="fill-[#cdcfd0]" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                <rect className="fill-none stroke-white md:stroke-[#7a7e7f] stroke-[2.5] stroke-linecap-round stroke-linejoin-round" width="10" height="10" rx="1.667" transform="translate(6.667 6.667)" />
                <rect className="fill-none stroke-white md:stroke-[#7a7e7f] stroke-[2.5] stroke-linecap-round stroke-linejoin-round" width="10" height="10" rx="1.667" transform="translate(6.667 23.333)" />
                <rect className="fill-none stroke-white md:stroke-[#7a7e7f] stroke-[2.5] stroke-linecap-round stroke-linejoin-round" width="10" height="10" rx="1.667" transform="translate(23.333 23.333)" />
                <circle className="fill-none stroke-white md:stroke-[#7a7e7f] stroke-[2.5]" cx="5" cy="5" r="5" transform="translate(23.333 6.667)" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <rect className="fill-none" width="16" height="16" />
                <path className="fill-none stroke-white md:stroke-[#9E9E9E] stroke-[2] stroke-linecap-round stroke-linejoin-round" d="M6,9l3.945,3.945L13.891,9" />
              </svg>
            </div>
            <div className={`catalog_menu_dropdown absolute left-0 right-0 md:top-[68px] ${isOpen ? 'flex' : 'hidden'} w-full h-full justify-center items-center bg-transparent md:bg-[rgba(0,0,0,0.5)] backdrop-blur-md z-100`}>
              <div  className="w-full md:max-w-7xl bg-[#C92127] md:bg-white rounded-bl-[8px] rounded-br-[8px] pt-[24px] px-[12px] pb-[16px] z-10 top-0 absolute">
                <ProductCategories handleClick={handleClick} isOpen={isOpen} />
              </div>
            </div>
          </div>
          <div className="form-search md:w-[calc(100%-210px)] w-[calc(100%-104px)] px-[8px]">
            <form onSubmit={handleSearchSubmit} className="md:relative">
              <input
                maxLength={128}
                type="text"
                name="q"
                autoComplete="off"
                placeholder="Thời trang Gen Z"
                className="input-search h-[40px] px-2 md:pt-0 md:pr-[80px] md:pb-0 md:pl-[24px] border md:border-[1px] md:border-solid md:border-[#CDCFD0] border-transparent bg-white focus:outline-none w-full rounded-md"
                value={searchTerm}
                onChange={handleSearchChange} />
              <span 
                className="button-search hidden md:flex absolute top-[calc(50%)] right-4 transform translate-y-[-50%] w-[72px] h-[30px] bg-[#C92127] justify-center items-center cursor-pointer rounded-md"
                onClick={() => {
                  if (searchTerm.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <rect className="fill-none" width="24" height="24" />
                  <circle className="fill-none stroke-white stroke-2 stroke-round stroke-linejoin-round" cx="10" cy="10" r="7" />
                  <line className="fill-none stroke-white stroke-2 stroke-round stroke-linejoin-round" x1="21" y1="21" x2="15" y2="15" />
                </svg>
              </span>
            </form>
          </div>
          <div className="flex items-center justify-between md:w-[320px] pl-0 md:pl-[24px]">
            <div className="hidden md:flex flex-col cursor-pointer justify-center items-center group" onClick={toggleNotifications}>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <rect className="fill-none" width="24" height="24" />
                  <path className="fill-none stroke-[#7a7e7f] group-hover:md:stroke-[#5A5E5F] stroke-[2] stroke-linecap-round stroke-linejoin-round" d="M10,5a2,2,0,1,1,4,0,7.008,7.008,0,0,1,4,6.006v3a4,4,0,0,0,2,3H4a4,4,0,0,0,2-3v-3A7.008,7.008,0,0,1,10,5" />
                  <path className="fill-none stroke-[#7a7e7f] hgroup-hover:md:stroke-[#5A5E5F] stroke-[2] stroke-linecap-round stroke-linejoin-round" d="M9,17v1a3,3,0,0,0,6.006,0V17" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C92127] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[12px] text-[#7A7E7F] group-hover:md:stroke-[#5A5E5F]">Thông báo</span>
            </div>
              {isNotificationsOpen && (
              <div className="absolute top-[70px] right-[100px] bg-white shadow-lg rounded-md p-3 w-[350px] z-20">
                <div className="flex justify-between items-center border-b pb-2 mb-3 border-gray-300">
                  <h3 className="font-semibold text-lg">Thông báo</h3>
                  {isLoggedIn && unreadCount > 0 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsReadFunction();
                      }}
                      className="text-xs text-[#C92127] hover:text-[#a71b20]"
                    >
                      Đánh dấu đã đọc tất cả
                    </button>
                  )}
                </div>

                {isLoggedIn ? (
                <>
                {/* Filter tabs */}
                <div className="flex mb-3 border-b border-gray-300">
                  <button 
                    onClick={() => changeFilter('all')}
                    className={`px-3 py-1 text-sm cursor-pointer ${activeFilter === 'all' ? 'text-[#C92127] border-b-2 border-[#C92127]' : 'text-gray-600'}`}
                  >
                    Tất cả
                  </button>
                  <button 
                    onClick={() => changeFilter(NotificationType.ORDER)}
                    className={`px-3 py-1 text-sm cursor-pointer ${activeFilter === NotificationType.ORDER ? 'text-[#C92127] border-b-2 border-[#C92127]' : 'text-gray-600'}`}
                  >
                    Đơn hàng
                  </button>
                  <button 
                    onClick={() => changeFilter(NotificationType.PROMOTION)}
                    className={`px-3 py-1 text-sm cursor-pointer ${activeFilter === NotificationType.PROMOTION ? 'text-[#C92127] border-b-2 border-[#C92127]' : 'text-gray-600'}`}
                  >
                    Khuyến mãi
                  </button>
                  <button 
                    onClick={() => changeFilter(NotificationType.SYSTEM)}
                    className={`px-3 py-1 text-sm cursor-pointer ${activeFilter === NotificationType.SYSTEM ? 'text-[#C92127] border-b-2 border-[#C92127]' : 'text-gray-600'}`}
                  >
                    Hệ thống
                  </button>
                </div>
                
                {/* Notifications list */}
                <div className="max-h-[300px] overflow-y-auto">
                  {isLoadingNotifications ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C92127]"></div>
                    </div>
                ) : (getFilteredNotifications() ?? []).length > 0 ? (
                    (getFilteredNotifications() ?? []).map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-2 mb-2 rounded-md ${notification.isRead ? 'bg-white' : 'bg-[#f8f9fa]'} hover:bg-gray-100 cursor-pointer border-b border-gray-300`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!notification.isRead) {
                            markAsReadFunction(notification.id);
                          }
                        }}
                      >
                        <div className="flex justify-between">
                          <h4 className={`text-sm ${notification.isRead ? 'font-normal' : 'font-semibold'}`}>{notification.title}</h4>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-[#C92127] rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{notification.message.replace(/<[^>]*>/g, '')}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {Array.isArray(notification.createdAt)
                            ? formatDate(notification.createdAt)
                            : (() => {
                                // Try to parse ISO string to Date and format
                                const date = new Date(notification.createdAt);
                                const now = new Date();
                                const diffTime = Math.abs(now.getTime() - date.getTime());
                                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                                const hours = date.getHours();
                                const minutes = date.getMinutes();
                                const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
                                if (diffDays === 0) {
                                  return `Hôm nay, ${formattedTime}`;
                                } else if (diffDays === 1) {
                                  return `Hôm qua, ${formattedTime}`;
                                } else {
                                  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                                }
                              })()
                          }
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">Không có thông báo nào</p>
                  )}
                </div>
                
                {/* Load more button
                {getFilteredNotifications().length > displayLimit && (
                  <div className="text-center mt-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        loadMore();
                      }}
                      className="text-[#C92127] text-sm hover:text-[#a71b20]"
                    >
                      Xem thêm
                    </button>
                  </div>
                )} */}
                
                {/* View all notifications link */}
                <div className="text-center mt-3 pt-2 border-t border-gray-300">
                  <a 
                    href="/notifications" 
                    className="text-[#C92127] text-sm font-semibold hover:text-[#a71b20]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Xem tất cả thông báo
                  </a>
                </div>

                </>
              ) : (
                // Content for non-logged in users
                <div className="py-8 px-4 text-center">
                  <div className="flex justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#C92127" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">Chức năng này chỉ hỗ trợ cho người dùng đã đăng nhập</p>
                  <div className="flex justify-center gap-2">
                    <a 
                      href="/user/login" 
                      className="bg-[#C92127] text-white px-4 py-2 rounded-md text-sm hover:bg-[#a71b20] transition-colors"
                    >
                      Đăng nhập
                    </a>
                    <a 
                      href="/user/register" 
                      className="border border-[#C92127] text-[#C92127] px-4 py-2 rounded-md text-sm hover:bg-[#f8d7da] transition-colors"
                    >
                      Đăng ký
                    </a>
                  </div>
                </div>
              )}
              </div>
              )}
            <div className="flex flex-col cursor-pointer justify-center items-center group relative">
              <a href={'/cart'} className='flex items-center justify-center flex-col'>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <rect className="fill-none" width="24" height="24" />
                    <circle className="fill-none stroke-white md:stroke-[#7a7e7f] group-hover:md:stroke-[#5A5E5F] stroke-[2] stroke-linecap-round stroke-linejoin-round" cx="2.098" cy="2.098" r="2.098" transform="translate(4.189 17.047)" />
                    <circle className="fill-none stroke-white md:stroke-[#7a7e7f] group-hover:md:stroke-[#5A5E5F] stroke-[2] stroke-linecap-round stroke-linejoin-round" cx="2.098" cy="2.098" r="2.098" transform="translate(14.961 17.047)" />
                    <path className="fill-none stroke-white md:stroke-[#7a7e7f] group-hover:md:stroke-[#5A5E5F] stroke-[2] stroke-linecap-round stroke-linejoin-round" d="M17.018,17.019H6V3H4" transform="translate(-0.006 0.004)" />
                    <path className="fill-none stroke-white md:stroke-[#7a7e7f] group-hover:md:stroke-[#5A5E5F] stroke-[2] stroke-linecap-round stroke-linejoin-round" d="M6,5,20.019,6l-1,7.01H6" transform="translate(-0.011 -0.003)" />
                  </svg>
                  {cartItemCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-[#C92127] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </div>
                  )}
                </div>
                <span className="text-[12px] text-white md:text-[#7A7E7F] group-hover:md:stroke-[#5A5E5F] hidden md:block">Giỏ hàng</span>
              </a>
            </div>
            <div className="flex flex-col cursor-pointer justify-center items-center relative">
              <div onClick={toggleUserMenu} className="flex flex-col items-center">
                {isLoggedIn && userInfo ? (
                  <div className="w-[24px] h-[24px] rounded-full overflow-hidden border border-gray-200">
                    <img 
                      src={userInfo.avatar_url}
                      alt={userInfo.fullName || userInfo.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <rect className="fill-none" width="24" height="24" />
                    <ellipse className="fill-none stroke-white md:stroke-[#7a7e7f] stroke-[2] stroke-linecap-round stroke-linejoin-round" cx="3.922" cy="4.224" rx="3.922" ry="4.224" transform="translate(8.14 3.017)" />
                    <path className="fill-none stroke-white md:stroke-[#7a7e7f] stroke-[2] stroke-linecap-round stroke-linejoin-round" d="M6,21.153V19.1A4.08,4.08,0,0,1,10.057,15h4.057a4.08,4.08,0,0,1,4.057,4.1v2.051" transform="translate(-0.085 -0.228)" />
                  </svg>
                )}
                <span className="text-[12px] text-white md:text-[#7A7E7F] hidden md:block">{userInfo?.username || "Người dùng"}</span>
              </div>
              {isUserMenuOpen && (
                <div className="absolute top-[calc(100%+15px)] right-0 bg-white shadow-md rounded-md p-4 w-[300px] z-10">
                  {isLoggedIn && userInfo ? (
                    <>
                    <div className="flex flex-col">
                      {/* User header with avatar */}

                      <a href="/user/profile" className="flex items-center p-4 border-b border-gray-100">
                        <div className="w-[40px] h-[40px] relative rounded-full bg-[#FFE8E2] mr-3 flex items-center justify-center">
                          <span className="text-[#E57905]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20.8 9.64L18.36 7.2L19.04 3.76L15.6 4.44L13.16 2L10.72 4.44L7.28 3.76L7.96 7.2L5.52 9.64L7.96 12.08L7.28 15.52L10.72 14.84L13.16 17.28L15.6 14.84L19.04 15.52L18.36 12.08L20.8 9.64Z" fill="#E57905"/>
                            </svg>
                          </span>
                          <img 
                            src={userInfo.avatar_url}
                            alt={userInfo.fullName}
                            className="absolute inset-0 w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{userInfo.fullName}</h3>
                          <p className="text-sm text-gray-500">Thành viên Vuvisa</p>
                        </div>
                        <div className="text-gray-400">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 6L15 12L9 18"></path>
                          </svg>
                        </div>
                      </a>
                    </div>

                    {/* Menu items */}
                    <a href="/user/orders" className="flex items-center p-3 hover:bg-gray-50">
                      <div className="w-8 h-8 flex items-center justify-center mr-3 text-gray-500">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 7H15" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 11H15" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 15H12" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <a className="text-gray-600" href="/user/orders">
                        Đơn hàng của tôi
                      </a>
                    </a>

                    <a href="/user/wishlist" className="flex items-center p-3 hover:bg-gray-50">
                      <div className="w-8 h-8 flex items-center justify-center mr-3 text-gray-500">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-gray-600">Sản phẩm yêu thích</span>
                    </a>

                    <a href="/voucher" className="flex items-center p-3 hover:bg-gray-50">
                      <div className="w-8 h-8 flex items-center justify-center mr-3 text-gray-500">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 12V22H4V12" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 7H2V12H22V7Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 22V7" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-gray-600">Wallet Voucher</span>
                    </a>

                    {/* <a href="/user/v-points" className="flex items-center p-3 hover:bg-gray-50">
                      <div className="w-8 h-8 flex items-center justify-center mr-3 text-gray-500 font-bold border border-gray-300 rounded">
                        F
                      </div>
                      <span className="text-gray-600">Tài khoản V-point</span>
                    </a> */}

                    <button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center p-3 hover:bg-gray-50 border-t border-gray-100 w-full text-left cursor-pointer"
                    >
                      <div className="w-8 h-8 flex items-center justify-center mr-3 text-gray-500">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 17L21 12L16 7" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 12H9" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {isLoggingOut ? (
                        <div className="flex items-center">
                          <span className="text-gray-400">Đang đăng xuất...</span>
                          <div className="ml-2 animate-spin h-4 w-4 border-t-2 border-b-2 border-[#C92127] rounded-full"></div>
                        </div>
                      ) : (
                        <span className="text-gray-600">Thoát tài khoản</span>
                      )}
                    </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-start">
                      <a href="/user/register" className="text-sm bg-[#C92127] text-white hover:bg-[#a71b20] py-2 px-4 rounded-md mb-2 text-center block w-full cursor-pointer">
                        Đăng ký
                      </a>
                      <a href="/user/login" className="text-sm bg-white text-[#C92127] border border-[#C92127] hover:bg-[#f8d7da] py-2 px-4 rounded-md text-center block w-full cursor-pointer">
                        Đăng nhập
                      </a>

                    </div>

                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;