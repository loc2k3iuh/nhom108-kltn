import { Role } from "./userResponse";

export interface LoginResponse{
    authenticated: boolean;
    access_token: string;
    roles? : Role[];
}