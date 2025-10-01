import { create } from "zustand";
import { toast } from "sonner";
import { LoginRequest, OtpTokenRequest, ResendOtpRequest, SignOutRequest } from "@/types/requests/authRequest";
import { login, resendOtp, signOut, verify } from "@/services/useAuthenticationService";
import { LoginResponse, UserResponse } from "@/types/responses/authResponse";
import { checkAuthUser } from "@/services/useUserService";

export const useAuthStore = create<{
  isLoggingIn: boolean;
  isSigningOut: boolean;
  isVerifyingOtp: boolean;
  isCheckingAuth: boolean;
  authUser: UserResponse | null;
  logIn: (data: LoginRequest) => any;
  verifyToken: (
    data: OtpTokenRequest,
    isChecked: boolean
  ) => Promise<LoginResponse | null>;
  checkAuth: () => void;
  resendOtp: (data: ResendOtpRequest) => void;
  signOut: (data: SignOutRequest) => void;
}>((set, get) => ({
  isLoggingIn: false,
  isVerifyingOtp: false,
  isCheckingAuth: false,
  authUser: null,
  isSigningOut: false,

  logIn: async (data) => {
    try {
      set({ isLoggingIn: true });
      const response = await login(data);

      const isAdmin = response?.roles.some((role) => role.name === "ADMIN");

      if (!isAdmin) {
        toast.error("Email or password is incorrect !");
        return null;
      }
      toast.success("Login successfully !!!");
      return response.email;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Email or password is incorrect !"
      );
      return null;
    } finally {
      set({ isLoggingIn: false });
    }
  },
  verifyToken: async (data, isChecked) => {
    try {
      set({ isVerifyingOtp: true });
      const response = await verify(data, isChecked);
      return response;
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error in verifying OTP !"
      );
      return null;
    } finally {
      set({ isVerifyingOtp: false });
    }
  },
  checkAuth: async() => {
    try {
      set({isCheckingAuth: true});
      const response = await checkAuthUser();
      set({authUser : response});
    } catch (error : any) {
       toast.error(
        error.response?.data?.message || "Error in checking user !"
      );
    }finally{
      set({isCheckingAuth: false});
    }
  },
  resendOtp: async (data: ResendOtpRequest) => {
    try {
      await resendOtp(data);
      toast.success("We resent an OTP CODE to your email !");
    } catch (error : any) {
      toast.error(
        error.response?.data?.message || "You have sent OTP more than 3 times in 10 minutes. Please try again later !"
      );
    }
  },
  signOut: async (data: SignOutRequest) => {
      try {
          set({isSigningOut : true});
          await signOut(data);
          set({authUser: null});
          toast.success("Logged out successfully !"); 
      } catch (error : any) {
        toast.error(error.response?.data?.message || "Error in logging out !");
      }finally{ 
        set({isSigningOut: false});
      }
    }
}));
