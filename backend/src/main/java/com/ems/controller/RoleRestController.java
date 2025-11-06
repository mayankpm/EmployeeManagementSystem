package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.model.Salary;
import com.ems.repo.SalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleRestController {

    @Autowired
    private SalaryRepository salaryRepository;

    @GetMapping
    public ResponseEntity<?> list() {
        List<Salary> roles = salaryRepository.findAll();
        return ResponseEntity.ok(roles);
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Salary role) {
        if (role.getRoleCode() == null || role.getRoleCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Role code is required"));
        }
        if (role.getBaseSalary() == null) {
            role.setBaseSalary(BigDecimal.ZERO);
        }
        Salary saved = salaryRepository.save(role);
        return ResponseEntity.ok(ApiResponse.success("Role added", saved));
    }

    @PutMapping("/{roleCode}")
    public ResponseEntity<?> update(@PathVariable String roleCode, @RequestBody Salary incoming) {
        Salary existing = salaryRepository.findById(roleCode).orElse(null);
        if (existing == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Role not found"));
        }
        if (incoming.getBaseSalary() != null) {
            existing.setBaseSalary(incoming.getBaseSalary());
        }
        Salary saved = salaryRepository.save(existing);
        return ResponseEntity.ok(ApiResponse.success("Role updated", saved));
    }

    @DeleteMapping("/{roleCode}")
    public ResponseEntity<?> delete(@PathVariable String roleCode) {
        if (!salaryRepository.existsById(roleCode)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Role not found"));
        }
        salaryRepository.deleteById(roleCode);
        return ResponseEntity.ok(ApiResponse.success("Role deleted"));
    }
}


