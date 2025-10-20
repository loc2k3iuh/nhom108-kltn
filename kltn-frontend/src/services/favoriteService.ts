import axiosInstance from "@/lib/axios";

export interface FavoritePayload {
  userId: number;
  productId: number;
}

export const addFavorite = async (payload: FavoritePayload) => {
  const res = await axiosInstance.post("/favorites", payload);
  if (res.data.code !== 201) throw new Error(res.data.message || "Không thể thêm vào yêu thích");
  return res.data.result;
};

export const removeFavorite = async (payload: FavoritePayload) => {
  const res = await axiosInstance.delete("/favorites", { data: payload });
  if (res.data.code !== 204) throw new Error(res.data.message || "Không thể xóa khỏi yêu thích");
  return true;
};

export const checkFavorite = async (userId: number, productId: number): Promise<boolean> => {
  const res = await axiosInstance.get(`/favorites/users/${userId}/products/${productId}/check`);
  if (res.data.code !== 200) throw new Error(res.data.message || "Không thể kiểm tra trạng thái yêu thích");
  return res.data.result;
};

export const getFavoriteCount = async (userId: number): Promise<number> => {
  const res = await axiosInstance.get(`/favorites/users/${userId}/count`);
  if (res.data.code !== 200) throw new Error(res.data.message || "Không thể lấy số lượng yêu thích");
  return res.data.result;
};

export const getUserFavorites = async (userId: number, page = 0, size = 10) => {
  const res = await axiosInstance.get(`/favorites/users/${userId}?page=${page}&size=${size}&sortBy=createdDate&sortDir=desc`);
  if (res.data.code !== 200) throw new Error(res.data.message || "Không thể lấy danh sách yêu thích");
  return res.data.result;
};

export const getUserFavoritesList = async (userId: number) => {
  const res = await axiosInstance.get(`/favorites/users/${userId}/list`);
  if (res.data.code !== 200) throw new Error(res.data.message || "Không thể lấy danh sách yêu thích");
  return res.data.result;
};
