import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ChangePasswordForm {
  newPassword: string;
  confirmPassword: string;
}


const ChangeForgotPasswordPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ChangePasswordForm>();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromURL = params.get("token");
    setToken(tokenFromURL);
  }, [location.search]);

  const onSubmit = async (data: ChangePasswordForm) => {
    if (!token) {
      toast.error("Token is invalid or expired.");
      return;
    }

    try {
      setIsLoading(true);
      
      // Simulate password reset API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Static password reset for token:", token, "New password length:", data.newPassword.length);

      toast.success("Mật khẩu đã được thay đổi thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (error: any) {
      toast.error(error?.message || "Thay đổi mật khẩu thất bại!");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Form */}
      <div className="w-2/2 bg-gray-50 flex flex-col justify-center items-center p-8">
        <h2 className="text-3xl font-bold text-black mb-4">Reset Password</h2>
        <p className="text-black mb-6 text-center">Please enter your new password</p>

        <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mb-3">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              {...register("newPassword", {
                required: "Please enter your new password!",
                minLength: { value: 6, message: "At least 6 characters!" }
              })}
              className="w-full p-3 rounded-md border text-black bg-white"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={isLoading}
            >
              {showNewPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
          {errors.newPassword && <p className="text-red-500 mb-3">{errors.newPassword.message}</p>}

          <div className="relative mb-3">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password!",
                validate: (value) => value === watch("newPassword") || "Passwords do not match!"
              })}
              className="w-full p-3 rounded-md border text-black bg-white"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold cursor-pointer 
            transition-all duration-300 transform hover:scale-105 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95 relative"
          >
            {isLoading ? (
              <>
                <span className="opacity-0">Confirm Password Change</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                </div>
              </>
            ) : (
              "Confirm Password Change"
            )}
          </button>
        </form>
      </div>

      {/* Right side - Branding */}
    </div>
  );
};

export default ChangeForgotPasswordPage;
