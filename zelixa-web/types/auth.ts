export interface AuthUser {
  token: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  roles: string[];
  taskGroup?: string;
}

export interface LoginResponse extends AuthUser {}
