
import { UserResponse } from "@/types/responses/authResponse";
import axiosInstance from "../lib/axios";

export const checkAuthUser = async (): Promise<UserResponse> => {
  const response = await axiosInstance.get("/users/my-information");
  return response.data.result as UserResponse;
};