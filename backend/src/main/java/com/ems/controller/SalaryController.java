package com.ems.controller;

import com.ems.dto.SalaryDTO;
import com.ems.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService salaryService;

    @GetMapping
    public ResponseEntity<List<SalaryDTO.Response>> getAllRoles() {
        List<SalaryDTO.Response> roles = salaryService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

   
    @PostMapping("/add")
    public ResponseEntity<SalaryDTO.Response> addSalary(@RequestBody SalaryDTO.Request salaryRequest) {
        try {
            SalaryDTO.Response savedSalary = salaryService.addRole(
                salaryRequest.getRoleCode(), 
                salaryRequest.getBaseSalary().doubleValue()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSalary);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    
    @PostMapping("/update")
    public ResponseEntity<SalaryDTO.Response> updateSalary(@RequestBody SalaryDTO.Request salaryRequest) {
        try {
            SalaryDTO.Response updatedSalary = salaryService.updateRole(
                salaryRequest.getRoleCode(), 
                salaryRequest.getBaseSalary().doubleValue()
            );
            return ResponseEntity.ok(updatedSalary);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{roleCode}")
    public ResponseEntity<Void> deleteSalary(@PathVariable String roleCode) {
        try {
            salaryService.deleteRole(roleCode);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}