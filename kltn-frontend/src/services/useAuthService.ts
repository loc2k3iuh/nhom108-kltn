import { VerifyRegistrationRequest } from './../types/requests/authRequest';
import axiosInstance from "@/lib/axios";
import {
  LoginRequest,
  RegisterUserRequest,
} from "@/types/requests/authRequest";
import { LoginResponse } from "@/types/responses/authResponse";
import { UserResponse } from "@/types/responses/userResponse";

export const login = async (
  data: LoginRequest,
  isRemembered: boolean
): Promise<LoginResponse> => {
  const reponse = await axiosInstance.post(
    `/auth/login?isRemembered=${isRemembered}`,
    data
  );
  return (reponse.data.result as LoginResponse) || null;
};

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
