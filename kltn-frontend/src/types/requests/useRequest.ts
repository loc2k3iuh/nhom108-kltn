export interface UpdateUserRequest {
    fullName?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    dateOfBirth?: string | null;
    file?: File | null;
}

export interface changePasswordRequest {
    current_password: string;
    new_password: string;
    retype_new_password: string;
}