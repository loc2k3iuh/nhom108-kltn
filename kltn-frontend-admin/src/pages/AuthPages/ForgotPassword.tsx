import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import AuthLayout from "./AuthPageLayout";
import { useAuthStore } from "@/stores/useAuthStore";

interface ForgotPasswordRequest {
  email: string;
}

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const { sendResetPassword } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordRequest>();

  const onSubmit = async (data: ForgotPasswordRequest) => {
    const response = await sendResetPassword(data.email);
    if (response == "") {
      setEmailSent(true);
      toast.success(
        "Đã gửi email đặt lại mật khẩu đến địa chỉ email của bạn!"
      );
    }else{
      toast.error(response);
    }
  };

  if (emailSent) {
    return (
      <AuthLayout>
        <div className="flex flex-col flex-1">
          <div className="w-full max-w-md pt-10 mx-auto"></div>
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Kiểm tra Email của bạn
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Chúng tôi đã gửi liên kết đặt lại mật khẩu đến{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {getValues("email")}
                  </span>
                </p>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Quay lại form email
                </Button>
                <div className="text-center">
                  <Link
                    to="/signin"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Quay lại đăng nhập
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col flex-1">
        <div className="w-full max-w-md pt-10 mx-auto"></div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Quên mật khẩu?
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="email">
                    Địa chỉ Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-2"
                    placeholder="Nhập địa chỉ email của bạn"
                    {...register("email", {
                      required: "Email là bắt buộc",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Địa chỉ email không hợp lệ",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                    
                  >
                  Gửi
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-6 text-center">
              <Link
                to="/signin"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
