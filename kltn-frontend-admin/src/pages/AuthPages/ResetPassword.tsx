import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { VerifyResetTokenRequest } from "../../types/requests/authRequest";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import AuthLayout from "./AuthPageLayout";
import { useAuthStore } from "@/stores/useAuthStore";

interface ResetPasswordForm {
  password: string;
  retype_password: string;
}

export default function ResetPassword() {
  const { verifyResetPassword } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get email and token from URL parameters
  const email = searchParams.get("email") || "";
  const resetToken = searchParams.get("reset_token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>();

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordForm) => {
    debugger
    if (!email || !resetToken) {
      toast.error("Invalid reset link. Please request a new password reset.");
      return;
    }
    const requestData: VerifyResetTokenRequest = {
      email,
      reset_token: resetToken,
      password: data.password,
      retype_password: data.retype_password,
    };

    const response = await verifyResetPassword(requestData);
    if (response) {
     setTimeout(() => navigate("/signin"), 1000); // chờ toast xong rồi chuyển
     toast.success("Password reset successfully !");
    } else {
      toast.error("Cannot reset password !");
    }
  };

  // If no email or token in URL, show error message
  if (!email || !resetToken) {
    return (
      <AuthLayout>
        <div className="flex flex-col flex-1">
          <div className="w-full max-w-md pt-10 mx-auto"></div>
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Invalid Reset Link
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                This password reset link is invalid or has expired. Please
                request a new password reset.
              </p>
              <div className="space-y-4">
                <Link to="/forgot-password">
                  <Button className="w-full" size="sm">
                    Request New Reset Link
                  </Button>
                </Link>
                <div className="text-center">
                  <Link
                    to="/signin"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Back to Sign In
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
                Reset Password
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your new password below to reset your account password.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="password">
                    New Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      className="mt-2"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-7"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-6" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-6" />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="retype_password">
                    Confirm Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="retype_password"
                      className="mt-2"
                      type={showRetypePassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      {...register("retype_password", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                    />
                    <span
                      onClick={() => setShowRetypePassword(!showRetypePassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-7"
                    >
                      {showRetypePassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-6" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-6" />
                      )}
                    </span>
                  </div>
                  {errors.retype_password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.retype_password.message}
                    </p>
                  )}
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-6 text-center">
              <Link
                to="/signin"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
