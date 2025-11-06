package com.ems.dto;

public class LoginRequest {
    private String personalEmail;
    private String password;

    // Default constructor
    public LoginRequest() {}

    // Getters and setters
    public String getPersonalEmail() { return personalEmail; }
    public void setPersonalEmail(String personalEmail) { this.personalEmail = personalEmail; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}