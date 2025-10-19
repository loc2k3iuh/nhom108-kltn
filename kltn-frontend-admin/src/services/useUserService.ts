

import { UserListResponse, UserResponse } from "@/types/responses/authResponse";
import axiosInstance from "../lib/axios";
import { ChangePasswordRequest, UpdateClientRequest, UpdateUserRequest } from "@/types/requests/authRequest";
import { getAllUsersRequest } from "@/types/requests/userRequest";
import { aW } from "node_modules/@fullcalendar/core/internal-common";

export const checkAuthUser = async (): Promise<UserResponse> => {
  const response = await axiosInstance.get("/users/my-information");
  return response.data.result as UserResponse;
};


export const updateMyInfor = async (userId: number, data: UpdateUserRequest): Promise<UserResponse> => {
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

export const updateClient = async(clientId: number, data: UpdateClientRequest) : Promise<UserResponse> => {
  const formData = new FormData();
  if(data.fullName) formData.append("fullName", data.fullName);
  if(data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
  if(data.address) formData.append("address", data.address);
  if(data.dateOfBirth) formData.append("dateOfBirth", data.dateOfBirth);
  if(data.file) formData.append("file", data.file);
  formData.append("isActive", data.isActive ? "true": "false");
  const response = await axiosInstance.put(`/users/client/${clientId}`, formData, {
    headers: {
      "Content-Type" : "multipart/form-data"
    }
  });
  return response.data.result as UserResponse;
  
}


export const changePassword = async(data: ChangePasswordRequest): Promise<void> => {
  await axiosInstance.post("/users/change-password", data);
}

export const getAllUsers= async(data: getAllUsersRequest) : Promise<UserListResponse> => {
  const response =  await axiosInstance.get(`/users?keyword=${data.searchTerm}&state=${data.stateParam}&page=${data.currentPage}&limit=${data.itemsPerPage}`);
  return response.data?.result as UserListResponse;
}
