export interface UpdateUserRequest {
    fullName?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    dateOfBirth?: string | null;
    file?: File | null;
}