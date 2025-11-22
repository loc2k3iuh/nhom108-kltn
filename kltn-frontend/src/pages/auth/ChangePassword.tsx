import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faKey } from "@fortawesome/free-solid-svg-icons";
import UserSidebar from "../../components/UserSidebar";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { changePasswordService } from "@/services/useUserService";
import { useAuthStore } from "@/stores/useAuthStore";

const validatedPasswordMessage = "Mật khẩu phải có ít nhất 8 ký tự !";
const changePasswordSchema = yup.object({
  current_password: yup
    .string()
    .nonNullable()
    .required()
    .trim()
    .min(8, validatedPasswordMessage),
  new_password: yup
    .string()
    .nonNullable()
    .required()
    .min(8, validatedPasswordMessage),
  retype_new_password: yup
    .string()
    .nonNullable()
    .required()
    .oneOf([yup.ref("new_password")], "Mật khẩu phải trùng !"),
});

type changePasswordForm = yup.InferType<typeof changePasswordSchema>;

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { logOut } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<changePasswordForm>({
    resolver: yupResolver(changePasswordSchema) as any,
    defaultValues: {
      current_password: "",
      new_password: "",
      retype_new_password: "",
    },
  });

  const onSubmit = async (data: changePasswordForm) => {
    try {
      setIsLoading(true);
      await changePasswordService(data);

      const response = await logOut();
      if(response){
        navigate("/login");
        toast.success("Đổi mật khẩu thành công vui lòng đăng nhập lại !");
      }else{
        toast.error("Đổi mật khẩu thất bại !");
      }
    } catch (error : any) {
      console.error("Change password failed:", error?.response?.data?.message );
      toast.error("Đổi mật khẩu thất bại !");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
  <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row">
        <UserSidebar />

        <div className="w-full md:w-3/4 space-y-4 ml-0 mt-3 md:mt-0 md:ml-6 bg-white p-4 rounded shadow-md">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faKey} size="2x" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Đổi Mật Khẩu
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Old Password */}
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  id="oldPassword"
                  aria-invalid={!!errors.current_password}
                  aria-describedby={errors.current_password ? "current_password_error" : undefined}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.current_password ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  {...register("current_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <FontAwesomeIcon
                    icon={showOldPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              {errors.current_password && (
                <p id="current_password_error" className="mt-1 text-sm text-red-600">
                  {String(errors.current_password.message)}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  aria-invalid={!!errors.new_password}
                  aria-describedby={errors.new_password ? "new_password_error" : undefined}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.new_password ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  {...register("new_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <FontAwesomeIcon
                    icon={showNewPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              {errors.new_password && (
                <p id="new_password_error" className="mt-1 text-sm text-red-600">
                  {String(errors.new_password.message)}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nhập lại mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  
                  id="confirmPassword"
                  aria-invalid={!!errors.retype_new_password}
                  aria-describedby={errors.retype_new_password ? "retype_new_password_error" : undefined}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.retype_new_password ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  {...register("retype_new_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
              {errors.retype_new_password && (
                <p id="retype_new_password_error" className="mt-1 text-sm text-red-600">
                  {String(errors.retype_new_password.message)}
                </p>
              )}
            </div>

            {/* Password requirements */}
            <div className="p-3 bg-blue-50 text-sm text-red-500 rounded-md">
              <h3 className="font-semibold">Yêu cầu mật khẩu:</h3>
              <ul className="list-disc ml-5 mt-1">
                <li>Ít nhất 8 ký tự</li>
              </ul>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-200 w-1/2 cursor-pointer"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#C92127] text-white rounded-md hover:bg-[#a71b20] transition duration-200 disabled:bg-gray-400 w-1/2 cursor-pointer relative"
              >
                {isLoading ? (
                  <>
                    <span className="opacity-0">Đổi mật khẩu</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                    </div>
                  </>
                ) : (
                  "Đổi mật khẩu"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;