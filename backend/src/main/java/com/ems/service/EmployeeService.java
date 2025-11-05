package com.ems.service;

import com.ems.model.Employee;

import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    List<Employee> getEmployeeDetails();
    Optional<Employee> getEmployee(int empId);
    void updateEmployee(Employee employee);
    void assignEmployeeRole(int empId, String roleCode);
    void assignEmpDept(int empId, String deptCode);
}
