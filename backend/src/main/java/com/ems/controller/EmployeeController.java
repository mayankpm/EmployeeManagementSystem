package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.dto.EmployeeDashboardResponse;
import com.ems.dto.EmployeeSearchResultDTO;
import com.ems.dto.SearchRequest;
import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import com.ems.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private JwtUtils jwtUtils;

    // EMPLOYEE DASHBOARD
    @GetMapping("/dashboard")
    public ResponseEntity<?> employeeDashboard(@RequestHeader("Authorization") String token) {
        try {
            int empId = jwtUtils.extractEmpId(token.substring(7));
            Employee employee = employeeRepo.findById(empId).orElse(null);
            
            if (employee == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Employee not found"));
            }

            EmployeeDashboardResponse response = new EmployeeDashboardResponse();
            response.setEmployee(employee);
            response.setSuccess("Dashboard loaded successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error loading dashboard: " + e.getMessage()));
        }
    }

    // GET EMPLOYEE PROFILE
    @GetMapping("/profile")
    public ResponseEntity<?> getEmployeeProfile(@RequestHeader("Authorization") String token) {
        try {
            int empId = jwtUtils.extractEmpId(token.substring(7));
            Employee employee = employeeRepo.findById(empId).orElse(null);
            
            if (employee == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Employee not found"));
            }

            return ResponseEntity.ok(employee);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error fetching profile: " + e.getMessage()));
        }
    }

    // UPDATE EMPLOYEE PROFILE
    @PutMapping("/profile")
    public ResponseEntity<?> updateEmployeeProfile(@RequestHeader("Authorization") String token, 
                                                 @RequestBody Employee employeeUpdates) {
        try {
            int empId = jwtUtils.extractEmpId(token.substring(7));
            Employee existingEmployee = employeeRepo.findById(empId).orElse(null);
            
            if (existingEmployee == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Employee not found"));
            }

            // Check if email is already taken by another employee
            Employee emailCheck = employeeRepo.findByPersonalEmail(employeeUpdates.getPersonalEmail());
            if (emailCheck != null && emailCheck.getEmpId() != empId) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email already registered by another employee!"));
            }

            // Update only allowed fields (phone, email, address, password)
            existingEmployee.setPersonalEmail(employeeUpdates.getPersonalEmail());
            existingEmployee.setPhone(employeeUpdates.getPhone());
            existingEmployee.setAddress(employeeUpdates.getAddress());
            
            // Update password only if provided (not empty)
            if (employeeUpdates.getPassword() != null && !employeeUpdates.getPassword().trim().isEmpty()) {
                existingEmployee.setPassword(employeeUpdates.getPassword());
            }

            // Save to database
            Employee updatedEmployee = employeeRepo.save(existingEmployee);
            
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedEmployee));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error updating profile: " + e.getMessage()));
        }
    }

    // EMPLOYEE SEARCH FUNCTIONALITY - UPDATED VERSION
 // EMPLOYEE SEARCH FUNCTIONALITY - UPDATED VERSION
    @PostMapping("/search")
    public ResponseEntity<?> searchEmployees(@RequestHeader("Authorization") String token,
                                           @RequestBody SearchRequest searchRequest) {
        try {
            int currentEmpId = jwtUtils.extractEmpId(token.substring(7));
            Employee currentEmployee = employeeRepo.findById(currentEmpId).orElse(null);
            
            if (currentEmployee == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Employee not found"));
            }
            
            List<EmployeeSearchResultDTO> searchResults;
            String query = searchRequest.getQuery();
            
            if (query == null || query.trim().isEmpty()) {
                // If no query, return all employees (excluding current user) with only required fields
                searchResults = employeeRepo.findAll().stream()
                    .filter(emp -> emp.getEmpId() != currentEmpId)
                    .map(this::convertToSearchResultDTO)
                    .collect(Collectors.toList());
            } else {
                // Search by name or department only
                searchResults = employeeRepo.findAll().stream()
                    .filter(emp -> emp.getEmpId() != currentEmpId &&
                        (emp.getFirstName().toLowerCase().contains(query.toLowerCase()) ||
                         emp.getLastName().toLowerCase().contains(query.toLowerCase()) ||
                         (emp.getFirstName() + " " + emp.getLastName()).toLowerCase().contains(query.toLowerCase()) ||
                         (emp.getDeptCode() != null && emp.getDeptCode().toLowerCase().contains(query.toLowerCase()))))
                    .map(this::convertToSearchResultDTO)
                    .collect(Collectors.toList());
            }
            
            EmployeeDashboardResponse response = new EmployeeDashboardResponse();
            response.setEmployee(currentEmployee);
            response.setSearchResults(searchResults); // Now this accepts List<EmployeeSearchResultDTO>
            response.setSearchQuery(query);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error searching employees: " + e.getMessage()));
        }
    }

    // Helper method to convert Employee to search result DTO
    private EmployeeSearchResultDTO convertToSearchResultDTO(Employee employee) {
        return new EmployeeSearchResultDTO(
            employee.getFirstName() + " " + employee.getLastName(),
            employee.getDeptCode() != null ? employee.getDeptCode() : "N/A",
            employee.getWorkMail() != null ? employee.getWorkMail() : "N/A"
        );
    }
}