import React from "react";
import { UserResponse } from "@/types/responses/userResponse";
import { useNavigate } from "react-router-dom"; 
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import smallLogo from "../../assets/img/small.png";

interface UserMenuProps {
  isOpen: boolean;
  authUser: UserResponse | null;
  onToggle: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, authUser, onToggle }) => {
  const {isLoading, logOut} = useAuthStore();
  const navigate = useNavigate();

  const onLogout = async () => {
    const isSuccess = await logOut();
    if(isSuccess) {
      navigate("/");
      toast.success("Đăng xuất thành công !");
    }else{
      toast.error("Không thể đăng xuất !");
    }
  }
  return (
    <div className="flex flex-col cursor-pointer justify-center items-center relative">
      <div onClick={onToggle} className="flex flex-col items-center">
        {authUser ? (
          <div className="w-[24px] h-[24px] rounded-full overflow-hidden border border-gray-200">
            <img
              src={authUser.avatar_url ?? smallLogo}
              alt={authUser.full_name || authUser.username}
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
        <span className="text-[12px] text-white md:text-[#7A7E7F] hidden md:block">{authUser?.username || "Người dùng"}</span>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+15px)] right-0 bg-white shadow-md rounded-md p-4 w-[300px] z-10">
          { authUser ? (
            <>
              <div className="flex flex-col">
                <span  onClick={() => {navigate("/profile")}} className="flex items-center p-4 border-b border-gray-100">
                  <div className="w-[40px] h-[40px] relative rounded-full bg-[#FFE8E2] mr-3 flex items-center justify-center">
                    <span className="text-[#E57905]">

                        <img
                         src={authUser.avatar_url ?? smallLogo}
                         alt={authUser.full_name || authUser.username}
                         className="w-full h-full object-cover"
                        />

                    </span>
                    {authUser.avatar_url && (
                      <img src={authUser.avatar_url} alt={authUser.full_name || authUser.username} className="absolute inset-0 w-full h-full object-cover rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{authUser.full_name || authUser.username}</h3>
                    <p className="text-sm text-gray-500">Thành viên Davinci</p>
                  </div>
                  <div className="text-gray-400">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 6L15 12L9 18"></path>
                    </svg>
                  </div>
                </span>
              </div>

              <span onClick={() => {navigate("/orders")}} className="flex items-center p-3 hover:bg-gray-50">
                <div className="w-8 h-8 flex items-center justify-center mr-3 text-gray-500">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 7H15" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11H15" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 15H12" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-gray-600">Đơn hàng của tôi</span>
              </span>

              <span onClick={() => {navigate("/favorites")}} className="flex items-center p-3 hover:bg-gray-50">
                <div className="w-8 h-8 flex items-center justify-center mr-3 text-gray-500">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-gray-600">Sản phẩm yêu thích</span>
              </span>

                <span onClick={() => {navigate("/reviews")}} className="flex items-center p-3 hover:bg-gray-50">
                <div className="w-8 h-8 flex items-center justify-center mr-3 text-gray-500">
    <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
      <path
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          stroke="#666"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
      />
    </svg>
                </div>
                <span className="text-gray-600">Đánh giá của tôi</span>
              </span>

              <span onClick={() => {navigate("/voucher")}} className="flex items-center p-3 hover:bg-gray-50">
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
              </span>

              <button onClick={onLogout} disabled={isLoading} className="flex items-center p-3 hover:bg-gray-50 border-t border-gray-100 w-full text-left cursor-pointer">
                <div className="w-8 h-8 flex items-center justify-center mr-3 text-gray-500">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                {isLoading ? (
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
              <span onClick={() => navigate("/register")} className="text-sm bg-[#C92127] text-white hover:bg-[#a71b20] py-2 px-4 rounded-md mb-2 text-center block w-full cursor-pointer">Đăng ký</span>
              <span onClick={() => navigate("/login")} className="text-sm bg-white text-[#C92127] border border-[#C92127] hover:bg-[#f8d7da] py-2 px-4 rounded-md text-center block w-full cursor-pointer">Đăng nhập</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
