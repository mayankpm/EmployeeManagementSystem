// src/app/models/hr.models.ts

export interface HRStats {
  totalEmployees: number;
  activeEmployees: number;
  pendingApprovals: number;
  declinedEmployees: number;
  departments: DepartmentStat[];
}

export interface DepartmentStat {
  deptCode: string;
  deptName: string;
  employeeCount: number;
}

export interface HREmployeeResponse {
  success: boolean;
  message: string;
  employee?: any;
}
