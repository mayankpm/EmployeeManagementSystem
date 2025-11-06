package com.ems.controller;

import com.ems.dto.AdminDashboardResponse;
import com.ems.dto.ApiResponse;
import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import com.ems.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private JwtUtils jwtUtils;

    // ADMIN DASHBOARD
    @GetMapping("/dashboard")
    public ResponseEntity<?> adminDashboard(@RequestHeader("Authorization") String token) {
        try {
            // Verify admin role
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!roleCode.startsWith("ADM")) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. Admin privileges required."));
            }

            List<Employee> allEmployees = employeeRepo.findAll();

            long totalEmployees = allEmployees.size();
            long managerCount = allEmployees.stream()
                    .filter(e -> e.getRoleCode() != null && e.getRoleCode().startsWith("M"))
                    .count();
            long hrCount = allEmployees.stream()
                    .filter(e -> "HR".equalsIgnoreCase(e.getDeptCode()))
                    .count();
            long otherCount = totalEmployees - managerCount - hrCount;

            AdminDashboardResponse response = new AdminDashboardResponse();
            response.setEmployees(allEmployees);
            response.setTotalEmployees(totalEmployees);
            response.setManagerCount(managerCount);
            response.setHrCount(hrCount);
            response.setEmployeeCount(otherCount);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error loading admin dashboard: " + e.getMessage()));
        }
    }

    // DELETE EMPLOYEE
    @DeleteMapping("/employee/{empId}")
    public ResponseEntity<?> deleteEmployee(@RequestHeader("Authorization") String token,
                                          @PathVariable Integer empId) {
        try {
            // Verify admin role
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!roleCode.startsWith("ADM")) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. Admin privileges required."));
            }

            if (!employeeRepo.existsById(empId)) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Employee not found with ID: " + empId));
            }

            employeeRepo.deleteById(empId);
            return ResponseEntity.ok(ApiResponse.success("Employee deleted successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error deleting employee: " + e.getMessage()));
        }
    }

    // GET EMPLOYEE FOR EDITING
    @GetMapping("/employee/{empId}")
    public ResponseEntity<?> getEmployee(@RequestHeader("Authorization") String token,
                                       @PathVariable Integer empId) {
        try {
            // Verify admin role
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!roleCode.startsWith("ADM")) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. Admin privileges required."));
            }

            Employee employee = employeeRepo.findById(empId).orElse(null);
            if (employee == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Employee not found with ID: " + empId));
            }

            return ResponseEntity.ok(employee);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error fetching employee: " + e.getMessage()));
        }
    }

    // UPDATE EMPLOYEE
    @PutMapping("/employee/{empId}")
    public ResponseEntity<?> updateEmployee(@RequestHeader("Authorization") String token,
                                          @PathVariable Integer empId,
                                          @RequestBody Employee employeeUpdates) {
        try {
            // Verify admin role
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!roleCode.startsWith("ADM")) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. Admin privileges required."));
            }

            Employee existingEmployee = employeeRepo.findById(empId).orElse(null);
            if (existingEmployee == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Employee not found with ID: " + empId));
            }

            // Update employee fields
            existingEmployee.setFirstName(employeeUpdates.getFirstName());
            existingEmployee.setLastName(employeeUpdates.getLastName());
            existingEmployee.setAge(employeeUpdates.getAge());
            existingEmployee.setAddress(employeeUpdates.getAddress());
            existingEmployee.setPersonalEmail(employeeUpdates.getPersonalEmail());
            existingEmployee.setPhone(employeeUpdates.getPhone());
            existingEmployee.setRoleCode(employeeUpdates.getRoleCode());
            existingEmployee.setDeptCode(employeeUpdates.getDeptCode());
            existingEmployee.setApprovalStatus(employeeUpdates.getApprovalStatus());

            // Update password only if provided
            if (employeeUpdates.getPassword() != null && !employeeUpdates.getPassword().trim().isEmpty()) {
                existingEmployee.setPassword(employeeUpdates.getPassword());
            }

            Employee updatedEmployee = employeeRepo.save(existingEmployee);
            return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", updatedEmployee));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error updating employee: " + e.getMessage()));
        }
    }
}