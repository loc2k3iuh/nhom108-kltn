// src/pages/NotAuthenticated.tsx
import { useAuthStore } from "@/stores/useAuthStore";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NotAuthenticated: React.FC = () => {
  const { logOut } = useAuthStore();
  const navigate = useNavigate();
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const handleLogout = async () => {
      try {
        await logOut();
        toast.info("Tài khoản của bạn đã bị vô hiệu hóa !");
        navigate("/login");
      } catch (error) {
        console.error("Log out fail ", error);
      }
    };
    handleLogout();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Loading Spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>

      {/* Loading Text */}
      <div className="mt-6 text-center">
        <h1 className="text-xl font-semibold text-gray-700 mb-2">
          Đang xử lý...
        </h1>
        <p className="text-gray-500">
          Tài khoản của bạn đã bị vô hiệu hóa. Đang chuyển hướng...
        </p>
      </div>

      {/* Loading dots animation */}
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  );
};

export default NotAuthenticated;
