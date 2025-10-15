import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";


const ForgotPasswordSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen">
      {/* Left side - Success message */}
      <div className="w-2/2 bg-gray-50 flex flex-col justify-center items-center p-8">
        <div className="text-center max-w-md">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-black mb-4">Thành công !</h2>
          <p className="text-black">
            Mật khẩu của bạn đã được cập nhật lại !
            </p>
          <span
            onClick={() => navigate("/login")}
            className="inline-block mt-6 cursor-pointer bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-700 shadow-md"
          >
           Trở về trang Đăng nhập
          </span>
        </div>
      </div>

 
    </div>
  );
};

export default ForgotPasswordSuccessPage;
