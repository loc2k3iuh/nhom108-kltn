import axios from "axios";
import {
  getTokenFromLocalStorage,
  getTokenFromSessionStorage,
  getUserIdFromToken,
  removeToken,
  setAccessTokenToLocalStorage,
  setAccessTokenToSessionStorage,
} from "../services/useTokenService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
let isRefreshing = false;
let failedQueue: any[] = [];

const axiosInstance = axios.create({
  baseURL: BASE_URL,
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          console.error("UserId not found in token, cannot refresh token");
        } else {
          const res = await axios.post(
            `${BASE_URL}/auth/refresh-token/${userId}`,
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
            window.location.href = "/login";
          }

          getTokenFromLocalStorage()
            ? setAccessTokenToLocalStorage(newAccessToken)
            : setAccessTokenToSessionStorage(newAccessToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        processQueue(err, null);
        removeToken();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
