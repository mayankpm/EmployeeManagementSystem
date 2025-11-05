package com.ems.controller;

import com.ems.model.Employee;
import com.ems.model.Payroll;
import com.ems.repo.EmployeeRepository;
import com.ems.service.EmployeeService;
import com.ems.service.PayrollService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;
    private final EmployeeService employeeService;

    @Autowired
    private EmployeeRepository employeeRepo;

    // ------------------- HR: VIEW ALL PAYROLLS -------------------
    @GetMapping("/hr/payroll")
    public String viewAllPayrolls(HttpSession session, Model model) {
        Employee loggedInHr = (Employee) session.getAttribute("loggedInEmployee");
        if (loggedInHr == null) return "redirect:/login";

        String hrDept = loggedInHr.getDeptCode();

        // ✅ Only employees from HR’s department
        List<Employee> deptEmployees = employeeService.getEmployeeDetails().stream()
                .filter(e -> hrDept.equalsIgnoreCase(e.getDeptCode()))
                .toList();

        // ✅ Only payrolls for those employees
        List<Payroll> payrolls = payrollService.getPayrollDetails().stream()
                .filter(p -> deptEmployees.stream().anyMatch(e -> e.getEmpId() == p.getEmpId()))
                .toList();

        model.addAttribute("employees", deptEmployees);
        model.addAttribute("payrolls", payrolls);
        model.addAttribute("hrDepartment", hrDept);

        return "hr-payroll";
    }

    // ------------------- HR: GENERATE PAYROLL -------------------
    @PostMapping("/hr/payroll/generate")
    public String generatePayroll(@RequestParam("empId") int empId, HttpSession session) {
        Employee loggedInHr = (Employee) session.getAttribute("loggedInEmployee");
        if (loggedInHr == null) return "redirect:/login";

        Employee employee = employeeRepo.findById(empId).orElse(null);
        if (employee == null || !loggedInHr.getDeptCode().equalsIgnoreCase(employee.getDeptCode())) {
            return "redirect:/hr/payroll";
        }

        payrollService.generatePayroll(empId);
        return "redirect:/hr/payroll?generated";
    }

    // ------------------- HR: DOWNLOAD SALARY SLIP -------------------
    @GetMapping("/hr/payroll/pdf/{empId}")
    public ResponseEntity<byte[]> downloadSalarySlipHR(@PathVariable int empId, HttpSession session) throws IOException {
        Employee loggedInHr = (Employee) session.getAttribute("loggedInEmployee");
        if (loggedInHr == null) return ResponseEntity.status(403).build();

        Employee employee = employeeRepo.findById(empId).orElse(null);
        if (employee == null || !loggedInHr.getDeptCode().equalsIgnoreCase(employee.getDeptCode())) {
            return ResponseEntity.status(403).build();
        }

        byte[] pdfBytes = payrollService.generateSalarySlipPDF(empId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=salary-slip-" + empId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // ------------------- HR: VIEW SPECIFIC EMPLOYEE PAYROLL -------------------
    @GetMapping("/hr/employee/payroll")
    public String viewEmployeePayroll(@RequestParam("empId") int empId,
                                      HttpSession session,
                                      Model model) {
        Employee loggedInHr = (Employee) session.getAttribute("loggedInEmployee");
        if (loggedInHr == null) return "redirect:/login";

        Employee employee = employeeRepo.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + empId));

        // ✅ Security: HR can only view payrolls of employees in same dept
        if (!loggedInHr.getDeptCode().equalsIgnoreCase(employee.getDeptCode())) {
            return "redirect:/hr/dashboard";
        }

        List<Payroll> payrolls = payrollService.getPayrollsForEmployee(empId);
        model.addAttribute("employee", employee);
        model.addAttribute("payrolls", payrolls);
        return "employee-payrollhr";
    }

    // ------------------- EMPLOYEE: VIEW OWN PAYROLL -------------------
    @GetMapping("/employee/payroll")
    public String viewEmployeePayroll(@RequestParam("empId") int empId, Model model) {
        Employee employee = employeeService.getEmployee(empId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + empId));
        List<Payroll> payrolls = payrollService.getPayrollsForEmployee(empId);

        model.addAttribute("employee", employee);
        model.addAttribute("payrolls", payrolls);
        return "employee-payroll";
    }

    @GetMapping("/employee/payroll/pdf/{empId}")
    public ResponseEntity<byte[]> downloadSalarySlipEmployee(@PathVariable int empId) throws IOException {
        byte[] pdfBytes = payrollService.generateSalarySlipPDF(empId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=my-salary-slip-" + empId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
