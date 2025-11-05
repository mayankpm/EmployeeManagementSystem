package com.ems.controller;

import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepo;




 // EMPLOYEE DASHBOARD
    
    @GetMapping("/employee/dashboard")
    public String employeeDashboard(Model model,
                                  @RequestParam(value = "empId", required = false) Integer empId,
                                  @RequestParam(value = "success", required = false) String success) {

        if (empId == null) {
            // Redirect to login or show an error page if someone tries to access without empId
            return "redirect:/login";
        }

        Employee employee = employeeRepo.findById(empId).orElse(null);
        if (employee == null) {
            return "redirect:/login";
        }

        model.addAttribute("employee", employee);

        if (success != null) {
            model.addAttribute("success", success);
        }

        return "employee-dashboard";
    }

 
    // EMPLOYEE PROFILE EDIT
 
    @GetMapping("/employee/edit-profile")
    public String showEditProfileForm(@RequestParam("empId") int empId, Model model) {
        Employee employee = employeeRepo.findById(empId).orElse(null);
        if (employee == null) {
            return "redirect:/login";
        }
        model.addAttribute("employee", employee);
        return "edit-employee-profile";
    }
 
    @PostMapping("/employee/update-profile")
    public String updateEmployeeProfile(@ModelAttribute Employee employee,
                                      @RequestParam("empId") int empId,
                                      Model model) {
        try {
            Employee existingEmployee = employeeRepo.findById(empId).orElse(null);
            if (existingEmployee == null) {
                return "redirect:/login";
            }
 
            // Check if email is already taken by another employee
            Employee emailCheck = employeeRepo.findByPersonalEmail(employee.getPersonalEmail());
            if (emailCheck != null && emailCheck.getEmpId() != empId) {
                model.addAttribute("error", "Email already registered by another employee!");
                model.addAttribute("employee", existingEmployee);
                return "edit-employee-profile";
            }
 
            // Update only allowed fields (phone, email, address, password)
            existingEmployee.setPersonalEmail(employee.getPersonalEmail());
            existingEmployee.setPhone(employee.getPhone());
            existingEmployee.setAddress(employee.getAddress());
            
            // Update password only if provided (not empty)
            if (employee.getPassword() != null && !employee.getPassword().trim().isEmpty()) {
                existingEmployee.setPassword(employee.getPassword());
            }
 
            // Save to database
            employeeRepo.save(existingEmployee);
            
            return "redirect:/employee/dashboard?empId=" + empId + "&success=Profile updated successfully";
            
        } catch (Exception e) {
            model.addAttribute("error", "Error updating profile: " + e.getMessage());
            Employee existingEmployee = employeeRepo.findById(empId).orElse(null);
            model.addAttribute("employee", existingEmployee);
            return "edit-employee-profile";
        }
    }
 
    // EMPLOYEE SEARCH FUNCTIONALITY 
    @GetMapping("/employee/search")
    public String searchEmployees(@RequestParam("empId") int empId,
                                @RequestParam("query") String query,
                                Model model) {
        try {
            Employee currentEmployee = employeeRepo.findById(empId).orElse(null);
            if (currentEmployee == null) {
                return "redirect:/login";
            }
            
            List<Employee> searchResults;
            
            if (query == null || query.trim().isEmpty()) {
                // If no query, return all employees (excluding current user)
                searchResults = employeeRepo.findAll().stream()
                    .filter(emp -> emp.getEmpId() != empId)
                    .collect(Collectors.toList());
            } else {
                // Search by name, email, or department
                searchResults = employeeRepo.findAll().stream()
                    .filter(emp -> emp.getEmpId() != empId &&
                        (emp.getFirstName().toLowerCase().contains(query.toLowerCase()) ||
                         emp.getLastName().toLowerCase().contains(query.toLowerCase()) ||
                         (emp.getFirstName() + " " + emp.getLastName()).toLowerCase().contains(query.toLowerCase()) ||
                         emp.getPersonalEmail().toLowerCase().contains(query.toLowerCase()) ||
                         (emp.getDeptCode() != null && emp.getDeptCode().toLowerCase().contains(query.toLowerCase()))))
                    .collect(Collectors.toList());
            }
            
            model.addAttribute("employee", currentEmployee);
            model.addAttribute("results", searchResults);
            model.addAttribute("searchQuery", query);
            
            return "employee-dashboard";
            
        } catch (Exception e) {
            Employee currentEmployee = employeeRepo.findById(empId).orElse(null);
            model.addAttribute("employee", currentEmployee);
            model.addAttribute("error", "Error searching employees: " + e.getMessage());
            return "employee-dashboard";
        }
    }
}
    
