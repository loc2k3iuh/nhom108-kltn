import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import OtpForm from "../../components/auth/OtpForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import Reloading from "@/components/skeletions/Reloading";
import { OtpTokenRequest, ResendOtpRequest } from "@/types/requests/authRequest";
import { setAccessTokenToLocalStorage, setAccessTokenToSessionStorage } from "@/services/useTokenService";




export default function OtpVerification() {
  // Get email from query params or localStorage
  const location = useLocation();
  const email = location.state?.email;
  const isChecked = location.state?.isChecked;
  const {isVerifyingOtp, verifyToken, resendOtp, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleVerifyOtp = async (otp: string) => {
    const otpTokenRequest: OtpTokenRequest = {
      email: email,
      otp_token: otp,
    }
    const response = await verifyToken(otpTokenRequest, isChecked);

    if(response != null){
      isChecked ? setAccessTokenToLocalStorage(response.access_token) : setAccessTokenToSessionStorage(response.access_token);
     
      await checkAuth();

      navigate("/");
     
    }
  };

  const handleResendOtp = () => {
     const resendOtpRequest : ResendOtpRequest ={
      email: email
     }
     resendOtp(resendOtpRequest);
  };

  if(isVerifyingOtp){
    return  <Reloading/>
  }

  return (
    <>
      <PageMeta
        title="Xác thực OTP - LUTHER SHOP Admin"
        description="Trang xác thực mã OTP cho hệ thống quản trị LUTHER SHOP"
      />
      <AuthLayout>
        <OtpForm
          email={email}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
        />
      </AuthLayout>
    </>
  );
}