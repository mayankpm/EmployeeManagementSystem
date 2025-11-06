import { User } from './user.model';

export interface HRStats {
  totalEmployees: number;
  regularCount: number;
  pendingApprovals: number;
  hrDepartment: string;
}

export interface HREmployeeResponse {
  employee: User;
  message: string;
  success: boolean;
}