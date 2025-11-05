package com.ems.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;

import jakarta.servlet.http.HttpSession;

@Controller
public class HRController {

    @Autowired
    private EmployeeRepository employeeRepo;

    // ------------------- HR DASHBOARD -------------------
    @GetMapping("/hr/dashboard")
    public String hrDashboard(HttpSession session, Model model) {
        Employee loggedInHr = (Employee) session.getAttribute("loggedInEmployee");
        if (loggedInHr == null || !"HR".equalsIgnoreCase(loggedInHr.getRoleCode())) {
            return "redirect:/login";
        }

        String hrDepartment = loggedInHr.getDeptCode();

        // ✅ Filter employees by HR's department
        List<Employee> departmentEmployees = employeeRepo.findAll().stream()
                .filter(e -> hrDepartment.equalsIgnoreCase(e.getDeptCode()))
                .collect(Collectors.toList());

        model.addAttribute("employees", departmentEmployees);

        // ✅ Department statistics
        long totalEmployees = departmentEmployees.size();
        long regularCount = departmentEmployees.stream()
                .filter(e -> e.getRoleCode() != null &&
                        (e.getRoleCode().startsWith("L") || e.getRoleCode().startsWith("SDE")))
                .count();

        model.addAttribute("totalEmployees", totalEmployees);
        model.addAttribute("employeeCount", regularCount);
        model.addAttribute("hrDepartment", hrDepartment);

        return "hr-dashboard";
    }

    // ------------------- VIEW EMPLOYEE DETAILS -------------------
    @GetMapping("/hr/view/{empId}")
    public String viewEmployeeDetails(@PathVariable Integer empId, HttpSession session, Model model) {
        Employee loggedInHr = (Employee) session.getAttribute("loggedInEmployee");
        if (loggedInHr == null) return "redirect:/login";

        Employee employee = employeeRepo.findById(empId).orElse(null);
        if (employee == null || !loggedInHr.getDeptCode().equalsIgnoreCase(employee.getDeptCode())) {
            return "redirect:/hr/dashboard";
        }

        model.addAttribute("employee", employee);
        return "employee-details";
    }

    // ------------------- EDIT EMPLOYEE -------------------
    @GetMapping("/hr/edit/{empId}")
    public String showHrEditForm(@PathVariable Integer empId, HttpSession session, Model model) {
        Employee loggedInHr = (Employee) session.getAttribute("loggedInEmployee");
        if (loggedInHr == null) return "redirect:/login";

        Employee employee = employeeRepo.findById(empId).orElse(null);
        if (employee == null || !loggedInHr.getDeptCode().equalsIgnoreCase(employee.getDeptCode())) {
            return "redirect:/hr/dashboard";
        }

        model.addAttribute("employee", employee);
        return "edit-employeehr";
    }

    @PostMapping("/hr/update")
    public String updateHrEmployee(@ModelAttribute Employee employee, HttpSession session) {
        Employee loggedInHr = (Employee) session.getAttribute("loggedInEmployee");
        if (loggedInHr == null) return "redirect:/login";

        Employee existingEmployee = employeeRepo.findById(employee.getEmpId()).orElse(null);
        if (existingEmployee == null || !loggedInHr.getDeptCode().equalsIgnoreCase(existingEmployee.getDeptCode())) {
            return "redirect:/hr/dashboard";
        }

        employeeRepo.save(employee);
        return "redirect:/hr/dashboard";
    }

    // ------------------- APPROVALS -------------------
    @GetMapping("/hr/approvals")
    public String viewPendingApprovals(HttpSession session, Model model) {
        Employee loggedInHr = (Employee) session.getAttribute("loggedInEmployee");
        if (loggedInHr == null) return "redirect:/login";

        String hrDepartment = loggedInHr.getDeptCode();

        List<Employee> pendingEmployees = employeeRepo.findByApprovalStatus("UNDEFINED").stream()
                .filter(e -> hrDepartment.equalsIgnoreCase(e.getDeptCode()))
                .collect(Collectors.toList());

        model.addAttribute("pendingEmployees", pendingEmployees);
        return "approvals";
    }

    @PostMapping("/approveEmployee")
    public String approveEmployee(@RequestParam("empId") int empId, HttpSession session) {
        Employee loggedInHr = (Employee) session.getAttribute("loggedInEmployee");
        if (loggedInHr == null) return "redirect:/login";

        Employee emp = employeeRepo.findById(empId).orElse(null);
        if (emp != null && loggedInHr.getDeptCode().equalsIgnoreCase(emp.getDeptCode())) {
            emp.setApprovalStatus("APPROVED");
            employeeRepo.save(emp);
        }

        return "redirect:/hr/approvals";
    }

    @PostMapping("/declineEmployee")
    public String declineEmployee(@RequestParam("empId") int empId, HttpSession session) {
        Employee loggedInHr = (Employee) session.getAttribute("loggedInEmployee");
        if (loggedInHr == null) return "redirect:/login";

        Employee emp = employeeRepo.findById(empId).orElse(null);
        if (emp != null && loggedInHr.getDeptCode().equalsIgnoreCase(emp.getDeptCode())) {
            emp.setApprovalStatus("DECLINED");
            employeeRepo.save(emp);
        }

        return "redirect:/hr/approvals";
    }
}
