package com.ems.dto;

public class LoginResponse {
    private int empId;
    private String roleCode;
    private String firstName;
    private String email;
    private String token;
    private String message;
    private boolean success;
    
    public LoginResponse() {}
    
    public LoginResponse(int empId, String roleCode, String firstName, String email, String token, boolean success) {
        this.empId = empId;
        this.roleCode = roleCode;
        this.firstName = firstName;
        this.email = email;
        this.token = token;
        this.success = success;
    }
    
    // Getters and setters
    public int getEmpId() { return empId; }
    public void setEmpId(int empId) { this.empId = empId; }
    
    public String getRoleCode() { return roleCode; }
    public void setRoleCode(String roleCode) { this.roleCode = roleCode; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}