package com.ems.dto;

import com.ems.model.Employee;
import java.util.List;

public class AdminDashboardResponse {
    private List<Employee> employees;
    private long totalEmployees;
    private long managerCount;
    private long hrCount;
    private long employeeCount;
    
    public AdminDashboardResponse() {}
    
    // Getters and setters
    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }
    
    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }
    
    public long getManagerCount() { return managerCount; }
    public void setManagerCount(long managerCount) { this.managerCount = managerCount; }
    
    public long getHrCount() { return hrCount; }
    public void setHrCount(long hrCount) { this.hrCount = hrCount; }
    
    public long getEmployeeCount() { return employeeCount; }
    public void setEmployeeCount(long employeeCount) { this.employeeCount = employeeCount; }
}