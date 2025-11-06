package com.ems.dto;

import com.ems.model.Employee;
import java.util.List;

public class HRDashboardResponse {
    private List<Employee> employees;
    private long totalEmployees;
    private long employeeCount;
    private String hrDepartment;
    
    public HRDashboardResponse() {}
    
    // Getters and setters
    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }
    
    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }
    
    public long getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(long employeeCount) { this.employeeCount = employeeCount; }
    
    public String getHrDepartment() { return hrDepartment; }
    public void setHrDepartment(String hrDepartment) { this.hrDepartment = hrDepartment; }
}