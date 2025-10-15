import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { FaTshirt } from "react-icons/fa";
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { registerUser } from "@/services/useUserService";

const registerSchema = yup.object({
  username: yup
    .string()
    .required()
    .trim()
    .min(5, "Username phải có ít nhất 5 ký tự !"),
  email: yup
    .string()
    .required()
    .trim()
    .matches(
      /^[A-Za-z0-9._%+-]+@gmail\.com$/,
      "email phải có định dạng example@gmail.com"
    ),
  fullName: yup
    .string()
    .required()
    .trim()
    .min(5, "Full name phải có ít nhất 5 ký tự !"),
  password: yup
    .string()
    .required()
    .trim()
    .min(8, "Password phải có ít nhất 8 ký tự !"),
  retypePassword: yup
    .string()
    .required()
    .trim()
    .oneOf([yup.ref("password")], "Password phải trùng !"),
  file: yup
    .mixed<File>()
    .nullable()
    .transform((value: FileList) =>
      value && value.length > 0 ? value[0] : null
    )
    .test("fileSize", "Ảnh phải nhỏ hơn 5 MB !", (file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024;
    })
    .test(
      "fileType",
      "Chỉ file .png, .jpg, .jpeg, .jtif được chấp nhận !",
      (file) => {
        if (!file) return true;
        return ["image/png", "image/jpg", "image/jpeg", "image/jfif"].includes(
          file.type
        );
      }
    ),
});

