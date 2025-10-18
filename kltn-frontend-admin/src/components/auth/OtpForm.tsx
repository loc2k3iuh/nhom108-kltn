import { useState } from "react";
import { Link } from "react-router";
import OtpInput from "../form/input/OtpInput";

interface OtpFormProps {
  email?: string;
  onVerify?: (otp: string) => void;
  onResend?: () => void;
  loading?: boolean;
  error?: string;
}

export default function OtpForm({ 
  email = "user@example.com", 
  onVerify,
  onResend,
  loading = false,
  error 
}: OtpFormProps) {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleOtpComplete = (completedOtp: string) => {
    setOtp(completedOtp);
    onVerify?.(completedOtp);
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;
    
    setIsResending(true);
    try {
      await onResend?.();
      // Start 60 second countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify?.(otp);
    }
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) return email;
    
    const maskedLocal = localPart.charAt(0) + "*".repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        {/* Logo or header space */}
      </div>
      
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          {/* Header Section */}
          <div className="mb-8 text-center sm:mb-10">
            <div className="mb-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full dark:bg-blue-900/20">
                <svg 
                  className="w-8 h-8 text-blue-600 dark:text-blue-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </div>
            </div>
            
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Xác thực OTP
            </h1>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chúng tôi đã gửi mã xác thực 6 số đến
            </p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {maskEmail(email)}
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* OTP Input Section */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  <OtpInput
                    length={6}
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleOtpComplete}
                    disabled={loading}
                    error={!!error}
                  />
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="text-center">
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}
                
                {/* Helper Text */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nhập 6 số từ tin nhắn chúng tôi đã gửi đến {maskEmail(email)}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="space-y-4">
                <button
                  type="submit"
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 ${
                    (otp.length !== 6 || loading) ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={otp.length !== 6 || loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xác thực...
                    </div>
                  ) : (
                    "Xác thực OTP"
                  )}
                </button>
              </div>

              {/* Resend Section */}
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Không nhận được mã?{" "}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isResending}
                    className={`font-medium transition-colors ${
                      countdown > 0 || isResending
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    }`}
                  >
                    {isResending ? (
                      "Đang gửi..."
                    ) : countdown > 0 ? (
                      `Gửi lại sau ${countdown}s`
                    ) : (
                      "Gửi lại mã"
                    )}
                  </button>
                </p>
              </div>

            
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}