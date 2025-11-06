package com.ems.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ems.dto.AuthResponse;
import com.ems.dto.LoginRequest;
import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import com.ems.service.AuthService;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthRestController {

    @Autowired
    private AuthService authService;
    
    @Autowired
    private EmployeeRepository employeeRepo;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerEmployee(@RequestBody Employee employee) {
        AuthResponse response = authService.registerEmployee(employee);
        
        if ("Email already registered!".equals(response.getMessage())) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        
        if (response.getMessage().contains("Invalid") || 
            response.getMessage().contains("pending") || 
            response.getMessage().contains("declined")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        return ResponseEntity.ok(response);
    }
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Auth API is running");
    }
    
    // Database test endpoint
    @GetMapping("/test-db")
    public ResponseEntity<String> testDatabase() {
        try {
            long count = employeeRepo.count();
            List<Employee> all = employeeRepo.findAll();
            
            StringBuilder result = new StringBuilder();
            result.append("=== DATABASE TEST RESULTS ===\n");
            result.append("Total employees: ").append(count).append("\n\n");
            result.append("EMPLOYEE LIST:\n");
            
            for (Employee emp : all) {
                result.append("- ID: ").append(emp.getEmpId())
                      .append(" | Email: '").append(emp.getPersonalEmail())
                      .append("' | Name: ").append(emp.getFirstName()).append(" ").append(emp.getLastName())
                      .append(" | Approval: ").append(emp.getApprovalStatus())
                      .append(" | Password: '").append(emp.getPassword()).append("'")
                      .append("\n");
            }
            
            // Test repository methods
            result.append("\n=== REPOSITORY METHOD TESTS ===\n");
            Employee testEmployee = employeeRepo.findByPersonalEmail("rudresh.prakash@gmail.com");
            result.append("findByPersonalEmail('rudresh.prakash@gmail.com'): ").append(testEmployee != null ? "FOUND" : "NOT FOUND").append("\n");
            
            // Test case-insensitive search manually
            result.append("\n=== MANUAL CASE-INSENSITIVE SEARCH ===\n");
            boolean foundCaseInsensitive = false;
            for (Employee emp : all) {
                if (emp.getPersonalEmail() != null && 
                    emp.getPersonalEmail().equalsIgnoreCase("rudresh.prakash@gmail.com")) {
                    foundCaseInsensitive = true;
                    result.append("Found via case-insensitive: ").append(emp.getPersonalEmail()).append("\n");
                    break;
                }
            }
            result.append("Case-insensitive search result: ").append(foundCaseInsensitive ? "FOUND" : "NOT FOUND").append("\n");
            
            return ResponseEntity.ok(result.toString());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Database error: " + e.getMessage());
        }
    }
}