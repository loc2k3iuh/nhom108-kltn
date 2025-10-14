import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { verifyRegistration } from "@/services/useAuthService";

const RegisterSuccessPage: React.FC = () => {
  const location = useLocation();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");
    const emailFromURL = params.get("email");

    if (!tokenFromURL || !emailFromURL) {
      setStatus("error");
      setErrorMessage("Liên kết xác thực không hợp lệ hoặc thiếu thông tin.");
      toast.error("Token hoặc email không hợp lệ.");
      return;
    }

    (async () => {
      try {
        setStatus("loading");
        await verifyRegistration({ token: tokenFromURL, email: emailFromURL });
        setStatus("success");
        toast.success("Email đã được xác nhận thành công!");
      } catch (err: any) {
        console.error("Error confirming email:", err);
        const msg = err?.response?.data?.message || "Xác nhận email thất bại. Vui lòng thử lại sau.";
        setErrorMessage(msg);
        setStatus("error");
        toast.error(msg);
      }
    })();
  }, [location.search]);

  return (
    <div className="flex h-screen">
      <div className="w-2/2 bg-gray-50 flex flex-col justify-center items-center p-8">
        <div className="text-center max-w-md">
          {status === "success" && (
            <>
              <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-black mb-4">Thành công!</h2>
              <p className="text-black">Tài khoản của bạn đã được xác thực thành công.</p>
              <a
                href="/login"
                className="inline-block mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-700 shadow-md"
              >
                Về trang đăng nhập
              </a>
            </>
          )}

          {status === "loading" && (
            <>
              <div className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              <h2 className="text-2xl font-semibold text-black mb-2">Đang xác thực...</h2>
              <p className="text-black">Vui lòng chờ trong giây lát.</p>
            </>
          )}

          {status === "error" && (
            <>
              <h2 className="text-3xl font-bold text-red-600 mb-4">Xác thực thất bại</h2>
              <p className="text-black">{errorMessage}</p>
              <a
                href="/login"
                className="inline-block mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-700 shadow-md"
              >
                Về trang đăng nhập
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccessPage;
