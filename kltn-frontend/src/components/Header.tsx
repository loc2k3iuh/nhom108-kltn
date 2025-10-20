import { use, useState } from 'react';
import vuvisaLogo from '/logo_v2.png';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import ProductCategories from './header/ProductCategories';
import NotificationsDropdown, { NotificationResponseDTO, NotificationType } from './header/NotificationsDropdown';
import SearchBar from './header/SearchBar';
import CartButton from './header/CartButton';
import UserMenu from './header/UserMenu';
import { useNavigate } from 'react-router-dom';

// Demo notifications (replace with API later)
const demoNotifications: NotificationResponseDTO[] = [
  { id: 1, title: 'Đơn hàng của bạn đã được xác nhận', message: 'Đơn hàng #DH001 đã được xác nhận và đang được chuẩn bị', createdAt: '2024-10-05T10:30:00', isRead: false, type: NotificationType.ORDER },
  { id: 2, title: 'Khuyến mãi đặc biệt cho bạn', message: 'Giảm giá 20% cho tất cả sản phẩm thời trang - Chỉ còn 2 ngày', createdAt: '2024-10-04T15:45:00', isRead: false, type: NotificationType.PROMOTION },
  { id: 3, title: 'Cập nhật hệ thống', message: 'Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng ngày mai', createdAt: '2024-10-03T14:20:00', isRead: true, type: NotificationType.SYSTEM },
  { id: 4, title: 'Sản phẩm mới đã có mặt', message: 'Khám phá bộ sưu tập thời trang mùa thu mới nhất', createdAt: '2024-10-02T09:15:00', isRead: true, type: NotificationType.PRODUCT },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>(demoNotifications);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(notifications.filter(n => !n.isRead).length);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Auth store
  const { authUser } = useAuthStore();
  const isLoggedIn = !!authUser;

  // Handlers
  const toggleCategory = () => {
    setIsNotificationsOpen(false);
    setIsUserMenuOpen(false);
    setIsCategoryOpen(v => !v);
  };
  const closeCategory = () => setIsCategoryOpen(false);

  const toggleNotifications = () => {
    setIsNotificationsOpen(v => !v);
    setIsCategoryOpen(false);
    setIsUserMenuOpen(false);
    if (!isNotificationsOpen) {
      setIsLoadingNotifications(true);
      setTimeout(() => setIsLoadingNotifications(false), 500);
    }
  };

  const changeFilter = (f: NotificationType | 'all') => setActiveFilter(f);

  const markAsReadFunction = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(v => Math.max(0, v - 1));
  };

  const markAllAsReadFunction = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast.success('Đã đánh dấu tất cả là đã đọc!');
  };


  return (
    <nav className="bg-white">
      <div className="max-w-7xl h-auto md:h-[68px] mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between bg-[#C92127] md:bg-white gap-3 md:gap-0 pt-2 cursor-pointer">
        <div className="flex items-center">
          <span onClick={() => navigate("/")}>
            <img src={vuvisaLogo} alt="Vuvia Logo" className="h-auto w-[130px] md:w-[200px]" />
          </span>
        </div>

        <div className="flex items-center w-full justify-between">
          {/* Category button + dropdown */}
          <div className="w-auto md:w-[200px] flex justify-end">
            <div className="cursor-pointer flex items-center relative" onClick={toggleCategory}>
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
            <div className={`catalog_menu_dropdown absolute left-0 right-0 md:top-[68px] ${isCategoryOpen ? 'flex' : 'hidden'} w-full h-full justify-center items-center bg-transparent md:bg-[rgba(0,0,0,0.5)] backdrop-blur-md z-100`}>
              <div className="w-full md:max-w-7xl bg-[#C92127] md:bg-white rounded-bl-[8px] rounded-br-[8px] pt-[24px] px-[12px] pb-[16px] z-10 top-0 absolute">
                <ProductCategories handleClose={closeCategory} isOpen={isCategoryOpen} />
              </div>
            </div>
          </div>

          {/* Search */}
          <SearchBar value={searchTerm} onChange={setSearchTerm} />

          {/* Right cluster */}
          <div className="flex items-center justify-between md:w-[320px] pl-0 md:pl-[24px]">
            {/* Notifications icon + dropdown */}
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

            <NotificationsDropdown
              isOpen={isNotificationsOpen}
              isLoggedIn={isLoggedIn}
              unreadCount={unreadCount}
              notifications={notifications}
              isLoading={isLoadingNotifications}
              activeFilter={activeFilter}
              onChangeFilter={setActiveFilter}
              onMarkAllRead={markAllAsReadFunction}
              onMarkOneRead={markAsReadFunction}
            />

            {/* Cart */}
            <CartButton count={cartItemCount} />
            {/* User menu */}
            <UserMenu
              isOpen={isUserMenuOpen}
              isLoggedIn={isLoggedIn}
              authUser={authUser}
              onToggle={() => { setIsUserMenuOpen(v => !v); setIsNotificationsOpen(false); setIsCategoryOpen(false); }}
      
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;