import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaTshirt } from "react-icons/fa";
import { sendMailForgotPasswordService } from "@/services/useAuthService";

interface ForgotPasswordForm {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsLoading(true);
      await sendMailForgotPasswordService(data.email);
      toast.success("Chúng tôi đã gửi mã xác nhận đến mail của bạn !");
    } catch (error: any) {
      toast.error(error?.response?.data?.message  || "Không thể gửi email !");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-[#F0F0F0] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left - Branding */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#C92127] to-[#a71b20] p-8 flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center mb-8">
              <FaTshirt className="text-3xl mr-3" />
              <h1 className="text-2xl font-bold">DAVINCI</h1>
            </div>
            <h2 className="text-3xl font-bold mb-6">Quên mật khẩu?</h2>
            <p className="text-white/80 mb-8">
              Đừng lo! Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại
              mật khẩu ngay lập tức.
            </p>
          </div>

          {/* SVG illustration (same tông với trang đăng nhập) */}
          <div className="hidden md:block">
            <svg
              className="w-full max-w-md mx-auto"
              viewBox="0 0 600 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M234,307c14.2-6.3,33.1-10.1,46-18c13.4-8.2,23.5-21.6,33.5-33.5c8.5-10.2,19.1-19.1,24.5-31.5c6-13.8,10.3-28.8,11-44c0.8-16-3.3-32.6-11-46c-8.1-14.1-22.9-24.2-37-31c-15.8-7.5-33.2-8.9-51-10c-19.6-1.2-40.8,0.9-57,12c-15.5,10.6-23,29.3-32,45c-9.6,16.8-17.9,34-21,53c-3.5,21.4-4.8,45.8,7,64c10.9,16.8,30.5,27,51,30C210.8,319.2,219.3,313.6,234,307z"
                fill="#ffcabd"
              />
              <path
                d="M456,224c0,57.438-65.223,104-145.667,104S258.5,280.5,204.5,232.5s-69.436-128.587-18-163C246.5,25.5,310.333,16.562,456,224z"
                fill="#ffab91"
              />
              <ellipse cx="284" cy="228" rx="65" ry="55" fill="#f9f9f9" />
              <ellipse cx="284" cy="228" rx="55" ry="45" fill="#ffffff" />
              <path
                d="M284,265c-23.71,0-43-16.58-43-37s19.29-37,43-37s43,16.58,43,37S307.71,265,284,265z"
                fill="#c92127"
              />
              <ellipse cx="284" cy="228" rx="33" ry="27" fill="#ffffff" />
              <circle cx="275" cy="222" r="10" fill="#333333" />
              <circle cx="293" cy="222" r="10" fill="#333333" />
              <circle cx="277" cy="219" r="3" fill="#ffffff" />
              <circle cx="295" cy="219" r="3" fill="#ffffff" />
            </svg>
          </div>

          <div className="hidden md:block mt-8">
            <p className="text-white/80 text-sm">© 2025 DAVINCI. Mọi quyền được bảo lưu.</p>
          </div>
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Đặt lại mật khẩu</h2>
            <p className="text-gray-600 mb-8">Nhập email của bạn để nhận liên kết đặt lại mật khẩu</p>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                <div
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
                    activeInput === "email" ? "text-[#C92127]" : ""
                  }`}
                >
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  placeholder="Email của bạn"
                  {...register("email", {
                    required: "Vui lòng nhập email!",
                    pattern: {
                      value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                      message: "Email không hợp lệ!",
                    },
                  })}
                  className={`w-full py-3 pl-10 pr-4 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } ${
                    activeInput === "email" ? "border-[#C92127] ring-1 ring-[#C92127]" : ""
                  } focus:outline-none transition-all duration-200 text-black bg-white`}
                  disabled={isLoading}
                  onFocus={() => setActiveInput("email")}
                  onBlur={() => setActiveInput(null)}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-[#C92127] hover:bg-[#a71b20] text-white py-3 rounded-lg font-semibold transition-all duration-200 relative overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:bg-opacity-70 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="opacity-0">Gửi email đặt lại mật khẩu</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                    </div>
                  </>
                ) : (
                  "Gửi email đặt lại mật khẩu"
                )}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-8">
              <span
                onClick={() => navigate("/login")}
                className="text-[#C92127] hover:text-[#a71b20] font-medium transition-colors cursor-pointer"
                tabIndex={isLoading ? -1 : 0}
              >
                Quay lại trang đăng nhập
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;