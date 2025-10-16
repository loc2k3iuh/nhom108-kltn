import { useState, useEffect, useRef } from 'react'
import vuvisaLogo from '/logo_v2.png'
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import UserDropdown from '../components/header/UserDropdown';
// import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";

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

// Static notifications data - commented out as not using in current implementation
// const staticNotifications: NotificationResponseDTO[] = [
//   {
//     id: 1,
//     title: "Đơn hàng của bạn đã được xác nhận",
//     message: "Đơn hàng #DH001 đã được xác nhận và đang được chuẩn bị",
//     createdAt: "2024-10-05T10:30:00",
//     isRead: false,
//     type: NotificationType.ORDER,
//     originalType: 'ORDER'
//   },
//   {
//     id: 2,
//     title: "Khuyến mãi đặc biệt cho bạn",
//     message: "Giảm giá 20% cho tất cả sản phẩm thời trang - Chỉ còn 2 ngày",
//     createdAt: "2024-10-04T15:45:00",
//     isRead: false,
//     type: NotificationType.PROMOTION,
//     originalType: 'PROMOTION'
//   },
//   {
//     id: 3,
//     title: "Cập nhật hệ thống",
//     message: "Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng ngày mai",
//     createdAt: "2024-10-03T14:20:00",
//     isRead: true,
//     type: NotificationType.SYSTEM,
//     originalType: 'SYSTEM'
//   },
//   {
//     id: 4,
//     title: "Sản phẩm mới đã có mặt",
//     message: "Khám phá bộ sưu tập thời trang mùa thu mới nhất",
//     createdAt: "2024-10-02T09:15:00",
//     isRead: true,
//     type: NotificationType.PRODUCT,
//     originalType: 'PRODUCT'
//   }
// ];

interface ProductCategoriesProps {
  handleClick: () => void;
  isOpen: boolean; // Thêm prop isOpen để kiểm soát từ component cha
}

// Import category service
import { getCachedRootCategories, getSubCategories } from "../services/categoryService";
import { CategoryResponse } from "@/types/responses/categoryResponse";

