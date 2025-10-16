import React, {  useState } from "react";
// Service imports removed - using static data
import { Toaster, toast } from "sonner";

import { FaBookOpen } from "react-icons/fa";
import { FaTshirt } from "react-icons/fa";
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaImage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [retypePassword, setRetypePassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const navigate = useNavigate();

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (confirm: string): boolean => {
    if (confirm.length < 6) {
      setConfirmPasswordError("Mật khẩu xác nhận phải có ít nhất 6 ký tự");
      return false;
    }
    if (confirm !== password) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    if (retypePassword) {
      validateConfirmPassword(retypePassword);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setRetypePassword(value);
    validateConfirmPassword(value);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files?.[0];

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh không được vượt quá 5MB");
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Chỉ chấp nhận các định dạng ảnh: JPEG, PNG, JPG và GIF");
        return;
      }

      setAvatar(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    if (isLoading) return; // Prevent multiple submissions

    if (!username) {
      toast.error("Vui lòng nhập tên đăng nhập");
      return;
    }
    
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }
    
    if (!fullName) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }
    
    if (!validatePassword(password)) {
      return;
    }
    
    if (!validateConfirmPassword(retypePassword)) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful registration
      const RegisterDTO = {
        username,
        email,
        password,
        retype_password: retypePassword,
        full_name: fullName,
        avatar: avatar || null,
      };

      // For demo, always succeed
      console.log("Static registration data:", RegisterDTO);

      setError(null);
      toast.success("Đăng ký thành công! Chuyển hướng đến xác nhận email sau 3 giây.");
      setTimeout(() => {
        window.location.href = `/user/register-mail?email=${email}`;
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("Đăng ký thất bại!");
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
  Khám phá thế giới thời trang, được tham gia các chương trình khuyến mãi độc quyền 
  và theo dõi đơn hàng thời trang dễ dàng.



            </p>
          </div>

          {/* SVG illustration for register page */}
          <div className="hidden md:block">
            <svg className="w-full max-w-md mx-auto" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
              <path d="M310,270c-30,5-62,8-80-15c-12-15-12-38-5-55c9-21,28-33,38-53c11-23,14-49,28-70c10-15,26-28,44-31c21-4,42,2,62,10c22,9,43,21,57,40c13,19,18,45,10,67c-7,20-24,33-40,45c-19,13-40,26-62,29C343,240,335,265,310,270z" fill="#ffcabd"/>
              <path d="M380,210c0,0,51.81-29,95-22s155,94,56,126s-220,58-249-35S380,210,380,210z" fill="#ffab91"/>
              <circle cx="240" cy="190" r="26" fill="#ffffff"/>
              <circle cx="340" cy="190" r="26" fill="#ffffff"/>
              <path d="M290,275c-30,0-57-16-68-40h136C347,259,320,275,290,275z" fill="#c92127"/>
              <rect x="190" y="90" width="200" height="40" rx="20" fill="#ffffff"/>
              <rect x="240" y="70" width="100" height="30" rx="15" fill="#ffffff"/>
              <rect x="265" y="50" width="50" height="30" rx="15" fill="#ffffff"/>
              <path d="M290,110v140" stroke="#ffffff" strokeWidth="5" strokeLinecap="round"/>
              <path d="M330,110L290,250" stroke="#ffffff" strokeWidth="5" strokeLinecap="round"/>
              <path d="M250,110L290,250" stroke="#ffffff" strokeWidth="5" strokeLinecap="round"/>
              <circle cx="245" cy="190" r="10" fill="#333333"/>
              <circle cx="335" cy="190" r="10" fill="#333333"/>
              <circle cx="245" cy="185" r="3" fill="#ffffff"/>
              <circle cx="335" cy="185" r="3" fill="#ffffff"/>
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
              <p className="text-gray-600 mb-6">Cùng tạo tài khoản và trở thành thành viên của DAVINCI</p>

              <div className="space-y-4">

                <div className="relative">
                  <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${activeInput === 'username' ? 'text-[#C92127]' : ''}`}>
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 ${activeInput === 'username' ? 'border-[#C92127] ring-1 ring-[#C92127]' : ''} focus:outline-none transition-all duration-200`}
                    placeholder="Tên đăng nhập"
                    disabled={isLoading}
                    onFocus={() => setActiveInput('username')}
                    onBlur={() => setActiveInput(null)}
                    required
                  />
                </div>

                <div className="relative">
                  <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${activeInput === 'email' ? 'text-[#C92127]' : ''}`}>
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 ${activeInput === 'email' ? 'border-[#C92127] ring-1 ring-[#C92127]' : ''} focus:outline-none transition-all duration-200`}
                    disabled={isLoading}
                    onFocus={() => setActiveInput('email')}
                    onBlur={() => setActiveInput(null)}
                    required
                  />
                </div>

                <div className="relative">
                  <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${activeInput === 'fullName' ? 'text-[#C92127]' : ''}`}>
                    <FaIdCard />
                  </div>
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 ${activeInput === 'fullName' ? 'border-[#C92127] ring-1 ring-[#C92127]' : ''} focus:outline-none transition-all duration-200`}
                    disabled={isLoading}
                    onFocus={() => setActiveInput('fullName')}
                    onBlur={() => setActiveInput(null)}
                    required
                  />
                </div>

                <div className="relative">
                  <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${activeInput === 'password' ? 'text-[#C92127]' : ''}`}>
                    <FaLock />
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={handlePasswordChange}
                      className={`w-full py-3 pl-10 pr-12 rounded-lg border ${passwordError ? 'border-red-500' : 'border-gray-300'} ${activeInput === 'password' ? 'border-[#C92127] ring-1 ring-[#C92127]' : ''} focus:outline-none transition-all duration-200`}
                      disabled={isLoading}
                      onFocus={() => setActiveInput('password')}
                      onBlur={() => setActiveInput(null)}
                      required
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
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
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm mt-[-15px]">{passwordError}</p>
                )}

                <div className="relative">
                  <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${activeInput === 'confirmPassword' ? 'text-[#C92127]' : ''}`}>
                    <FaLock />
                  </div>
                  
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="retypePassword"
                    value={retypePassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Xác nhận mật khẩu"
                    className={`w-full py-3 pl-10 pr-12 rounded-lg border ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'} ${activeInput === 'confirmPassword' ? 'border-[#C92127] ring-1 ring-[#C92127]' : ''} focus:outline-none transition-all duration-200`}
                    disabled={isLoading}
                    onFocus={() => setActiveInput('confirmPassword')}
                    onBlur={() => setActiveInput(null)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
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
                {confirmPasswordError && (
                  <p className="text-red-500 text-sm mt-[-15px]">{confirmPasswordError}</p>
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
                      className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                        <FaImage className="mr-2 text-gray-500" />
                        {avatarPreview ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/jpeg,image/png,image/jpg,image/gif"
                          className="sr-only"
                          placeholder="Chọn ảnh đại diện"
                          onChange={handleAvatarChange}
                          disabled={isLoading}
                        />
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        JPG, JPEG, PNG hoặc GIF. Tối đa 5MB.
                      </p>
                    </div>

                  </div>
                </div>

              </div>

              <button
                onClick={handleRegister}
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

              <p className="text-center text-gray-600 mt-6">
                Đã có tài khoản?{" "}
                <a href="/auth/login" className="text-[#C92127] hover:text-[#a71b20] font-medium transition-colors">
                  Đăng nhập
                </a>
              </p>
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
