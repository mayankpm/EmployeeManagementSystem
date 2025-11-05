package com.ems.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;

@Controller
public class AdminController {
    // ADMIN DASHBOARD
	
	@Autowired
    private EmployeeRepository employeeRepo;

    @GetMapping("/admin/dashboard")
    public String adminDashboard(Model model) {
        List<Employee> allEmployees = employeeRepo.findAll();
        model.addAttribute("employees", allEmployees);

        long totalEmployees = allEmployees.size();
        long managerCount = allEmployees.stream()
                .filter(e -> e.getRoleCode() != null && e.getRoleCode().startsWith("M"))
                .count();
        long hrCount = allEmployees.stream()
                .filter(e -> "HR".equalsIgnoreCase(e.getDeptCode()))
                .count();
        long otherCount = totalEmployees - managerCount - hrCount;

        model.addAttribute("totalEmployees", totalEmployees);
        model.addAttribute("managerCount", managerCount);
        model.addAttribute("hrCount", hrCount);
        model.addAttribute("employeeCount", otherCount);

        return "admin-dashboard";
    }

    @GetMapping("/admin/delete/{empId}")
    public String deleteEmployee(@PathVariable Integer empId) {
        employeeRepo.deleteById(empId);
        return "redirect:/admin/dashboard";
    }

    @GetMapping("/admin/edit/{empId}")
    public String showEditForm(@PathVariable Integer empId, Model model) {
        Employee employee = employeeRepo.findById(empId).orElse(null);
        model.addAttribute("employee", employee);
        return "edit-employeeadm";
    }

    @PostMapping("/admin/update")
    public String updateEmployee(@ModelAttribute Employee employee) {
        employeeRepo.save(employee);
        return "redirect:/admin/dashboard";
    }
}
