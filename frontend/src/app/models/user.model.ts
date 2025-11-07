export interface User {
  empId?: number;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  personalEmail: string;
  phone: string;
  password?: string;
  roleCode: string;
  deptCode: string;
  approvalStatus?: string;
}
 
export interface LoginRequest {
  personalEmail: string;
  password: string;
}
 
export interface AuthResponse {
  token?: string;
  user: any;
  message: string;
  userId?: string;
}
 
export interface RegisterResponse {
  message: string;
  userId?: string;
}
 