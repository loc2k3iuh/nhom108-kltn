import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
// Service imports removed - using static data

// Keys for localStorage prefix - will be combined with email to create unique keys
const RESEND_COUNT_PREFIX = "emailResendCount_";
const LAST_RESEND_DATE_PREFIX = "emailLastResendDate_";
const LAST_RESEND_TIME_PREFIX = "emailLastResendTime_";

const RegisterMailPage: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const [resendCount, setResendCount] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  // Constants for limits
  const DAILY_LIMIT = 3;
  const COOLDOWN_SECONDS = 60;



  // Helper functions to get storage keys for specific email
  const getResendCountKey = (email: string) => `${RESEND_COUNT_PREFIX}${email}`;
  const getLastResendDateKey = (email: string) => `${LAST_RESEND_DATE_PREFIX}${email}`;
  const getLastResendTimeKey = (email: string) => `${LAST_RESEND_TIME_PREFIX}${email}`;
  
  // Initialize and manage resend count and cooldowns
  useEffect(() => {
    // Get email from URL
    const params = new URLSearchParams(location.search);
    const emailFromURL = params.get("email");
    setEmail(emailFromURL);
    
    // If no email is available yet, skip the rest
    if (!emailFromURL) return;
    
    const initResendState = () => {
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem(getLastResendDateKey(emailFromURL));
      
      // Reset counter if it's a new day
      if (storedDate !== today) {
        localStorage.setItem(getLastResendDateKey(emailFromURL), today);
        localStorage.setItem(getResendCountKey(emailFromURL), "0");
        setResendCount(0);
      } else {
        // Load existing count for this email
        const count = parseInt(localStorage.getItem(getResendCountKey(emailFromURL)) || "0");
        
        // Important: count registration as the first email send
        const registrationCount = parseInt(localStorage.getItem(`registration_${emailFromURL}`) || "0");
        if (registrationCount === 0) {
          // First time seeing this email today, count the registration email
          localStorage.setItem(`registration_${emailFromURL}`, "1");
          // Only increment if we haven't already registered this email today
          if (count === 0) {
            const initialCount = 1; // registration email counts as first send
            localStorage.setItem(getResendCountKey(emailFromURL), initialCount.toString());
            setResendCount(initialCount);
          } else {
            setResendCount(count);
          }
        } else {
          // We've already seen this email register today
          setResendCount(count);
        }
      }
      
      // Check for active cooldown
      const lastResendTime = localStorage.getItem(getLastResendTimeKey(emailFromURL));
      if (lastResendTime) {
        const elapsedSeconds = Math.floor((Date.now() - parseInt(lastResendTime)) / 1000);
        if (elapsedSeconds < COOLDOWN_SECONDS) {
          setCooldownRemaining(COOLDOWN_SECONDS - elapsedSeconds);
        }
      }
    };
    
    initResendState();
    
    // Setup cooldown timer if needed
    let timer: NodeJS.Timeout | null = null;
    if (cooldownRemaining > 0) {
      timer = setInterval(() => {
        setCooldownRemaining(prev => {
          if (prev <= 1) {
            if (timer) clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [location.search, cooldownRemaining]);
  
  const handleResendEmail = async () => {
    try {
      // Validate email
      if (!email) {
        setMessage("Email không hợp lệ!");
        return;
      }
      
      // Check daily limit
      if (resendCount >= DAILY_LIMIT) {
        setMessage(`Đã đạt giới hạn ${DAILY_LIMIT} lần gửi email trong ngày cho địa chỉ này. Vui lòng thử lại vào ngày mai.`);
        return;
      }
      
      // Check cooldown
      if (cooldownRemaining > 0) {
        setMessage(`Vui lòng đợi ${cooldownRemaining} giây trước khi gửi lại.`);
        return;
      }
      
      setIsLoading(true);
      setMessage("");
      
      // Simulate API call to resend email
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Static resend email for:", email);
      
      // Update resend count and time
      const newCount = resendCount + 1;
      setResendCount(newCount);
      setCooldownRemaining(COOLDOWN_SECONDS);
      
      // Store in localStorage with email-specific keys
      localStorage.setItem(getResendCountKey(email), newCount.toString());
      localStorage.setItem(getLastResendTimeKey(email), Date.now().toString());
      
      setMessage("Email xác nhận đã được gửi lại thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi lại email xác nhận:", error);
      setMessage("Có lỗi xảy ra khi gửi lại email xác nhận. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-2/2 bg-gray-50 flex justify-center items-center p-8">
        <div className="text-center max-w-md">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-black mb-4">Đang xử lý!</h2>
          <p className="text-black">
            Chúng tôi đã gửi một email xác nhận đến địa chỉ của bạn. Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn trong email để hoàn tất quá trình đăng ký.
          </p>
          
          {message && (
            <div className={`mt-3 text-sm ${message.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}
          
          <div className="mt-2 text-sm text-gray-600">
            {email && resendCount < DAILY_LIMIT 
              ? `Còn lại ${DAILY_LIMIT - resendCount}/${DAILY_LIMIT} lần gửi cho ${email} hôm nay`
              : email ? `Đã đạt giới hạn gửi email cho ${email} hôm nay` : "Email không hợp lệ"
            }
          </div>
          
          <button
            onClick={handleResendEmail}
            disabled={isLoading || cooldownRemaining > 0 || resendCount >= DAILY_LIMIT || !email}
            className={`inline-block mt-4 py-2 px-6 rounded-lg font-semibold transition-all duration-300 shadow-md ${
              isLoading || cooldownRemaining > 0 || resendCount >= DAILY_LIMIT || !email
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            }`}
          >
            {isLoading ? "Đang gửi..." : 
             cooldownRemaining > 0 ? `Gửi lại sau (${cooldownRemaining}s)` : 
             resendCount >= DAILY_LIMIT ? "Đã đạt giới hạn" : 
             !email ? "Email không hợp lệ" : "Gửi lại"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterMailPage;
