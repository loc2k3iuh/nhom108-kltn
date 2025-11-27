import axios from "axios";
import {
  getTokenFromLocalStorage,
  getTokenFromSessionStorage,
  getUserIdFromToken,
  removeToken,
  setAccessTokenToLocalStorage,
  setAccessTokenToSessionStorage,
} from "../services/useTokenService";
import { getUserIdFromStorage } from "@/services/useUserService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PREFIX_URL  = import.meta.env.VITE_API_PREFIX;

let isRefreshing = false;
let failedQueue: any[] = [];
let isRedirecting = false;

const axiosInstance = axios.create({
  baseURL: BASE_URL + PREFIX_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenFromLocalStorage() || getTokenFromSessionStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Bỏ qua nếu đang ở trang signin hoặc đang redirect
    if (window.location.pathname === '/signin' || isRedirecting) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Kiểm tra userId trước khi vào queue
      const userId = getUserIdFromStorage();
      const existingToken = getTokenFromLocalStorage() || getTokenFromSessionStorage();
      
      if (!userId || !existingToken) {
        // Không có userId hoặc token, chuyển về trang đăng nhập ngay
        if (!isRedirecting) {
          isRedirecting = true;
          removeToken();
          window.location.href = "/signin";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            if (!isRedirecting) {
              isRedirecting = true;
              removeToken();
              window.location.href = "/signin";
            }
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}${PREFIX_URL}/auth/refresh-token/${userId}`,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const newAccessToken = res?.data?.result?.token;
        if (!newAccessToken) {
          throw new Error("No access token received");
        }

        getTokenFromLocalStorage()
          ? setAccessTokenToLocalStorage(newAccessToken)
          : setAccessTokenToSessionStorage(newAccessToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        if (!isRedirecting) {
          isRedirecting = true;
          removeToken();
          window.location.href = "/signin";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
