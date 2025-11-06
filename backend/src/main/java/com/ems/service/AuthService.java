package com.ems.service;

import com.ems.dto.AuthResponse;
import com.ems.dto.LoginRequest;
import com.ems.model.Employee;

public interface AuthService {
    AuthResponse registerEmployee(Employee employee);
    AuthResponse login(LoginRequest loginRequest);
}