import { Employee } from "./employee.model";

export interface Payroll {
  empId: number;
  deptCode: string;
  tax: number;
  allowances: number;
  incentive: number;
  ctc: number;
}

export interface EmployeePayrollResponse {
  employee: Employee;
  payrolls: Payroll[];
}