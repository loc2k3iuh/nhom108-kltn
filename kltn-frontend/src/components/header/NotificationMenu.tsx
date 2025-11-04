import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { NotificationType, NotificationResponseDTO } from '@/types/notification';
import { UserResponse } from '@/types/responses/userResponse';

interface NotificationMenuProps {
  authUser: UserResponse | null;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({ authUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('vuvisa_access_token');
      const userData = localStorage.getItem('vuvisa_user_data');

      if (token && userData) {
        setUnreadCount(5);
        setNotifications([
          {
            id: 1,
            title: 'Đơn hàng #123 đã được xác nhận',
            message: 'Đơn hàng của bạn đang được xử lý',
            createdAt: '2024-01-15T10:00:00',
            isRead: false,
            type: NotificationType.ORDER,
            originalType: 'ORDER',
          },
          {
            id: 2,
            title: 'Khuyến mãi đặc biệt',
            message: 'Giảm giá 50% cho tất cả sản phẩm',
            createdAt: '2024-01-14T15:30:00',
            isRead: true,
            type: NotificationType.PROMOTION,
            originalType: 'PROMOTION',
          },
          {
            id: 3,
            title: 'Đơn hàng #124 đã giao thành công',
            message: 'Cảm ơn bạn đã mua sắm tại VuVisa',
            createdAt: '2024-01-13T09:45:00',
            isRead: false,
            type: NotificationType.ORDER,
            originalType: 'ORDER',
          },
        ]);
      } else {
        setUnreadCount(0);
        setNotifications([]);
      }
    };

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const toggleNotifications = () => {
    setIsOpen((prev) => !prev);

    if (!isOpen) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const getFilteredNotifications = () => {
    if (activeFilter === 'all') return notifications;
    return (notifications ?? []).filter((notification) => notification.type === activeFilter);
  };

  const changeFilter = (filter: NotificationType | 'all') => {
    setActiveFilter(filter);
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    setUnreadCount(0);
    toast.success('Đã đánh dấu tất cả là đã đọc!');
  };

  const formatDate = (dateString: string | number[]) => {
    let date: Date;

    if (Array.isArray(dateString)) {
      date = new Date(
        dateString[0],
        dateString[1] - 1,
        dateString[2],
        dateString[3],
        dateString[4],
        dateString[5]
      );
    } else {
      date = new Date(dateString);
    }

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    if (diffDays === 0) return `Hôm nay, ${formattedTime}`;
    if (diffDays === 1) return `Hôm qua, ${formattedTime}`;
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <>
      <div
        className="hidden md:flex flex-col cursor-pointer justify-center items-center group min-w-[60px]"
        onClick={toggleNotifications}
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <rect className="fill-none" width="24" height="24" />
            <path
              className="fill-none stroke-[#7a7e7f] group-hover:md:stroke-[#5A5E5F] stroke-[2] stroke-linecap-round stroke-linejoin-round"
              d="M10,5a2,2,0,1,1,4,0,7.008,7.008,0,0,1,4,6.006v3a4,4,0,0,0,2,3H4a4,4,0,0,0,2-3v-3A7.008,7.008,0,0,1,10,5"
            />
            <path
              className="fill-none stroke-[#7a7e7f] hgroup-hover:md:stroke-[#5A5E5F] stroke-[2] stroke-linecap-round stroke-linejoin-round"
              d="M9,17v1a3,3,0,0,0,6.006,0V17"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#C92127] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#7A7E7F] group-hover:md:stroke-[#5A5E5F] whitespace-nowrap">
          Thông báo
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-[70px] right-[100px] bg-white shadow-lg rounded-md p-3 w-[350px] z-20">
          <div className="flex justify-between items-center border-b pb-2 mb-3 border-gray-300">
            <h3 className="font-semibold text-lg">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markAllAsRead();
                }}
                className="text-xs text-[#C92127] hover:text-[#a71b20]"
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>

          {authUser ? (
            <>
              <div className="flex mb-3 border-b border-gray-300">
                <button
                  onClick={() => changeFilter('all')}
                  className={`px-3 py-1 text-sm cursor-pointer ${
                    activeFilter === 'all'
                      ? 'text-[#C92127] border-b-2 border-[#C92127]'
                      : 'text-gray-600'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => changeFilter(NotificationType.ORDER)}
                  className={`px-3 py-1 text-sm cursor-pointer ${
                    activeFilter === NotificationType.ORDER
                      ? 'text-[#C92127] border-b-2 border-[#C92127]'
                      : 'text-gray-600'
                  }`}
                >
                  Đơn hàng
                </button>
                <button
                  onClick={() => changeFilter(NotificationType.PROMOTION)}
                  className={`px-3 py-1 text-sm cursor-pointer ${
                    activeFilter === NotificationType.PROMOTION
                      ? 'text-[#C92127] border-b-2 border-[#C92127]'
                      : 'text-gray-600'
                  }`}
                >
                  Khuyến mãi
                </button>
                <button
                  onClick={() => changeFilter(NotificationType.SYSTEM)}
                  className={`px-3 py-1 text-sm cursor-pointer ${
                    activeFilter === NotificationType.SYSTEM
                      ? 'text-[#C92127] border-b-2 border-[#C92127]'
                      : 'text-gray-600'
                  }`}
                >
                  Hệ thống
                </button>
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C92127]"></div>
                  </div>
                ) : (getFilteredNotifications() ?? []).length > 0 ? (
                  (getFilteredNotifications() ?? []).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-2 mb-2 rounded-md ${
                        notification.isRead ? 'bg-white' : 'bg-[#f8f9fa]'
                      } hover:bg-gray-100 cursor-pointer border-b border-gray-300`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!notification.isRead) markAsRead(notification.id);
                      }}
                    >
                      <div className="flex justify-between">
                        <h4 className={`text-sm ${notification.isRead ? 'font-normal' : 'font-semibold'}`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-[#C92127] rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.message.replace(/<[^>]*>/g, '')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(notification.createdAt)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">Không có thông báo nào</p>
                )}
              </div>

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
            <div className="py-8 px-4 text-center">
              <div className="flex justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#C92127"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">
                Chức năng này chỉ hỗ trợ cho người dùng đã đăng nhập
              </p>
              <div className="flex justify-center gap-2">
                <a
                  href="/signin"
                  className="bg-[#C92127] text-white px-4 py-2 rounded-md text-sm hover:bg-[#a71b20] transition-colors"
                >
                  Đăng nhập
                </a>
                <a
                  href="/signup"
                  className="border border-[#C92127] text-[#C92127] px-4 py-2 rounded-md text-sm hover:bg-[#f8d7da] transition-colors"
                >
                  Đăng ký
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationMenu;
