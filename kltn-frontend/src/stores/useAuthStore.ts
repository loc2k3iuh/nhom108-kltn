import { logoutService } from "@/services/useAuthService";
import { webSocketService } from "@/services/useSocketService";
import {
  getTokenFromLocalStorage,
  getTokenFromSessionStorage,
  getUserIdFromToken,
  removeToken,
} from "@/services/useTokenService";
import {

} from "@/services/useUserService";
import { LogoutRequest } from "@/types/requests/authRequest";
import { UpdateUserRequest } from "@/types/requests/useRequest";
import { UserResponse } from "@/types/responses/authResponse";

import { data } from "react-router-dom";
import { create } from "zustand";

interface AuthStore {
  isLoading: boolean;
  isInitialized: boolean;
  isWebSocketConnected: boolean;
  checkAuth: () => Promise<UserResponse | null>;
  authUser: UserResponse | null;
  updateUser: (updateUserRequest: UpdateUserRequest) => Promise<boolean>;
  logOut: () => Promise<boolean>;
  connectWebSocket: () => Promise<void>;
  disconnectWebSocket: () => void;
}

function getErrorMessage(err: unknown, fallback: string) {
  const anyErr = err as any;
  return anyErr?.response?.data?.message ?? fallback;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoading: false,
  isWebSocketConnected: false,
  authUser: null,
  isInitialized: false,
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await getUserDetailFromToken();
      set({ authUser: response, isInitialized: true });
      get().connectWebSocket();
      return response;
    } catch (error: unknown) {
      console.log(getErrorMessage(error, "Error in checking user !"));
      set({ authUser: null, isInitialized: true });
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
      get().disconnectWebSocket();
      return true;
    } catch (error: unknown) {
      console.log(getErrorMessage(error, "Error in logging out user !"));
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  connectWebSocket: async () => {
    if (get().isWebSocketConnected || webSocketService.isConnectedStatus()) {
      console.log("WebSocket already connected");
      return;
    }
    try {
      await webSocketService.connect();
      set({ isWebSocketConnected: true });

      webSocketService.subscribe(
        `/user/queue/user-updated`,
        (data) => {
          console.log("Received user update:", data);

            set((state) => ({
              ...state,
              authUser: data,
            }));

        }
      );

      console.log("WebSocket connected and subscriptions set up");
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      set({ isWebSocketConnected: false });
      throw error;
    }
  },

  disconnectWebSocket: () => {
    webSocketService.disconnect();
    set({ isWebSocketConnected: false });
    console.log("WebSocket disconnected");
  },
}));