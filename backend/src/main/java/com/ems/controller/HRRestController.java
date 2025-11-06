package com.ems.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ems.dto.HRStatsResponse;
import com.ems.dto.HREmployeeResponse;
import com.ems.model.Employee;
import com.ems.service.HRService;

import java.util.List;

@RestController
@RequestMapping("/api/hr")
@CrossOrigin(origins = "http://localhost:4200")
public class HRRestController {

    @Autowired
    private HRService hrService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<HRStatsResponse> getDashboardStats(@RequestHeader("X-HR-Department") String hrDepartment) {
        HRStatsResponse stats = hrService.getHRDashboardStats(hrDepartment);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getDepartmentEmployees(@RequestHeader("X-HR-Department") String hrDepartment) {
        List<Employee> employees = hrService.getDepartmentEmployees(hrDepartment);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/approvals/pending")
    public ResponseEntity<List<Employee>> getPendingApprovals(@RequestHeader("X-HR-Department") String hrDepartment) {
        List<Employee> pendingEmployees = hrService.getPendingApprovals(hrDepartment);
        return ResponseEntity.ok(pendingEmployees);
    }

    @GetMapping("/employees/{empId}")
    public ResponseEntity<Employee> getEmployeeDetails(@PathVariable Integer empId, 
                                                     @RequestHeader("X-HR-Department") String hrDepartment) {
        Employee employee = hrService.getEmployeeDetails(empId, hrDepartment);
        if (employee != null) {
            return ResponseEntity.ok(employee);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/employees/{empId}/approve")
    public ResponseEntity<HREmployeeResponse> approveEmployee(@PathVariable Integer empId,
                                                            @RequestHeader("X-HR-Department") String hrDepartment) {
        HREmployeeResponse response = hrService.approveEmployee(empId, hrDepartment);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/employees/{empId}/decline")
    public ResponseEntity<HREmployeeResponse> declineEmployee(@PathVariable Integer empId,
                                                            @RequestHeader("X-HR-Department") String hrDepartment) {
        HREmployeeResponse response = hrService.declineEmployee(empId, hrDepartment);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PutMapping("/employees/{empId}")
    public ResponseEntity<HREmployeeResponse> updateEmployee(@PathVariable Integer empId,
                                                           @RequestBody Employee employee,
                                                           @RequestHeader("X-HR-Department") String hrDepartment) {
        employee.setEmpId(empId); // Ensure ID matches path
        HREmployeeResponse response = hrService.updateEmployee(employee, hrDepartment);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
    
    
}