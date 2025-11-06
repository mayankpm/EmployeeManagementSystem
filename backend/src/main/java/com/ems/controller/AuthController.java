package com.ems.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;

import jakarta.servlet.http.HttpSession;

@Controller
public class AuthController {
    @Autowired
    private EmployeeRepository employeeRepo;

    // REGISTRATION

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("employee", new Employee());
        return "register";
    }

    @PostMapping("/register")
    public String registerEmployee(@ModelAttribute Employee employee, Model model) {
        // Check if email already exists
        Employee existingEmployee = employeeRepo.findByPersonalEmail(employee.getPersonalEmail());
        if (existingEmployee != null) {
            model.addAttribute("error", "Email already registered!");
            return "register";
        }

        // Default RoleCode for new user (since DB expects a RoleCode from Salary table)
        if (employee.getRoleCode() == null || employee.getRoleCode().isEmpty()) {
            employee.setRoleCode("L1");  // lowest level role from your Salary table
        }

        // Default DeptCode (optional)
        if (employee.getDeptCode() == null || employee.getDeptCode().isEmpty()) {
            employee.setDeptCode("HR"); // safe default if needed
        }

        employee.setApprovalStatus("UNDEFINED");
        employeeRepo.save(employee);
        return "redirect:/login";
    }

    // LOGIN

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String personalEmail,
                        @RequestParam String password,
                        Model model,
                        HttpSession session) { // <-- Add this

        Employee emp = employeeRepo.findByPersonalEmail(personalEmail);

        if (emp == null) {
            model.addAttribute("error", "Invalid email or password!");
            return "login";
        }

        if (!"APPROVED".equalsIgnoreCase(emp.getApprovalStatus())) {
            if ("DECLINED".equalsIgnoreCase(emp.getApprovalStatus())) {
                model.addAttribute("error", "Your registration was declined by HR.");
            } else {
                model.addAttribute("error", "Your registration is pending HR approval. Please wait for confirmation.");
            }
            return "login";
        }

        if (emp.getPassword() != null && emp.getPassword().equals(password)) {
           
            session.setAttribute("loggedInEmployee", emp);

            String role = emp.getRoleCode().trim().toUpperCase();
            if (role.startsWith("ADM")) {
                return "redirect:/admin/dashboard";
            } else if (role.equals("HR")) {
                return "redirect:/hr/dashboard";
            } else {
                return "redirect:/employee/dashboard?empId=" + emp.getEmpId();
            }
        } else {
            model.addAttribute("error", "Invalid email or password!");
            return "login";
        }
    }


}
