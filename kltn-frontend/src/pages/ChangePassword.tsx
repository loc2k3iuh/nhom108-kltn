import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faKey } from '@fortawesome/free-solid-svg-icons';
import UserSidebar from '../components/UserSidebar';

// Static user data
const staticUserData = {
  id: 1,
  username: "user123",
  fullName: "Nguyễn Văn A",
  email: "user@example.com",
  avatar_url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYVcJXjU8HnMTXVmjER0yIET4AwAuHp0LO_YCiQjUsf1228qq0lYbABHFTSasYlk61e6Y-1ygAjWXFLEUTCloPcTvbAwe7nNba7SW9ot9QMce7BYus-H6eDIUvyFXh9UmAmV5eVTMultDo57c048MmDws-a65QYOzoBfUkHLv5OiMhMaUfh2WeP_3ej9du/s1600/istockphoto-1337144146-612x612.jpg",
  roles: [{ name: "USER" }]
};

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const userData = staticUserData;

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: {
      oldPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    // Old password validation
    if (!oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
    }

    // New password validation
    if (!newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    } 

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const changePasswordData = {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      };

      console.log("Static password change for user:", userData.id, changePasswordData);
      toast.success("Đổi mật khẩu thành công!");
      
      // Redirect to profile page after successful password change
      setTimeout(() => {
        navigate('/user/profile');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row p-8">

        <UserSidebar userData={userData} />

        <div className="w-full md:w-3/4 space-y-4 ml-0 mt-3 md:mt-0 md:ml-6 bg-white p-4 rounded shadow-md">

        <div className="flex items-center justify-center mb-6">
          <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faKey} size="2x" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Đổi Mật Khẩu</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Old Password */}
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${errors.oldPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.oldPassword ? 'focus:ring-red-200' : 'focus:ring-[#C92127]'}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.oldPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.oldPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.newPassword ? 'focus:ring-red-200' : 'focus:ring-[#C92127]'}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nhập lại mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'focus:ring-red-200' : 'focus:ring-[#C92127]'}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Password requirements */}
          <div className="p-3 bg-blue-50 text-sm text-blue-700 rounded-md">
            <h3 className="font-semibold">Yêu cầu mật khẩu:</h3>
            <ul className="list-disc ml-5 mt-1">
              <li>Ít nhất 6 ký tự</li>
            </ul>
          </div>

          {/* Submit buttons */}
          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={() => navigate('/user/profile')}
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