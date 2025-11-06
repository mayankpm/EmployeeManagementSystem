package com.ems.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ems.dto.AuthResponse;
import com.ems.dto.LoginRequest;
import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import com.ems.service.AuthService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    @Autowired
    private EmployeeRepository employeeRepo;

    @Override
    public AuthResponse registerEmployee(Employee employee) {
        AuthResponse response = new AuthResponse();
        
        System.out.println("=== REGISTRATION ATTEMPT ===");
        System.out.println("Email: " + employee.getPersonalEmail());
        
        // Check if email already exists
        Employee existingEmployee = employeeRepo.findByPersonalEmail(employee.getPersonalEmail());
        if (existingEmployee != null) {
            System.out.println("❌ Email already exists: " + employee.getPersonalEmail());
            response.setMessage("Email already registered!");
            return response;
        }

        // Set defaults
        if (employee.getRoleCode() == null || employee.getRoleCode().isEmpty()) {
            employee.setRoleCode("L1");
        }
        if (employee.getDeptCode() == null || employee.getDeptCode().isEmpty()) {
            employee.setDeptCode("HR");
        }

        employee.setApprovalStatus("UNDEFINED");
        Employee savedEmployee = employeeRepo.save(employee);

        System.out.println("✅ Registration successful for: " + savedEmployee.getFirstName() + " " + savedEmployee.getLastName());
        System.out.println("   ID: " + savedEmployee.getEmpId());
        System.out.println("   Email: " + savedEmployee.getPersonalEmail());

        response.setMessage("Registration successful! Waiting for HR approval.");
        response.setUserId(String.valueOf(savedEmployee.getEmpId()));
        return response;
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        AuthResponse response = new AuthResponse();
        
        System.out.println("=== LOGIN ATTEMPT DEBUG ===");
        System.out.println("Email provided: '" + loginRequest.getPersonalEmail() + "'");
        System.out.println("Password provided: '" + loginRequest.getPassword() + "'");
        
        // DEBUG: List ALL employees to see what's actually in the database
        System.out.println("=== ALL EMPLOYEES IN DATABASE ===");
        List<Employee> allEmployees = employeeRepo.findAll();
        for (Employee e : allEmployees) {
            System.out.println("ID: " + e.getEmpId() + 
                             " | Email: '" + e.getPersonalEmail() + 
                             "' | Name: " + e.getFirstName() + " " + e.getLastName() +
                             " | Approval: " + e.getApprovalStatus() +
                             " | Password: '" + e.getPassword() + "'");
        }
        System.out.println("=== END EMPLOYEE LIST ===");
        
        Employee emp = null;
        
        // Method 1: Standard repository method
        System.out.println("=== METHOD 1: Standard repository method ===");
        emp = employeeRepo.findByPersonalEmail(loginRequest.getPersonalEmail());
        if (emp != null) {
            System.out.println("✅ Repository method found employee: " + emp.getFirstName() + " " + emp.getLastName());
        } else {
            System.out.println("❌ Repository method returned null");
        }
        
        // Method 2: Manual case-insensitive search (if first method fails)
        if (emp == null) {
            System.out.println("=== METHOD 2: Manual case-insensitive search ===");
            for (Employee e : allEmployees) {
                if (e.getPersonalEmail() != null && 
                    e.getPersonalEmail().equalsIgnoreCase(loginRequest.getPersonalEmail())) {
                    emp = e;
                    System.out.println("✅ Manual search found: " + e.getFirstName() + " " + e.getLastName());
                    System.out.println("   Actual email in DB: '" + e.getPersonalEmail() + "'");
                    break;
                }
            }
            if (emp == null) {
                System.out.println("❌ Manual search also failed");
            }
        }

        if (emp == null) {
            System.out.println("❌ No employee found with email (any method): '" + loginRequest.getPersonalEmail() + "'");
            response.setMessage("Invalid email or password!");
            return response;
        }

        // DEBUG: Print employee details
        System.out.println("✅ Employee verification passed:");
        System.out.println("   ID: " + emp.getEmpId());
        System.out.println("   Name: " + emp.getFirstName() + " " + emp.getLastName());
        System.out.println("   Email in DB: '" + emp.getPersonalEmail() + "'");
        System.out.println("   Stored Password: '" + emp.getPassword() + "'");
        System.out.println("   Approval Status: " + emp.getApprovalStatus());
        System.out.println("   Role: " + emp.getRoleCode());
        System.out.println("   Department: " + emp.getDeptCode());

        if (!"APPROVED".equalsIgnoreCase(emp.getApprovalStatus())) {
            System.out.println("❌ Approval status issue: " + emp.getApprovalStatus());
            if ("DECLINED".equalsIgnoreCase(emp.getApprovalStatus())) {
                response.setMessage("Your registration was declined by HR.");
            } else {
                response.setMessage("Your registration is pending HR approval. Please wait for confirmation.");
            }
            return response;
        }

        // Password check
        boolean passwordMatches = emp.getPassword() != null && emp.getPassword().equals(loginRequest.getPassword());
        System.out.println("🔐 Password check:");
        System.out.println("   Stored: '" + emp.getPassword() + "'");
        System.out.println("   Provided: '" + loginRequest.getPassword() + "'");
        System.out.println("   Match: " + passwordMatches);
        
        // Debug password comparison
        if (emp.getPassword() != null && loginRequest.getPassword() != null) {
            String stored = emp.getPassword();
            String provided = loginRequest.getPassword();
            System.out.println("   Stored length: " + stored.length());
            System.out.println("   Provided length: " + provided.length());
            System.out.println("   Stored hash: " + stored.hashCode());
            System.out.println("   Provided hash: " + provided.hashCode());
        }

        if (passwordMatches) {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("empId", emp.getEmpId());
            userInfo.put("firstName", emp.getFirstName());
            userInfo.put("lastName", emp.getLastName());
            userInfo.put("personalEmail", emp.getPersonalEmail());
            userInfo.put("roleCode", emp.getRoleCode());
            userInfo.put("deptCode", emp.getDeptCode());
            userInfo.put("approvalStatus", emp.getApprovalStatus());

            response.setMessage("Login successful!");
            response.setUser(userInfo);
            response.setToken("mock-jwt-token-" + emp.getEmpId());
            
            System.out.println("🎉 LOGIN SUCCESSFUL for: " + emp.getFirstName() + " " + emp.getLastName());
            return response;
        } else {
            System.out.println("❌ Password mismatch");
            response.setMessage("Invalid email or password!");
            return response;
        }
    }
}