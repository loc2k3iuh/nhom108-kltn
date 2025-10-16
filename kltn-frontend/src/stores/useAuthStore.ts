import { logoutService } from "@/services/useAuthService";
import {
  getTokenFromLocalStorage,
  getTokenFromSessionStorage,
  getUserIdFromToken,
  removeToken,
} from "@/services/useTokenService";
import {
  getUserDetailFromToken,
  updateUserService,
} from "@/services/useUserService";
import { LogoutRequest } from "@/types/requests/authRequest";
import { UpdateUserRequest } from "@/types/requests/useRequest";
import { UserResponse } from "@/types/responses/userResponse";
import { data } from "react-router-dom";
import { create } from "zustand";

interface AuthStore {
  isLoading: boolean;
  checkAuth: () => Promise<UserResponse | null>;
  authUser: UserResponse | null;
  updateUser: (updateUserRequest: UpdateUserRequest) => Promise<boolean>;
  logOut: () => Promise<boolean>;
}

function getErrorMessage(err: unknown, fallback: string) {
  const anyErr = err as any;
  return anyErr?.response?.data?.message ?? fallback;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoading: false,
  authUser: null,
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await getUserDetailFromToken();
      set({ authUser: response });
      return response;
    } catch (error: unknown) {
      console.log(getErrorMessage(error, "Error in checking user !"));
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  updateUser: async (updateUserRequest) => {
    try {
      const userId = getUserIdFromToken();
      if (userId) {
        const response = await updateUserService(userId, updateUserRequest);
        set({ authUser: response });
      }
      return true;
    } catch (error: unknown) {
      console.log(getErrorMessage(error, "Error in updating user !"));
      return false;
    }
  },
  logOut: async () => {
    try {
      set({ isLoading: true });
      const token = getTokenFromLocalStorage() || getTokenFromSessionStorage();
      if (token === "" || !token) {
        return false;
      }
      const tokenRequest: LogoutRequest = {
        token: token,
      };
      await logoutService(tokenRequest);
      removeToken();
      set({ authUser: null });
      return true;
    } catch (error: unknown) {
      console.log(getErrorMessage(error, "Error in logging out user !"));
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
