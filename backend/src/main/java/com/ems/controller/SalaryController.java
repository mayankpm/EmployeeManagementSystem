package com.ems.controller;

import com.ems.model.Salary;
import com.ems.repo.SalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping("/roles")
public class SalaryController {

    @Autowired
    private SalaryRepository salaryRepo;

    @GetMapping
    public String viewRoles(Model model) {
        List<Salary> roles = salaryRepo.findAll();
        model.addAttribute("roles", roles);
        return "manage-roles"; 
    }

    @PostMapping("/add")
    public String addSalary(@RequestParam String roleCode, @RequestParam Double baseSalary) {
        Salary s = new Salary(roleCode, BigDecimal.valueOf(baseSalary));
        salaryRepo.save(s);
        return "redirect:/roles";
    }

    @PostMapping("/update")
    public String updateSalary(@RequestParam String roleCode, @RequestParam Double baseSalary) {
        System.out.println(">>> Updating salary for Role: " + roleCode + " | New Salary: " + baseSalary);

        Salary s = salaryRepo.findById(roleCode).orElse(null);
        if (s != null) {
            s.setBaseSalary(BigDecimal.valueOf(baseSalary));
            salaryRepo.save(s);
            System.out.println(">>> Salary updated successfully!");
        } else {
            System.out.println(">>> Role not found!");
        }

        return "redirect:/roles";
    }

    @GetMapping("/delete/{roleCode}")
    public String deleteSalary(@PathVariable String roleCode) {
        salaryRepo.deleteById(roleCode);
        return "redirect:/roles";
    }
}
