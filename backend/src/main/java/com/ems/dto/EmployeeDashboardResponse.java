package com.ems.dto;

import com.ems.model.Employee;
import java.util.List;

public class EmployeeDashboardResponse {
    private Employee employee;
    private List<EmployeeSearchResultDTO> searchResults; // Changed to DTO list
    private String searchQuery;
    private String success;
    private String error;
    
    public EmployeeDashboardResponse() {}
    
    // Getters and setters
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    
    public List<EmployeeSearchResultDTO> getSearchResults() { return searchResults; }
    public void setSearchResults(List<EmployeeSearchResultDTO> searchResults) { 
        this.searchResults = searchResults; 
    }
    
    public String getSearchQuery() { return searchQuery; }
    public void setSearchQuery(String searchQuery) { this.searchQuery = searchQuery; }
    
    public String getSuccess() { return success; }
    public void setSuccess(String success) { this.success = success; }
    
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}