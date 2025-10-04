import { create } from "zustand";

import {
  LoginRequest,
  OtpTokenRequest,
  ResendOtpRequest,
  SignOutRequest,
  UpdateUserRequest,
} from "@/types/requests/authRequest";
import {
  login,
  resendOtp,
  signOut,
  verify,
} from "@/services/useAuthenticationService";
import { LoginResponse, UserResponse } from "@/types/responses/authResponse";
import { checkAuthUser, updateUser } from "@/services/useUserService";
import { getUserIdFromToken } from "@/services/useTokenService";

interface AuthStore  {
  isLoggingIn: boolean;
  isSigningOut: boolean;
  isUpdating: boolean;
  isVerifyingOtp: boolean;
  isCheckingAuth: boolean;
  authUser: UserResponse | null;
  logIn: (data: LoginRequest) => Promise<string | null>;
  verifyOtp: (
    data: OtpTokenRequest,
    isChecked: boolean
  ) => Promise<LoginResponse | null>;
  checkAuth: () => Promise<UserResponse | null>;
  resendOtp: (data: ResendOtpRequest) => Promise<boolean>;
  signOut: (data: SignOutRequest) => Promise<boolean>;
  updateUser: (data: UpdateUserRequest) => Promise<boolean>;
};

function getErrorMessage(err: unknown, fallback: string) {
  const anyErr = err as any;
  return anyErr?.response?.data?.message ?? fallback;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoggingIn: false,
  isVerifyingOtp: false,
  isCheckingAuth: false,
  authUser: null,
  isSigningOut: false,
  isUpdating: false,

  logIn: async (data) => {
    try {
      set({ isLoggingIn: true });
      const response = await login(data);

      const isAdmin = response?.roles.some((role) => role.name === "ADMIN");
      if (!isAdmin) {
        return null;
      }
      return response.email ?? null;
    } catch (error: unknown) {
      console.error(
        getErrorMessage(error, "Username or password is incorrect !")
      );
      return null;
    } finally {
      set({ isLoggingIn: false });
    }
  },
  verifyOtp: async (data, isChecked) => {
    try {
      set({ isVerifyingOtp: true });
      const response = await verify(data, isChecked);
      return response ?? null;
    } catch (error: unknown) {
      console.error(getErrorMessage(error, "Error in verifying OTP !"));
      return null;
    } finally {
      set({ isVerifyingOtp: false });
    }
  },
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const response = await checkAuthUser();
      set({ authUser: response });
      return response;
    } catch (error: unknown) {
      console.error(getErrorMessage(error, "Error in checking user !"));
      return null;
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  resendOtp: async (data: ResendOtpRequest) => {
    try {
      await resendOtp(data);
      return true;
    } catch (error: unknown) {
      console.error(
        getErrorMessage(
          error,
          "You have sent OTP more than 3 times in 10 minutes. Please try again later !"
        )
      );
    }
    return false;
  },
  signOut: async (data: SignOutRequest) => {
    try {
      set({ isSigningOut: true });
      await signOut(data);
      set({ authUser: null });
      return true;
    } catch (error: unknown) {
      console.error(getErrorMessage(error, "Error in logging out !"));
      return false;
    } finally {
      set({ isSigningOut: false });
    }
  },
  updateUser: async (data: UpdateUserRequest) => {
    try {
      set({ isUpdating: true });
      const userId = getUserIdFromToken();
      if (userId) {
        const response = await updateUser(userId, data);
        set({ authUser: response });
      }
      return true;
    } catch (error: unknown) {
      console.error(getErrorMessage(error, "Error in updating user !"));
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },
}));
