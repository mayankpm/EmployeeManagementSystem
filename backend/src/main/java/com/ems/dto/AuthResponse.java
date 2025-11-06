package com.ems.dto;

import java.util.Map;

public class AuthResponse {
    private String message;
    private String token;
    private Map<String, Object> user;
    private String userId;

    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String message) {
        this.message = message;
    }

    // Getters and setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public Map<String, Object> getUser() { return user; }
    public void setUser(Map<String, Object> user) { this.user = user; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}