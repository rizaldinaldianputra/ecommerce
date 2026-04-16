export interface UserRole {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  isActive: boolean;
  taskGroup: string;
  roles: UserRole[];
  createdAt: string;
}
