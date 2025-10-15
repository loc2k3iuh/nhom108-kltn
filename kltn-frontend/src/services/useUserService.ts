import axiosInstance from "@/lib/axios";
import { RegisterUserRequest, VerifyRegistrationRequest } from "@/types/requests/authRequest";
import { UpdateUserRequest } from "@/types/requests/useRequest";
import { UserResponse } from "@/types/responses/userResponse";

export const getUserDetailFromToken = async (): Promise<UserResponse> => {
  const response = await axiosInstance.get("/users/my-information");
  return (response.data.result as UserResponse) || null;
};

export const registerUser = async (
  data: RegisterUserRequest
): Promise<void> => {
  const formData = new FormData();

  if (data.username) formData.append("username", data.username);
  if (data.email) formData.append("email", data.email);
  if (data.fullName) formData.append("fullName", data.fullName);
  if (data.password) formData.append("password", data.password);
  if (data.retypePassword)
    formData.append("retypePassword", data.retypePassword);
  if (data.file) formData.append("file", data.file);
  await axiosInstance.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const verifyRegistration = async (data : VerifyRegistrationRequest) : Promise<void> => {
  await axiosInstance.post("/users/confirm_user", data);
}

export const updateUserService = async (userId: number, data: UpdateUserRequest): Promise<UserResponse> => {
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