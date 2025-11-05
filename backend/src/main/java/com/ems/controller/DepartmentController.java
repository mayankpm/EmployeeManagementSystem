package com.ems.controller;

import com.ems.model.Department;
import com.ems.repo.DepartemntRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/departments")
public class DepartmentController {

    @Autowired
    private DepartemntRepo departmentRepo;

    // View all departments
    @GetMapping
    public String listDepartments(Model model) {
        List<Department> departments = departmentRepo.findAll();
        model.addAttribute("departments", departments);
        return "manage-departments";
    }

    // Add new department
    @PostMapping("/add")
    public String addDepartment(@RequestParam String deptCode,
                                @RequestParam String deptName,
                                @RequestParam(required = false) String assignedHR) {
        Department dept = new Department(deptCode, deptName, assignedHR);
        departmentRepo.save(dept);
        return "redirect:/departments";
    }

    // Update department (name and HR)
    @PostMapping("/update")
    public String updateDepartment(@RequestParam String deptCode,
                                   @RequestParam String deptName,
                                   @RequestParam(required = false) String assignedHR) {
        Department existing = departmentRepo.findById(deptCode).orElse(null);
        if (existing != null) {
            existing.setDeptName(deptName);
            existing.setAssignedHR(assignedHR);
            departmentRepo.save(existing);
        }
        return "redirect:/departments";
    }

    // Delete department
    @GetMapping("/delete/{deptCode}")
    public String deleteDepartment(@PathVariable String deptCode) {
        departmentRepo.deleteById(deptCode);
        return "redirect:/departments";
    }
}