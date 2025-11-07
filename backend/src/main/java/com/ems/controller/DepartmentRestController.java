package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.model.Department;
import com.ems.repo.DepartemntRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentRestController {

    @Autowired
    private DepartemntRepo departmentRepo;

    @GetMapping
    public ResponseEntity<?> list() {
        List<Department> all = departmentRepo.findAll();
        return ResponseEntity.ok(all);
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Department department) {
        if (department.getDeptCode() == null || department.getDeptCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Department code is required"));
        }
        Department saved = departmentRepo.save(department);
        return ResponseEntity.ok(ApiResponse.success("Department added", saved));
    }

    @PutMapping("/{deptCode}")
    public ResponseEntity<?> update(@PathVariable String deptCode, @RequestBody Department incoming) {
        Department existing = departmentRepo.findById(deptCode).orElse(null);
        if (existing == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Department not found"));
        }
        if (incoming.getDeptName() != null) existing.setDeptName(incoming.getDeptName());
        if (incoming.getAssignedHR() != null) existing.setAssignedHR(incoming.getAssignedHR());
        Department saved = departmentRepo.save(existing);
        return ResponseEntity.ok(ApiResponse.success("Department updated", saved));
    }

    @DeleteMapping("/{deptCode}")
    public ResponseEntity<?> delete(@PathVariable String deptCode) {
        if (!departmentRepo.existsById(deptCode)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Department not found"));
        }
        departmentRepo.deleteById(deptCode);
        return ResponseEntity.ok(ApiResponse.success("Department deleted"));
    }
}



