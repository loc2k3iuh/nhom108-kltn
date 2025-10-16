export interface LoginResponse {
    authenticated: boolean;
    access_token: string;
}
export interface PreLoginResponse{
    email: string;
    roles: Role[];
}

export interface Role {
    name: string;
    description: string;
    permissions: Permission[];
    
}

export interface Permission{
    name: string;
    description: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string | null;
  address: string | null;
  full_name: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  updated_date: string | null;
  is_active: boolean | null;
  avatar_url: string | null;
  message: string | null;
  roles: Role[];
  status: string | null;
  created_date: string | null;
}
