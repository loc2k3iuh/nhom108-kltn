import { VerifyResetTokenRequest } from './../types/requests/authRequest';
import {
  LoginResponse,
  PreLoginResponse,
} from "./../types/responses/authResponse";
import { LoginRequest, OtpTokenRequest, ResendOtpRequest, SignOutRequest } from "../types/requests/authRequest";
import axiosInstance from "../lib/axios";
import { data } from 'react-router';

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

export const resetPassword = async(email: string): Promise<void> => {
  await axiosInstance.post(`/auth/send-forgot-password?email=${email}&is_admin=true`);
}

export const verifyPassword = async(data: VerifyResetTokenRequest ): Promise<void> => {
  await axiosInstance.post("/auth/verify-reset-token", data);
}
