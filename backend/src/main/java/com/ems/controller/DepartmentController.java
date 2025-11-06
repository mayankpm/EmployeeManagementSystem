package com.ems.controller;

import com.ems.dto.DepartmentDTO;
import com.ems.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentDTO.Response>> getAllDepartments() {
        List<DepartmentDTO.Response> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    // Change to use @RequestBody
    @PostMapping("/add")
    public ResponseEntity<DepartmentDTO.Response> addDepartment(@RequestBody DepartmentDTO.Request departmentRequest) {
        try {
            DepartmentDTO.Response savedDepartment = departmentService.addDepartment(
                departmentRequest.getDeptCode(), 
                departmentRequest.getDeptName(), 
                departmentRequest.getAssignedHR()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDepartment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Change to use @RequestBody
    @PostMapping("/update")
    public ResponseEntity<DepartmentDTO.Response> updateDepartment(@RequestBody DepartmentDTO.Request departmentRequest) {
        try {
            DepartmentDTO.Response updatedDepartment = departmentService.updateDepartment(
                departmentRequest.getDeptCode(), 
                departmentRequest.getDeptName(), 
                departmentRequest.getAssignedHR()
            );
            return ResponseEntity.ok(updatedDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{deptCode}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable String deptCode) {
        try {
            departmentService.deleteDepartment(deptCode);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}