type RegisterUserForm = yup.InferType<typeof registerSchema>;
const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserForm>({
    resolver: yupResolver(registerSchema) as any,
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      password: "",
      retypePassword: "",
      file: null,
    },
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterUserForm) => {
    setIsLoading(true);
    setError(null);
    
    try {

      await registerUser(data);

      toast.success("Đăng ký thành công, vui lòng xác nhận email của bạn!");
      navigate("/register-mail");
      
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError(error.message || "Đăng ký thất bại. Vui lòng thử lại.");
      toast.error("Đăng ký thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-[#F0F0F0] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#C92127] to-[#a71b20] p-8 flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center mb-8">
              <FaTshirt className="text-3xl mr-3" />
              <h1 className="text-2xl font-bold">DAVINCI</h1>
            </div>
            <h2 className="text-3xl font-bold mb-6">Tạo tài khoản mới!</h2>
            <p className="text-white/80 mb-8">
              Đăng ký tài khoản để trải nghiệm đầy đủ các tính năng của DAVINCI.
              Khám phá thế giới thời trang, được tham gia các chương trình
              khuyến mãi độc quyền và theo dõi đơn hàng thời trang dễ dàng.
            </p>
          </div>

          {/* SVG illustration for register page */}
          <div className="hidden md:block">
            <svg
              className="w-full max-w-md mx-auto"
              viewBox="0 0 600 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M310,270c-30,5-62,8-80-15c-12-15-12-38-5-55c9-21,28-33,38-53c11-23,14-49,28-70c10-15,26-28,44-31c21-4,42,2,62,10c22,9,43,21,57,40c13,19,18,45,10,67c-7,20-24,33-40,45c-19,13-40,26-62,29C343,240,335,265,310,270z"
                fill="#ffcabd"
              />
              <path
                d="M380,210c0,0,51.81-29,95-22s155,94,56,126s-220,58-249-35S380,210,380,210z"
                fill="#ffab91"
              />
              <circle cx="240" cy="190" r="26" fill="#ffffff" />
              <circle cx="340" cy="190" r="26" fill="#ffffff" />
              <path
                d="M290,275c-30,0-57-16-68-40h136C347,259,320,275,290,275z"
                fill="#c92127"
              />
              <rect
                x="190"
                y="90"
                width="200"
                height="40"
                rx="20"
                fill="#ffffff"
              />
              <rect
                x="240"
                y="70"
                width="100"
                height="30"
                rx="15"
                fill="#ffffff"
              />
              <rect
                x="265"
                y="50"
                width="50"
                height="30"
                rx="15"
                fill="#ffffff"
              />
              <path
                d="M290,110v140"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M330,110L290,250"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M250,110L290,250"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="245" cy="190" r="10" fill="#333333" />
              <circle cx="335" cy="190" r="10" fill="#333333" />
              <circle cx="245" cy="185" r="3" fill="#ffffff" />
              <circle cx="335" cy="185" r="3" fill="#ffffff" />
            </svg>
          </div>

          <div className="hidden md:block mt-8">
            <p className="text-white/80 text-sm">
              © 2024 DAVINCI. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng Ký</h2>
            <p className="text-gray-600 mb-6">
              Cùng tạo tài khoản và trở thành thành viên của DAVINCI
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <div
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
                    activeInput === "username" ? "text-[#C92127]" : ""
                  }`}
                >
                  <FaUser />
                </div>
                <input
                  type="text"
                  id="username"
                  {...register("username")}
                  className={`w-full py-3 pl-10 pr-4 rounded-lg border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } ${
                    activeInput === "username"
                      ? "border-[#C92127] ring-1 ring-[#C92127]"
                      : ""
                  } focus:outline-none transition-all duration-200`}
                  placeholder="Tên đăng nhập"
                  disabled={isLoading}
                  onFocus={() => setActiveInput("username")}
                  onBlur={() => setActiveInput(null)}
                  
                />
              </div>
              {errors.username && (
                <div className="text-red-500 text-sm mt-1 ml-1">
                  {errors.username.message}
                </div>
              )}

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
                  placeholder="Email"
                  id="email"
                  {...register("email")}
                  className={`w-full py-3 pl-10 pr-4 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } ${
                    activeInput === "email"
                      ? "border-[#C92127] ring-1 ring-[#C92127]"
                      : ""
                  } focus:outline-none transition-all duration-200`}
                  disabled={isLoading}
                  onFocus={() => setActiveInput("email")}
                  onBlur={() => setActiveInput(null)}
                
                />
              </div>
              {errors.email && (
                <div className="text-red-500 text-sm mt-1 ml-1">
                  {errors.email.message}
                </div>
              )}

              <div className="relative">
                <div
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
                    activeInput === "fullName" ? "text-[#C92127]" : ""
                  }`}
                >
                  <FaIdCard />
                </div>
                <input
                  type="text"
                  placeholder="Họ và tên"
                  id="fullName"
                  {...register("fullName")}
                  className={`w-full py-3 pl-10 pr-4 rounded-lg border ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  } ${
                    activeInput === "fullName"
                      ? "border-[#C92127] ring-1 ring-[#C92127]"
                      : ""
                  } focus:outline-none transition-all duration-200`}
                  disabled={isLoading}
                  onFocus={() => setActiveInput("fullName")}
                  onBlur={() => setActiveInput(null)}
                  
                />
              </div>
              {errors.fullName && (
                <div className="text-red-500 text-sm mt-1 ml-1">
                  {errors.fullName.message}
                </div>
              )}

              <div className="relative">
                <div
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
                    activeInput === "password" ? "text-[#C92127]" : ""
                  }`}
                >
                  <FaLock />
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Mật khẩu"
                    {...register("password")}
                    className={`w-full py-3 pl-10 pr-12 rounded-lg border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } ${
                      activeInput === "password"
                        ? "border-[#C92127] ring-1 ring-[#C92127]"
                        : ""
                    } focus:outline-none transition-all duration-200`}
                    disabled={isLoading}
                    onFocus={() => setActiveInput("password")}
                    onBlur={() => setActiveInput(null)}
                    
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <div className="text-red-500 text-sm mt-1 ml-1">
                  {errors.password.message}
                </div>
              )}

              <div className="relative">
                <div
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${
                    activeInput === "confirmPassword" ? "text-[#C92127]" : ""
                  }`}
                >
                  <FaLock />
                </div>

                <input
                  type={showRetypePassword ? "text" : "password"}
                  id="retypePassword"
                  {...register("retypePassword")}
                  placeholder="Xác nhận mật khẩu"
                  className={`w-full py-3 pl-10 pr-12 rounded-lg border ${
                    errors.retypePassword ? "border-red-500" : "border-gray-300"
                  } ${
                    activeInput === "confirmPassword"
                      ? "border-[#C92127] ring-1 ring-[#C92127]"
                      : ""
                  } focus:outline-none transition-all duration-200`}
                  disabled={isLoading}
                  onFocus={() => setActiveInput("confirmPassword")}
                  onBlur={() => setActiveInput(null)}
                  
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowRetypePassword(!showRetypePassword)}
                  tabIndex={-1}
                >
                  {showRetypePassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.retypePassword && (
                <div className="text-red-500 text-sm mt-1 ml-1">
                  {errors.retypePassword.message}
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh đại diện
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaUser className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <label
                      htmlFor="avatar-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      <FaImage className="mr-2 text-gray-500" />
                   
                        {(() => {
                      const { ref, onChange, ...rest } = register("file");
                      return (
                        <input
                          type="file"
                          accept="image/*"
                          {...rest}
                          ref={ref}
                          onChange={(e) => {
                            onChange(e);
                            const f = e.target.files?.[0];
                            setAvatarPreview(f ? URL.createObjectURL(f) : "");
                          }}
                        />
                      );
                    })()}
                    </label>
                    <p className="mt-1 text-sm text-gray-500">
                      JPG, JPEG, PNG hoặc GIF. Tối đa 5MB.
                    </p>
                    {errors.file && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.file.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C92127] hover:bg-[#a71b20] text-white py-3 rounded-lg font-semibold transition-all duration-200 relative overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:bg-opacity-70 mt-6"
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Đăng Ký</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                  </div>
                </>
              ) : (
                "Đăng Ký"
              )}
            </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Đã có tài khoản?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#C92127] hover:text-[#a71b20] font-medium transition-colors cursor-pointer"
              >
                Đăng nhập
              </span>
            </p>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default RegisterPage;
