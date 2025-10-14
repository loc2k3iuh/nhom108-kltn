import axiosInstance from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
const ACCESS_TOKEN_KEY = "access_token";

function getErrorMessage(err: unknown, fallback: string) {
  const anyErr = err as any;
  return anyErr?.response?.data?.message ?? fallback;
}

export const getTokenFromLocalStorage = (): string => {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? "";
};

export const getTokenFromSessionStorage = (): string => {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? "";
};

export const setAccessTokenToLocalStorage = (accessToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const setAccessTokenToSessionStorage = (accessToken: string): void => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const getUserIdFromToken = (): number | null => {
  const token = getTokenFromLocalStorage() || getTokenFromSessionStorage();

  if (!token) {
    return null;
  }
  try {
    const userObject: any = jwtDecode(token);
    const id = Number(userObject?.userId);
    return Number.isNaN(id) ? null : id;
  } catch (err) {
    console.log("Invalid token", err);
    return null;
  }
};

export const deleteRefreshTokenFromRedis = async (): Promise<boolean> => {
  try {
    const token = getTokenFromSessionStorage();
    if (!token) {
      return false;
    }
    const userId = getUserIdFromToken();
    if (!userId) {
      return false;
    }
    await axiosInstance.post(
      `/auth/delete-refresh-token-from-redis/${userId}`
    );
    return true;
  } catch (error: unknown) {
    getErrorMessage(error, "Error in deleting refresh token from redis !");
    return false;
  }
};
