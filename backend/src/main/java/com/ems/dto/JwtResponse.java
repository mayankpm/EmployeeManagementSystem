package com.ems.dto;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private int empId;
    private String email;
    private String roleCode;
    
    public JwtResponse() {}
    
    public JwtResponse(String token, int empId, String email, String roleCode) {
        this.token = token;
        this.empId = empId;
        this.email = email;
        this.roleCode = roleCode;
    }
    
    // Getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public int getEmpId() { return empId; }
    public void setEmpId(int empId) { this.empId = empId; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRoleCode() { return roleCode; }
    public void setRoleCode(String roleCode) { this.roleCode = roleCode; }
}