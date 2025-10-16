export interface LoginRequest{
    username: string;
    password: string
}

export interface RegisterUserRequest{
    username: string;
    email: string;
    fullName: string;
    password: string;
    retypePassword: string;
    file?: File | null | undefined;
}

export interface VerifyRegistrationRequest{
    email : string;
    token: string;
}


export interface VerifyResetTokenRequest {
    email: string;
    reset_token: string;
    password: string;
    retype_password: string;
}

export interface LogoutRequest {
    token: string;
}