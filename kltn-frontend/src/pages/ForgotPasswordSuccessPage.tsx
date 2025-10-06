import React from "react";
import { CheckCircle2 } from "lucide-react";


const ForgotPasswordSuccessPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Left side - Success message */}
      <div className="w-2/2 bg-gray-50 flex flex-col justify-center items-center p-8">
        <div className="text-center max-w-md">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-black mb-4">Thành công !</h2>
          <p className="text-black">
            Chúng tôi đã gửi email để thay đổi mật khẩu của bạn. Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn.
            </p>
          <a
            href="/user/login"
            className="inline-block mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-700 shadow-md"
          >
            Đi đến Đăng nhập
          </a>
        </div>
      </div>

 
    </div>
  );
};

export default ForgotPasswordSuccessPage;
