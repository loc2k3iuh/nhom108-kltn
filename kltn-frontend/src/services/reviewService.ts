import axiosInstance from "@/lib/axios";
import { Product } from "@/types/product";
import { UserResponse } from "@/types/responses/authResponse";

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface ReviewPayload {
  userId: number;
  productId: number;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string;
  product: Product;
  user: UserResponse;
  createdAt?: string | number[];
  updatedAt?: string | number[];
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  empty: boolean;
}

export const createReview = async (payload: ReviewPayload): Promise<ReviewResponse> => {
  try {
    const res = await axiosInstance.post<ApiResponse<ReviewResponse>>("/reviews", payload);
    if (res.data.code !== 201 && res.data.code !== 200) throw new Error(res.data.message || "Failed to create review");
    return res.data.result;
  } catch (err: unknown) {
    const msg = (err as any)?.response?.data?.message ?? (err as Error)?.message ?? 'Failed to create review';
    throw new Error(msg);
  }
};

export const getReviewsByProduct = async (productId: number, page = 0, size = 10): Promise<PaginatedResponse<ReviewResponse>> => {
  const res = await axiosInstance.get<ApiResponse<PaginatedResponse<ReviewResponse>>>(`/reviews/product/${productId}?page=${page}&size=${size}`);
  if (res.data.code !== 200) throw new Error(res.data.message || "Failed to fetch reviews");
  return res.data.result;
};

export const getReviewsByUser = async (userId: number, page = 0, size = 10): Promise<PaginatedResponse<ReviewResponse>> => {
  const res = await axiosInstance.get<ApiResponse<PaginatedResponse<ReviewResponse>>>(`/reviews/user/${userId}?page=${page}&size=${size}`);
  if (res.data.code !== 200) throw new Error(res.data.message || "Failed to fetch user reviews");
  return res.data.result;
};

export const getAverageRating = async (productId: number): Promise<number> => {
  const res = await axiosInstance.get<ApiResponse<number>>(`/reviews/product/${productId}/average-rating`);
  if (res.data.code !== 200) throw new Error(res.data.message || "Failed to fetch average rating");
  return res.data.result;
};

export const getTotalReviews = async (productId: number): Promise<number> => {
  const res = await axiosInstance.get<ApiResponse<number>>(`/reviews/product/${productId}/total-reviews`);
  if (res.data.code !== 200) throw new Error(res.data.message || "Failed to fetch total reviews");
  return res.data.result;
};

export const getReviewsByRating = async (productId: number, rating: number): Promise<ReviewResponse[]> => {
  const res = await axiosInstance.get<ApiResponse<ReviewResponse[]>>(`/reviews/product/${productId}/rating/${rating}`);
  if (res.data.code !== 200) throw new Error(res.data.message || "Failed to fetch reviews by rating");
  return res.data.result;
};

export const checkUserReviewExists = async (productId: number, userId: number): Promise<boolean> => {
  const res = await axiosInstance.get<ApiResponse<boolean>>(`/reviews/product/${productId}/user/${userId}/exists`);
  if (res.data.code !== 200) throw new Error(res.data.message || "Failed to check review existence");
  return res.data.result;
};

export const updateReview = async (reviewId: number, payload: Partial<ReviewPayload>): Promise<ReviewResponse> => {
  try {
    const res = await axiosInstance.put<ApiResponse<ReviewResponse>>(`/reviews/${reviewId}`, payload);
    if (res.data.code !== 200) throw new Error(res.data.message || "Failed to update review");
    return res.data.result;
  } catch (err: unknown) {
    const msg = (err as any)?.response?.data?.message ?? (err as Error)?.message ?? 'Failed to update review';
    throw new Error(msg);
  }
};

export const deleteReview = async (reviewId: number): Promise<boolean> => {
  try {
    const res = await axiosInstance.delete<ApiResponse<null>>(`/reviews/${reviewId}`);
    if (res.data.code !== 200) throw new Error(res.data.message || "Failed to delete review");
    return true;
  } catch (err: unknown) {
    const msg = (err as any)?.response?.data?.message ?? (err as Error)?.message ?? 'Failed to delete review';
    throw new Error(msg);
  }
};

export const safeUpdateReview = async (
  reviewId: number,
  payload: Partial<ReviewPayload> & { productId: number; userId: number; updatedAt?: string | number[] }
): Promise<ReviewResponse> => {
  // Validate dữ liệu đầu vào
  if (!reviewId || !payload || !payload.userId || !payload.productId || !payload.rating || !payload.comment) {
    throw new Error('Thiếu thông tin đánh giá. Vui lòng kiểm tra lại.');
  }
  // Kiểm tra trạng thái review trước khi gọi PUT
  try {
    // Kiểm tra review có tồn tại và hợp lệ không
    const reviewRes = await axiosInstance.get<ApiResponse<ReviewResponse>>(`/reviews/${reviewId}`);
    if (reviewRes.data.code !== 200) throw new Error(reviewRes.data.message || 'Không tìm thấy đánh giá');
    const review = reviewRes.data.result;
    if (review.user.id !== payload.userId) throw new Error('Bạn không có quyền sửa đánh giá này.');
    if ((review as any).deleted || (review as any).locked) throw new Error('Đánh giá đã bị xóa hoặc bị khóa, không thể cập nhật.');
    // Nếu hợp lệ, gọi PUT
    const res = await axiosInstance.put<ApiResponse<ReviewResponse>>(`/reviews/${reviewId}`, payload);
    if (res.data.code !== 200) throw new Error(res.data.message || "Không thể cập nhật đánh giá");
    return res.data.result;
  } catch (err: unknown) {
    const msg = (err as any)?.response?.data?.message ?? (err as Error)?.message ?? 'Không thể cập nhật đánh giá';
    throw new Error(msg);
  }
};
