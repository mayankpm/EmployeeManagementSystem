package com.ems.service;

import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Find by workMail instead of personalEmail
        Employee employee = employeeRepository.findByWorkMail(email);
        if (employee == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        if (!"APPROVED".equalsIgnoreCase(employee.getApprovalStatus())) {
            throw new UsernameNotFoundException("User registration not approved");
        }

        String role = getRoleFromRoleCode(employee.getRoleCode());
        
        return new User(
            employee.getWorkMail(), // Use workMail as username
            employee.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority(role))
        );
    }

    private String getRoleFromRoleCode(String roleCode) {
        if (roleCode == null) return "EMPLOYEE";
        
        roleCode = roleCode.trim().toUpperCase();
        if (roleCode.startsWith("ADM")) return "ADMIN";
        if (roleCode.equals("HR")) return "HR";
        return "EMPLOYEE";
    }
}