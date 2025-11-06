package com.ems.controller;

import com.ems.model.Employee;
import com.ems.model.Payroll;
import com.ems.repo.EmployeeRepository;
import com.ems.service.PayrollService;
import com.ems.config.JwtUtils;
import com.ems.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private JwtUtils jwtUtils;

    // ------------------- HR: VIEW ALL PAYROLLS -------------------
    @GetMapping("/hr")
    public ResponseEntity<?> viewAllPayrolls(@RequestHeader("Authorization") String token) {
        try {
            // Verify HR role
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!"HR".equalsIgnoreCase(roleCode)) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. HR privileges required."));
            }

            int hrEmpId = jwtUtils.extractEmpId(token.substring(7));
            Employee loggedInHr = employeeRepo.findById(hrEmpId).orElse(null);
            
            if (loggedInHr == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("HR user not found"));
            }

            String hrDept = loggedInHr.getDeptCode();

            // Get employees and payrolls for HR's department
            List<Employee> deptEmployees = employeeRepo.findAll().stream()
                    .filter(e -> hrDept.equalsIgnoreCase(e.getDeptCode()))
                    .toList();

            List<Payroll> payrolls = payrollService.getPayrollDetails().stream()
                    .filter(p -> deptEmployees.stream().anyMatch(e -> e.getEmpId() == p.getEmpId()))
                    .toList();

            // Create response object
            PayrollHrResponse response = new PayrollHrResponse();
            response.setEmployees(deptEmployees);
            response.setPayrolls(payrolls);
            response.setHrDepartment(hrDept);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error fetching payrolls: " + e.getMessage()));
        }
    }

    // ------------------- HR: GENERATE PAYROLL -------------------
    @PostMapping("/hr/generate")
    public ResponseEntity<?> generatePayroll(@RequestHeader("Authorization") String token,
                                           @RequestParam("empId") int empId) {
        try {
            // Verify HR role
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!"HR".equalsIgnoreCase(roleCode)) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. HR privileges required."));
            }

            int hrEmpId = jwtUtils.extractEmpId(token.substring(7));
            Employee loggedInHr = employeeRepo.findById(hrEmpId).orElse(null);
            
            if (loggedInHr == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("HR user not found"));
            }

            Employee employee = employeeRepo.findById(empId).orElse(null);
            if (employee == null || !loggedInHr.getDeptCode().equalsIgnoreCase(employee.getDeptCode())) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Employee not found or not in your department"));
            }

            payrollService.generatePayroll(empId);
            return ResponseEntity.ok(ApiResponse.success("Payroll generated successfully for employee: " + empId));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error generating payroll: " + e.getMessage()));
        }
    }

    // ------------------- HR: DOWNLOAD SALARY SLIP -------------------
    @GetMapping("/hr/pdf/{empId}")
    public ResponseEntity<?> downloadSalarySlipHR(@RequestHeader("Authorization") String token,
                                                @PathVariable int empId) {
        try {
            // Verify HR role
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!"HR".equalsIgnoreCase(roleCode)) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. HR privileges required."));
            }

            int hrEmpId = jwtUtils.extractEmpId(token.substring(7));
            Employee loggedInHr = employeeRepo.findById(hrEmpId).orElse(null);
            
            if (loggedInHr == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("HR user not found"));
            }

            Employee employee = employeeRepo.findById(empId).orElse(null);
            if (employee == null || !loggedInHr.getDeptCode().equalsIgnoreCase(employee.getDeptCode())) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied to this employee's payroll"));
            }

            byte[] pdfBytes = payrollService.generateSalarySlipPDF(empId);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=salary-slip-" + empId + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (IOException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error generating PDF: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error downloading salary slip: " + e.getMessage()));
        }
    }

    // ------------------- HR: VIEW SPECIFIC EMPLOYEE PAYROLL -------------------
    @GetMapping("/hr/employee")
    public ResponseEntity<?> viewEmployeePayroll(@RequestHeader("Authorization") String token,
                                               @RequestParam("empId") int empId) {
        try {
            // Verify HR role
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!"HR".equalsIgnoreCase(roleCode)) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. HR privileges required."));
            }

            int hrEmpId = jwtUtils.extractEmpId(token.substring(7));
            Employee loggedInHr = employeeRepo.findById(hrEmpId).orElse(null);
            
            if (loggedInHr == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("HR user not found"));
            }

            Employee employee = employeeRepo.findById(empId)
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + empId));

            // Security: HR can only view payrolls of employees in same dept
            if (!loggedInHr.getDeptCode().equalsIgnoreCase(employee.getDeptCode())) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied to this employee's payroll"));
            }

            List<Payroll> payrolls = payrollService.getPayrollsForEmployee(empId);
            
            EmployeePayrollResponse response = new EmployeePayrollResponse();
            response.setEmployee(employee);
            response.setPayrolls(payrolls);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error fetching employee payroll: " + e.getMessage()));
        }
    }

    // ------------------- HR: UPDATE PAYROLL -------------------
    @PutMapping("/hr/update")
    public ResponseEntity<?> updatePayroll(@RequestHeader("Authorization") String token,
                                          @RequestBody Payroll payroll) {
        try {
            // Verify HR role
            String roleCode = jwtUtils.extractRoleCode(token.substring(7));
            if (!"HR".equalsIgnoreCase(roleCode)) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied. HR privileges required."));
            }

            int hrEmpId = jwtUtils.extractEmpId(token.substring(7));
            Employee loggedInHr = employeeRepo.findById(hrEmpId).orElse(null);
            
            if (loggedInHr == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("HR user not found"));
            }

            Employee employee = employeeRepo.findById(payroll.getEmpId())
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + payroll.getEmpId()));

            // Security: HR can only update payrolls of employees in same dept
            if (!loggedInHr.getDeptCode().equalsIgnoreCase(employee.getDeptCode())) {
                return ResponseEntity.status(403)
                    .body(ApiResponse.error("Access denied to this employee's payroll"));
            }

            payrollService.updatePayroll(payroll);
            return ResponseEntity.ok(ApiResponse.success("Payroll updated successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error updating payroll: " + e.getMessage()));
        }
    }

    // Alias to support clients using POST for updates
    @PostMapping("/hr/update")
    public ResponseEntity<?> updatePayrollPost(@RequestHeader("Authorization") String token,
                                              @RequestBody Payroll payroll) {
        return updatePayroll(token, payroll);
    }

    // ------------------- EMPLOYEE: VIEW OWN PAYROLL -------------------
    @GetMapping("/employee")
    public ResponseEntity<?> viewEmployeePayroll(@RequestHeader("Authorization") String token) {
        try {
            int empId = jwtUtils.extractEmpId(token.substring(7));
            Employee employee = employeeRepo.findById(empId)
                    .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + empId));
            
            List<Payroll> payrolls = payrollService.getPayrollsForEmployee(empId);

            EmployeePayrollResponse response = new EmployeePayrollResponse();
            response.setEmployee(employee);
            response.setPayrolls(payrolls);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error fetching your payroll: " + e.getMessage()));
        }
    }

    // ------------------- EMPLOYEE: DOWNLOAD OWN SALARY SLIP -------------------
    @GetMapping("/employee/pdf")
    public ResponseEntity<?> downloadSalarySlipEmployee(@RequestHeader("Authorization") String token) {
        try {
            int empId = jwtUtils.extractEmpId(token.substring(7));
            
            byte[] pdfBytes = payrollService.generateSalarySlipPDF(empId);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=my-salary-slip-" + empId + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (IOException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error generating PDF: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error downloading salary slip: " + e.getMessage()));
        }
    }
}

// Response DTOs for Payroll
class PayrollHrResponse {
    private List<Employee> employees;
    private List<Payroll> payrolls;
    private String hrDepartment;
    
    // Getters and setters
    public List<Employee> getEmployees() { return employees; }
    public void setEmployees(List<Employee> employees) { this.employees = employees; }
    
    public List<Payroll> getPayrolls() { return payrolls; }
    public void setPayrolls(List<Payroll> payrolls) { this.payrolls = payrolls; }
    
    public String getHrDepartment() { return hrDepartment; }
    public void setHrDepartment(String hrDepartment) { this.hrDepartment = hrDepartment; }
}

class EmployeePayrollResponse {
    private Employee employee;
    private List<Payroll> payrolls;
    
    // Getters and setters
    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    
    public List<Payroll> getPayrolls() { return payrolls; }
    public void setPayrolls(List<Payroll> payrolls) { this.payrolls = payrolls; }
}