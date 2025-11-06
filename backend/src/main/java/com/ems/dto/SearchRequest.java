package com.ems.dto;

public class SearchRequest {
    private String query;
    private int empId; // Current employee ID for filtering
    
    public SearchRequest() {}
    
    public SearchRequest(String query, int empId) {
        this.query = query;
        this.empId = empId;
    }
    
    // Getters and setters
    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
    
    public int getEmpId() { return empId; }
    public void setEmpId(int empId) { this.empId = empId; }
}