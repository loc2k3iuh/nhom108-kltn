import { create } from "zustand";

import {
  LoginRequest,
  OtpTokenRequest,
  ResendOtpRequest,
  SignOutRequest,
  UpdateUserRequest,
  VerifyResetTokenRequest,
} from "@/types/requests/authRequest";
import {
  login,
  resendOtp,
  signOut,
  verify,
  resetPassword,
  verifyPassword,
} from "@/services/useAuthenticationService";
import { LoginResponse, UserResponse } from "@/types/responses/authResponse";
import { checkAuthUser, updateUser } from "@/services/useUserService";
import { getUserIdFromToken } from "@/services/useTokenService";
import { toast } from "sonner";

interface AuthStore {
  isLoading: boolean;
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
  sendResetPassword: (email: string) => Promise<string>;
  verifyResetPassword: (data: VerifyResetTokenRequest) => Promise<boolean>;
}

function getErrorMessage(err: unknown, fallback: string) {
  const anyErr = err as any;
  return anyErr?.response?.data?.message ?? fallback;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoading: false,
  authUser: null,

  logIn: async (data) => {
    try {
      set({ isLoading: true });
      const response = await login(data);

      const isAdmin = response?.roles.some((role) => role.name === "CUSTOMER" );
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
      set({ isLoading: false });
    }
  },
  verifyOtp: async (data, isChecked) => {
    try {
      set({ isLoading: true });
      const response = await verify(data, isChecked);
      return response ?? null;
    } catch (error: unknown) {
      console.error(getErrorMessage(error, "Error in verifying OTP !"));
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await checkAuthUser();
      set({ authUser: response });
      return response;
    } catch (error: unknown) {
      console.error(getErrorMessage(error, "Error in checking user !"));
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  resendOtp: async (data: ResendOtpRequest) => {
    try {
      set({ isLoading: true });
      await resendOtp(data);
      return true;
    } catch (error: unknown) {
      console.error(
        getErrorMessage(
          error,
          "You have sent OTP more than 3 times in 10 minutes. Please try again later !"
        )
      );
    } finally {
      set({ isLoading: false });
    }
    return false;
  },
  signOut: async (data: SignOutRequest) => {
    try {
      set({ isLoading: true });
      await signOut(data);
      set({ authUser: null });
      return true;
    } catch (error: unknown) {
      console.error(getErrorMessage(error, "Error in logging out !"));
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  updateUser: async (data: UpdateUserRequest) => {
    try {
      set({ isLoading: true });
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
      set({ isLoading: false });
    }
  },
  sendResetPassword: async (email: string) => {
    try {
      set({ isLoading: true });
      await resetPassword(email);
      return "";
    } catch (error: any) {
      return error.response?.data?.message;
    } finally {
      set({ isLoading: false });
    }
  },
  verifyResetPassword: async (data: VerifyResetTokenRequest) => {
    try {
      set({ isLoading: true });
      await verifyPassword(data);
      return true;
    } catch (error) {
        console.error(
        getErrorMessage(error, "Error in Verifying forgot password !")
      );
      return false;
    } finally {
      set({isLoading: false});
    }
  },
}));
