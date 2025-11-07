package com.ems.controller;

import com.ems.config.JwtUtils;
import com.ems.dto.ApiResponse;
import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import com.ems.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
public class EmailRESTController {

    private final EmailService emailService;
    private final EmployeeRepository employeeRepo;
    private final JwtUtils jwtUtils;

    @Autowired
    public EmailRESTController(EmailService emailService, EmployeeRepository employeeRepo, JwtUtils jwtUtils) {
        this.emailService = emailService;
        this.employeeRepo = employeeRepo;
        this.jwtUtils = jwtUtils;
    }

    // Optional endpoint to test API status
    @GetMapping("/status")
    public ResponseEntity<String> checkStatus() {
        return ResponseEntity.ok("Email REST Controller is running");
    }

    // Send credentials to employee by ID
    @PostMapping("/hr/sendCredentials/{empId}")
    public ResponseEntity<?> sendEmployeeCredentials(@RequestHeader("Authorization") String token, @PathVariable Integer empId) {
        try {
            // Extract HR employee ID from JWT token
            int hrEmpId = jwtUtils.extractEmpId(token.substring(7));
            Employee loggedInHr = employeeRepo.findById(hrEmpId).orElse(null);

            if (loggedInHr == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("HR user not found"));
            }

            // Find target employee
            Employee employee = employeeRepo.findById(empId)
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found"));

            // Validate department access - HR can only send credentials to employees in their department
            String hrDepartment = loggedInHr.getDeptCode();
            if (hrDepartment == null || !hrDepartment.equalsIgnoreCase(employee.getDeptCode())) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Access denied: Can only send credentials to employees in your department"));
            }

            // Update employee approval status and save
            employee.setApprovalStatus("APPROVED");
            employeeRepo.save(employee);

            // Send credentials via email
            emailService.generateAndSendCredentials(employee);

            return ResponseEntity.ok(ApiResponse.success("Credentials sent successfully to " + employee.getPersonalEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to send credentials: " + e.getMessage()));
        }
    }
}
