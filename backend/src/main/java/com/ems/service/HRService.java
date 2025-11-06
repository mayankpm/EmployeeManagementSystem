package com.ems.service;

import com.ems.dto.HRStatsResponse;
import com.ems.dto.HREmployeeResponse;
import com.ems.model.Employee;

import java.util.List;

public interface HRService {
    HRStatsResponse getHRDashboardStats(String hrDepartment);
    List<Employee> getDepartmentEmployees(String hrDepartment);
    List<Employee> getPendingApprovals(String hrDepartment);
    HREmployeeResponse approveEmployee(int empId, String hrDepartment);
    HREmployeeResponse declineEmployee(int empId, String hrDepartment);
    HREmployeeResponse updateEmployee(Employee employee, String hrDepartment);
    Employee getEmployeeDetails(int empId, String hrDepartment);
}