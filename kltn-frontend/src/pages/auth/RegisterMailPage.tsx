import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RegisterMailPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen">
      <div className="w-2/2 bg-gray-50 flex justify-center items-center p-8">
        <div className="text-center max-w-md">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-black mb-4">Đang xử lý!</h2>
          <p className="text-black">
            Chúng tôi đã gửi một email xác nhận đến địa chỉ của bạn. Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn trong email để hoàn tất quá trình đăng ký.
          </p>
          
          <div className="mt-2 text-sm text-gray-600">
            Vui lòng kiểm tra email của bạn
          </div>
          
          <button
            onClick={() => navigate("/login")}
            className="inline-block mt-4 py-2 px-6 rounded-lg font-semibold transition-all duration-300 shadow-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
           Quay về trang đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterMailPage;
