package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.dto.LoginRequest;
import com.ems.dto.LoginResponse;
import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import com.ems.config.JwtUtils;
import com.ems.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<?> registerEmployee(@RequestBody Employee employee) {
        try {
            // Check if email already exists
            Employee existingEmployee = employeeRepo.findByPersonalEmail(employee.getPersonalEmail());
            if (existingEmployee != null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email already registered!"));
            }

            // Set defaults
            if (employee.getRoleCode() == null || employee.getRoleCode().isEmpty()) {
                employee.setRoleCode("L1");
            }
            if (employee.getDeptCode() == null || employee.getDeptCode().isEmpty()) {
                employee.setDeptCode("HR");
            }

            // Encode password before saving
            if (employee.getPassword() != null && !employee.getPassword().isEmpty()) {
                employee.setPassword(passwordEncoder.encode(employee.getPassword()));
            }

            employee.setApprovalStatus("UNDEFINED");
            Employee savedEmployee = employeeRepo.save(employee);
            
            return ResponseEntity.ok(ApiResponse.success(
                "Registration successful! Please wait for HR approval.", 
                savedEmployee
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

 // LOGIN
 // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Find employee by workMail
            Employee emp = employeeRepo.findByWorkMail(loginRequest.getPersonalEmail());

            if (emp == null) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("Invalid email or password!"));
            }

            // Check approval status
            if (!"APPROVED".equalsIgnoreCase(emp.getApprovalStatus())) {
                if ("DECLINED".equalsIgnoreCase(emp.getApprovalStatus())) {
                    return ResponseEntity.status(403)
                        .body(ApiResponse.error("Your registration was declined by HR."));
                } else {
                    return ResponseEntity.status(403)
                        .body(ApiResponse.error("Your registration is pending HR approval."));
                }
            }

            // MANUAL PASSWORD CHECK (bypass Spring Security for now)
            if (emp.getPassword() == null || !emp.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.status(401)
                    .body(ApiResponse.error("Invalid email or password!"));
            }

            // Generate JWT token manually (bypass Spring Security authentication)
            final String jwtToken = jwtUtils.generateTokenManual(emp.getWorkMail(), emp.getEmpId(), emp.getRoleCode());

            // Create login response
            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setEmpId(emp.getEmpId());
            loginResponse.setRoleCode(emp.getRoleCode());
            loginResponse.setFirstName(emp.getFirstName());
            loginResponse.setEmail(emp.getWorkMail());
            loginResponse.setToken(jwtToken);
            loginResponse.setSuccess(true);
            loginResponse.setMessage("Login successful!");

            return ResponseEntity.ok(loginResponse);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }
    // Validate Token Endpoint (Optional - for frontend to check token validity)
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String jwtToken = token.substring(7);
                String username = jwtUtils.extractUsername(jwtToken);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                if (jwtUtils.validateToken(jwtToken, userDetails)) {
                    return ResponseEntity.ok(ApiResponse.success("Token is valid"));
                }
            }
            return ResponseEntity.status(401).body(ApiResponse.error("Invalid token"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(ApiResponse.error("Invalid token"));
        }
    }
}