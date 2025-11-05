package com.ems.controller;

import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import com.ems.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class EmailController {

    @Autowired
    private EmailService emailService;
    private EmployeeRepository employeeRepo;
    
    @Autowired
    public EmailController(EmailService emailService, EmployeeRepository employeeRepo) {
        this.emailService = emailService;
        this.employeeRepo = employeeRepo;
    }

    @GetMapping("/email")
    public String showEmailForm() {
        return "email-form";
    }

    @PostMapping("/hr/sendCredentials/{empId}")
    public String sendEmployeeCredentials(@PathVariable Integer empId) {
        Employee employee = employeeRepo.findById(empId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        
        employee.setApprovalStatus("APPROVED");
        employeeRepo.save(employee);
        emailService.generateAndSendCredentials(employee);
        return "redirect:/hr/dashboard";
    }

}
 