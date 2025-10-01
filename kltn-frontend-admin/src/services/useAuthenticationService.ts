import {
  LoginResponse,
  PreLoginResponse,
  Role,
  UserResponse,
} from "./../types/responses/authResponse";
import { LoginRequest, OtpTokenRequest, ResendOtpRequest, SignOutRequest } from "../types/requests/authRequest";
import axiosInstance from "../lib/axios";

export const login = async (data: LoginRequest): Promise<PreLoginResponse> => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data.result;
};

export const verify = async (
  data: OtpTokenRequest,
  isChecked: boolean
): Promise<LoginResponse> => {
  const response = await axiosInstance.post(
    `/auth/verify-otp?isChecked=${isChecked}`,
    data
  );
  return response.data.result as LoginResponse;
};

export const resendOtp = async(data: ResendOtpRequest) : Promise<void> => {
    await axiosInstance.post("/auth/resend-otp", data);
}

export const signOut = async(data: SignOutRequest): Promise<void> => {
  await axiosInstance.post("/auth/logout", data);
}
