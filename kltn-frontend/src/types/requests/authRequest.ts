export interface LoginRequest {
    username: string;
    password: string;
}

export interface OtpTokenRequest {
    email: string;
    otp_token: string;
}

export interface ResendOtpRequest {
    email: string;
}

export interface SignOutRequest {
    token: string;
}

export interface UpdateUserRequest {
    fullName?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    dateOfBirth?: string | null;
    file?: File | null;
}

export interface VerifyResetTokenRequest {
    email: string;
    reset_token: string;
    password: string;
    retype_password: string;
}