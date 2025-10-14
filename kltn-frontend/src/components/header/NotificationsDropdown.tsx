import React from "react";
import { toast } from "sonner";

export enum NotificationType {
  CALENDAR = 'CALENDAR',
  ORDER = 'ORDER',
  PRODUCT = 'PRODUCT',
  PROMOTION = 'PROMOTION',
  SYSTEM = 'SYSTEM'
}

export interface NotificationResponseDTO {
  id: number;
  title: string;
  message: string;
  createdAt: string | number[];
  isRead: boolean;
  type: NotificationType;
}

export interface NotificationsDropdownProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  unreadCount: number;
  notifications: NotificationResponseDTO[];
  isLoading: boolean;
  activeFilter: NotificationType | 'all';
  onChangeFilter: (f: NotificationType | 'all') => void;
  onMarkAllRead: () => void;
  onMarkOneRead: (id: number) => void;
}

function formatDateArray(dateArray: number[]): string {
  const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5]);
  const now = new Date();
  const diffDays = Math.floor(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  const h = date.getHours();
  const m = date.getMinutes();
  const time = `${h}:${m < 10 ? '0' + m : m}`;
  if (diffDays === 0) return `Hôm nay, ${time}`;
  if (diffDays === 1) return `Hôm qua, ${time}`;
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  isLoggedIn,
  unreadCount,
  notifications,
  isLoading,
  activeFilter,
  onChangeFilter,
  onMarkAllRead,
  onMarkOneRead,
}) => {
  if (!isOpen) return null;
  const filtered = activeFilter === 'all' ? notifications : notifications.filter(n => n.type === activeFilter);

  return (
    <div className="absolute top-[70px] right-[100px] bg-white shadow-lg rounded-md p-3 w-[350px] z-20">
      <div className="flex justify-between items-center border-b pb-2 mb-3 border-gray-300">
        <h3 className="font-semibold text-lg">Thông báo</h3>
        {isLoggedIn && unreadCount > 0 && (
          <button onClick={onMarkAllRead} className="text-xs text-[#C92127] hover:text-[#a71b20] cursor-pointer">Đánh dấu đã đọc tất cả</button>
        )}
      </div>

      {isLoggedIn ? (
        <>
          <div className="flex mb-3 border-b border-gray-300">
            {[
              { key: 'all' as const, label: 'Tất cả' },
              { key: NotificationType.ORDER as const, label: 'Đơn hàng' },
              { key: NotificationType.PROMOTION as const, label: 'Khuyến mãi' },
              { key: NotificationType.SYSTEM as const, label: 'Hệ thống' },
            ].map((t) => (
              <button
                key={String(t.key)}
                onClick={() => onChangeFilter(t.key)}
                className={`px-3 py-1 text-sm cursor-pointer ${activeFilter === t.key ? 'text-[#C92127] border-b-2 border-[#C92127]' : 'text-gray-600'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#C92127]"></div>
              </div>
            ) : filtered.length > 0 ? (
              filtered.map((n) => (
                <div
                  key={n.id}
                  className={`p-2 mb-2 rounded-md ${n.isRead ? 'bg-white' : 'bg-[#f8f9fa]'} hover:bg-gray-100 cursor-pointer border-b border-gray-300`}
                  onClick={() => { if (!n.isRead) onMarkOneRead(n.id); }}
                >
                  <div className="flex justify-between">
                    <h4 className={`text-sm ${n.isRead ? 'font-normal' : 'font-semibold'}`}>{n.title}</h4>
                    {!n.isRead && <span className="w-2 h-2 bg-[#C92127] rounded-full"></span>}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{n.message.replace(/<[^>]*>/g, '')}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Array.isArray(n.createdAt) ? formatDateArray(n.createdAt as number[]) : (() => {
                      const d = new Date(n.createdAt as string);
                      const now = new Date();
                      const diffDays = Math.floor(Math.abs(now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
                      const h = d.getHours();
                      const m = d.getMinutes();
                      const time = `${h}:${m < 10 ? '0' + m : m}`;
                      if (diffDays === 0) return `Hôm nay, ${time}`;
                      if (diffDays === 1) return `Hôm qua, ${time}`;
                      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                    })()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Không có thông báo nào</p>
            )}
          </div>

          <div className="text-center mt-3 pt-2 border-t border-gray-300">
            <a href="/notifications" className="text-[#C92127] text-sm font-semibold hover:text-[#a71b20]">Xem tất cả thông báo</a>
          </div>
        </>
      ) : (
        <div className="py-8 px-4 text-center">
          <div className="flex justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#C92127" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Chức năng này chỉ hỗ trợ cho người dùng đã đăng nhập</p>
          <div className="flex justify-center gap-2">
            <a href="/user/login" className="bg-[#C92127] text-white px-4 py-2 rounded-md text-sm hover:bg-[#a71b20] transition-colors">Đăng nhập</a>
            <a href="/user/register" className="border border-[#C92127] text-[#C92127] px-4 py-2 rounded-md text-sm hover:bg-[#f8d7da] transition-colors">Đăng ký</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