const ProductCategories: React.FC<ProductCategoriesProps> = ({ handleClick, isOpen }) => {
  const [rootCategories, setRootCategories] = useState<CategoryResponse[]>([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState<Record<number, CategoryResponse[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false); // Thêm ref để track đã fetch chưa
  const navigate = useNavigate(); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // API fetch function
  const fetchCategories = async () => {
    if (fetchedRef.current || isLoading) return;
    
    setError(null);
    setIsLoading(true);
    try {
      // Fetch root categories
      const rootCats = await getCachedRootCategories();
      setRootCategories(rootCats);
      
      // Fetch subcategories for each root category
      const subCatsMap: Record<number, CategoryResponse[]> = {};
      const subCategoryPromises = rootCats.map(async (category) => {
        try {
          const subCats = await getSubCategories(category.id);
          subCatsMap[category.id] = subCats;
        } catch (error) {
          console.warn(`Failed to fetch subcategories for ${category.name}:`, error);
          subCatsMap[category.id] = [];
        }
      });
      
      await Promise.allSettled(subCategoryPromises);
      setSubCategoriesMap(subCatsMap);
      fetchedRef.current = true;
      
    } catch (err) {
      setError("Không thể tải danh mục. Vui lòng thử lại sau.");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !fetchedRef.current) {
      fetchCategories();
    }
  }, [isOpen]);

    const handleCategoryClick = (categoryId: number, categoryName: string) => {
    navigate(`/category/${categoryId}`, {
      state: { 
        categoryId, 
        categoryName,
        rootCategories,
        subCategories: subCategoriesMap[categoryId] || []
      }
    });
    handleClick();
  };

  const handleSubCategoryClick = (subCategory: CategoryResponse) => {
    navigate(`/category/${subCategory.id}`, {
      state: {
        categoryId: subCategory.id,
        categoryName: subCategory.name,
        parentCategory: subCategory.parentCategory
      }
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

  // const handleMouseMove = (e: MouseEvent) => {
  //   if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
  //     handleClick();
  //   }
  // };

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
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-4 text-red-600">
              {error}
            </div>
          )}
          
          {!isLoading && !error && rootCategories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {rootCategories.map((category) => (
                <div key={category.id} className="border border-gray-200 p-3 rounded-lg">
                  <h3 
                    className="font-semibold text-lg text-gray-800 mb-2 cursor-pointer hover:text-red-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCategoryClick(category.id, category.name);
                    }}
                  >
                    {category.name}
                  </h3>
                  <ul className="space-y-1">
                    {(subCategoriesMap[category.id] || []).map((subCategory) => (
                      <li 
                        key={subCategory.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSubCategoryClick(subCategory);
                        }}
                        className="text-gray-600 hover:text-red-600 cursor-pointer transition-colors"
                      >
                        {subCategory.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
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
  // const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Static notification state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');
  // const [displayLimit, setDisplayLimit] = useState(3);
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>([]); // Empty notifications for non-logged-in users
  
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Static unread count - starts at 0, set when logged in

  // Static user info (simulating logged in user)
  // const [userInfo, setUserInfo] = useState<{ fullName: string; username: string; avatar_url: string; role: string } | null>(staticUserData);
  // Categories state for dropdown
  const [rootCategories, setRootCategories] = useState<CategoryResponse[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategoriesForHeader = async () => {
      try {
        setIsCategoriesLoading(true);
        const categories = await getCachedRootCategories();
        setRootCategories(categories);
      } catch (error) {
        console.error('Error fetching categories for header:', error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategoriesForHeader();
  }, []);


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
    // setDisplayLimit(3); // Reset display limit khi thay đổi filter - commented out
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
    // setIsUserMenuOpen(false); // commented out

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
          // const user = JSON.parse(userData);
          // setUserInfo({
          //   fullName: user.full_name || user.fullName || "Người dùng",
          //   username: user.username || "user",
          //   avatar_url: user.avatar_url || staticUserData.avatar_url,
          //   role: "USER"
          // });
        } catch (error) {
          console.error("Error parsing user data:", error);
          setIsLoggedIn(false);
          // setUserInfo(null);
        }
      } else {
        setIsLoggedIn(false);
        // setUserInfo(null);
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
    // setIsUserMenuOpen(false); // commented out
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const navigate = useNavigate();
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(searchTerm);
  }; 

  // const handleLogout = () => {
  //   if (isLoggingOut) return; // Prevent multiple clicks

  //   setIsLoggingOut(true);
    
  //   // Simulate logout process
  //   setTimeout(() => {
  //     // Clear localStorage
  //     localStorage.removeItem("vuvisa_access_token");
  //     localStorage.removeItem("vuvisa_user_data");
      
  //     // Reset state
  //     setIsLoggedIn(false);
  //     // setUserInfo(null); // commented out
  //     setUnreadCount(0);
  //     setNotifications([]);
  //     setCartItemCount(0);
  //     // setIsUserMenuOpen(false); // commented out
      
  //     toast.success("Đăng xuất thành công!");
  //     setIsLoggingOut(false);
  //     window.location.href = "/";
  //   }, 1000);
  // }

  // const toggleUserMenu = () => {
  //   if (!isLoggedIn) {
  //     // Redirect to login if not authenticated
  //     navigate('/auth/login');
  //     return;
  //   }

  //   // setIsUserMenuOpen((prev) => !prev); // commented out
  //   setIsNotificationsOpen(false);
  //   setIsOpen(false);
  // };

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
          <div className="form-search md:w-[calc(100%-370px)] w-[calc(100%-104px)] px-[8px]">
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
          <div className="flex items-center justify-between md:w-[480px] pl-0 md:pl-[24px] gap-2 md:gap-3">
            <div className="hidden md:flex flex-col cursor-pointer justify-center items-center group min-w-[60px]" onClick={toggleNotifications}>
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
              <span className="text-[11px] text-[#7A7E7F] group-hover:md:stroke-[#5A5E5F] whitespace-nowrap">Thông báo</span>
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
            <div className="flex flex-col cursor-pointer justify-center items-center group relative min-w-[60px]">
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
                <span className="text-[11px] text-white md:text-[#7A7E7F] group-hover:md:stroke-[#5A5E5F] hidden md:block whitespace-nowrap">Giỏ hàng</span>
              </a>
            </div>

            <div className="flex flex-col cursor-pointer justify-center items-center group">
              <ThemeToggleButton />
            </div>

            <div className="flex flex-col cursor-pointer justify-center items-center group">
              <UserDropdown/>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;