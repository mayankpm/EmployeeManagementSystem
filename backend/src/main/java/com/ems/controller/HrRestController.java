package com.ems.controller;

import com.ems.config.JwtUtils;
import com.ems.dto.ApiResponse;
import com.ems.dto.HRDashboardResponse;
import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hr")
public class HrRestController {

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/dashboard")
    public ResponseEntity<?> hrDashboard(@RequestHeader("Authorization") String token) {
        try {
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!"HR".equalsIgnoreCase(roleCode)) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. HR privileges required."));
            }

            int empId = jwtUtils.extractEmpId(token.substring(7));
            Employee hrUser = employeeRepo.findById(empId).orElse(null);
            if (hrUser == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Employee not found"));
            }

            String hrDepartment = hrUser.getDeptCode();

            List<Employee> departmentEmployees = employeeRepo.findAll().stream()
                .filter(e -> hrDepartment != null && hrDepartment.equalsIgnoreCase(e.getDeptCode()))
                .collect(Collectors.toList());

            long totalEmployees = departmentEmployees.size();
            long regularCount = departmentEmployees.stream()
                .filter(e -> e.getRoleCode() != null && (e.getRoleCode().startsWith("L") || e.getRoleCode().startsWith("SDE")))
                .count();

            HRDashboardResponse response = new HRDashboardResponse();
            response.setEmployees(departmentEmployees);
            response.setTotalEmployees(totalEmployees);
            response.setEmployeeCount(regularCount);
            response.setHrDepartment(hrDepartment);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error loading HR dashboard: " + e.getMessage()));
        }
    }

    @GetMapping("/employee/{empId}")
    public ResponseEntity<?> getEmployeeForHr(@RequestHeader("Authorization") String token,
                                              @PathVariable Integer empId) {
        try {
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!"HR".equalsIgnoreCase(roleCode)) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. HR privileges required."));
            }

            int hrId = jwtUtils.extractEmpId(token.substring(7));
            Employee hrUser = employeeRepo.findById(hrId).orElse(null);
            if (hrUser == null) return ResponseEntity.badRequest().body(ApiResponse.error("Employee not found"));

            Employee target = employeeRepo.findById(empId).orElse(null);
            if (target == null || hrUser.getDeptCode() == null || !hrUser.getDeptCode().equalsIgnoreCase(target.getDeptCode())) {
                return ResponseEntity.status(403).body(ApiResponse.error("Not allowed for this department"));
            }

            return ResponseEntity.ok(target);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error fetching employee: " + e.getMessage()));
        }
    }

    @PutMapping("/employee/{empId}")
    public ResponseEntity<?> updateEmployeeForHr(@RequestHeader("Authorization") String token,
                                                 @PathVariable Integer empId,
                                                 @RequestBody Employee updates) {
        try {
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!"HR".equalsIgnoreCase(roleCode)) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. HR privileges required."));
            }

            int hrId = jwtUtils.extractEmpId(token.substring(7));
            Employee hrUser = employeeRepo.findById(hrId).orElse(null);
            if (hrUser == null) return ResponseEntity.badRequest().body(ApiResponse.error("Employee not found"));

            Employee existing = employeeRepo.findById(empId).orElse(null);
            if (existing == null) return ResponseEntity.badRequest().body(ApiResponse.error("Target employee not found"));

            if (hrUser.getDeptCode() == null || !hrUser.getDeptCode().equalsIgnoreCase(existing.getDeptCode())) {
                return ResponseEntity.status(403).body(ApiResponse.error("Not allowed for this department"));
            }

            // Update allowed fields for HR
            if (updates.getPhone() != null) existing.setPhone(updates.getPhone());
            if (updates.getAge() != null) existing.setAge(updates.getAge());
            if (updates.getAddress() != null) existing.setAddress(updates.getAddress());
            if (updates.getPersonalEmail() != null) existing.setPersonalEmail(updates.getPersonalEmail());
            if (updates.getRoleCode() != null) existing.setRoleCode(updates.getRoleCode());

            Employee saved = employeeRepo.save(existing);
            return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error updating employee: " + e.getMessage()));
        }
    }

    @GetMapping("/approvals")
    public ResponseEntity<?> getPendingApprovals(@RequestHeader("Authorization") String token) {
        try {
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!"HR".equalsIgnoreCase(roleCode)) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. HR privileges required."));
            }

            int empId = jwtUtils.extractEmpId(token.substring(7));
            Employee hrUser = employeeRepo.findById(empId).orElse(null);
            if (hrUser == null) return ResponseEntity.badRequest().body(ApiResponse.error("Employee not found"));

            String dept = hrUser.getDeptCode() != null ? hrUser.getDeptCode().trim() : null;
            List<Employee> pending = employeeRepo.findByApprovalStatus("UNDEFINED").stream()
                .filter(e -> {
                    String empDept = e.getDeptCode() != null ? e.getDeptCode().trim() : null;
                    return dept != null && empDept != null && dept.equalsIgnoreCase(empDept);
                })
                .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(pending);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error fetching approvals: " + e.getMessage()));
        }
    }

    @PostMapping("/approvals/{empId}/approve")
    public ResponseEntity<?> approveEmployee(@RequestHeader("Authorization") String token,
                                             @PathVariable Integer empId) {
        return updateApproval(token, empId, "APPROVED");
    }

    @PostMapping("/approvals/{empId}/decline")
    public ResponseEntity<?> declineEmployee(@RequestHeader("Authorization") String token,
                                             @PathVariable Integer empId) {
        return updateApproval(token, empId, "DECLINED");
    }

    private ResponseEntity<?> updateApproval(String token, Integer empId, String status) {
        try {
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!"HR".equalsIgnoreCase(roleCode)) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. HR privileges required."));
            }

            int hrId = jwtUtils.extractEmpId(token.substring(7));
            Employee hrUser = employeeRepo.findById(hrId).orElse(null);
            if (hrUser == null) return ResponseEntity.badRequest().body(ApiResponse.error("Employee not found"));

            Employee target = employeeRepo.findById(empId).orElse(null);
            if (target == null) return ResponseEntity.badRequest().body(ApiResponse.error("Target employee not found"));
            if (hrUser.getDeptCode() == null || !hrUser.getDeptCode().equalsIgnoreCase(target.getDeptCode())) {
                return ResponseEntity.status(403).body(ApiResponse.error("Not allowed for this department"));
            }

            target.setApprovalStatus(status);
            employeeRepo.save(target);
            return ResponseEntity.ok(ApiResponse.success("Employee " + status.toLowerCase() + " successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error updating approval: " + e.getMessage()));
        }
    }
}


