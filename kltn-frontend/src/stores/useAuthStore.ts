import { getUserDetailFromToken } from "@/services/useAuthService";
import { UserResponse } from "@/types/responses/userResponse";
import { create } from "zustand";

interface AuthStore {
  isLoading: boolean;
  checkAuth: () => Promise<UserResponse | null>;
  authUser: UserResponse | null;
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
}));
