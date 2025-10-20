import {
  VerifyResetTokenRequest,
  LogoutRequest,
} from "./../types/requests/authRequest";
import axiosInstance from "@/lib/axios";
import {
  LoginRequest,
  RegisterUserRequest,
} from "@/types/requests/authRequest";
import { LoginResponse } from "@/types/responses/authResponse";

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

export const logoutService = async (data: LogoutRequest): Promise<void> => {
  await axiosInstance.post("/auth/logout", data);
};

export const sendMailForgotPasswordService = async (
  email: string
): Promise<void> => {
  await axiosInstance.post(
    `/auth/send-forgot-password?email=${email}&is_admin=false`
  );
};

export const verifyResetPasswordTokenService = async (
  data: VerifyResetTokenRequest
): Promise<void> => {
  await axiosInstance.post("/auth/verify-reset-token", data);
};
