
import axiosInstance from "@/lib/axios";
import { changePasswordRequest, UpdateUserRequest } from "@/types/requests/useRequest";
import { UserResponse } from "@/types/responses/authResponse";




export const checkAuthUser = async (): Promise<UserResponse> => {
  const response = await axiosInstance.get("/users/my-information");
  return response.data.result as UserResponse;
};


export const updateUser = async (userId: number, data: UpdateUserRequest): Promise<UserResponse> => {
  const formData = new FormData();

  if(data.fullName) formData.append("fullName", data.fullName);
  if(data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
  if(data.address) formData.append("address", data.address);
  if(data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
  if(data.file) formData.append("file", data.file);
  const response = await axiosInstance.put(`/users/${userId}`, formData, {
    headers: {
      "Content-Type" : "multipart/form-data"
    }
  });

  return response.data.result as UserResponse;
}

export const changePasswordService = async(data: changePasswordRequest): Promise<void> => {
   await axiosInstance.post("/users/change-password", data);
}