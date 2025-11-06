package com.ems.impl;

import com.ems.dto.HRStatsResponse;
import com.ems.dto.HREmployeeResponse;
import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import com.ems.service.HRService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HRServiceImpl implements HRService {

    private final EmployeeRepository employeeRepo;

    @Override
    public HRStatsResponse getHRDashboardStats(String hrDepartment) {
        log.info("Getting dashboard stats for department: {}", hrDepartment);
        
        List<Employee> departmentEmployees = getDepartmentEmployees(hrDepartment);
        List<Employee> pendingEmployees = getPendingApprovals(hrDepartment);
        
        return new HRStatsResponse(
            departmentEmployees.size(),
            departmentEmployees.stream()
                .filter(e -> e.getRoleCode() != null && 
                       (e.getRoleCode().startsWith("L") || e.getRoleCode().startsWith("SDE")))
                .count(),
            pendingEmployees.size(),
            hrDepartment
        );
    }

    @Override
    public List<Employee> getDepartmentEmployees(String hrDepartment) {
        log.info("Fetching employees for department: {}", hrDepartment);
        
        List<Employee> employees = employeeRepo.findAll().stream()
                .filter(e -> hrDepartment.equalsIgnoreCase(e.getDeptCode()))
                .collect(Collectors.toList());
        
        // Initialize lazy-loaded relationships
        employees.forEach(this::initializeLazyRelationships);
        
        log.info("Found {} employees in department {}", employees.size(), hrDepartment);
        return employees;
    }

    @Override
    public List<Employee> getPendingApprovals(String hrDepartment) {
        log.info("Fetching pending approvals for department: {}", hrDepartment);
        
        List<Employee> pendingEmployees = employeeRepo.findByApprovalStatus("UNDEFINED").stream()
                .filter(e -> hrDepartment.equalsIgnoreCase(e.getDeptCode()))
                .collect(Collectors.toList());
        
        // Initialize lazy-loaded relationships
        pendingEmployees.forEach(this::initializeLazyRelationships);
        
        return pendingEmployees;
    }

    @Override
    public HREmployeeResponse approveEmployee(int empId, String hrDepartment) {
        log.info("Approving employee ID: {} for department: {}", empId, hrDepartment);
        
        return employeeRepo.findById(empId)
                .filter(emp -> hrDepartment.equalsIgnoreCase(emp.getDeptCode()))
                .map(emp -> {
                    emp.setApprovalStatus("APPROVED");
                    Employee savedEmployee = employeeRepo.save(emp);
                    initializeLazyRelationships(savedEmployee);
                    return new HREmployeeResponse(savedEmployee, "Employee approved successfully", true);
                })
                .orElse(new HREmployeeResponse(null, "Employee not found or access denied", false));
    }

    @Override
    public HREmployeeResponse declineEmployee(int empId, String hrDepartment) {
        log.info("Declining employee ID: {} for department: {}", empId, hrDepartment);
        
        return employeeRepo.findById(empId)
                .filter(emp -> hrDepartment.equalsIgnoreCase(emp.getDeptCode()))
                .map(emp -> {
                    emp.setApprovalStatus("DECLINED");
                    Employee savedEmployee = employeeRepo.save(emp);
                    initializeLazyRelationships(savedEmployee);
                    return new HREmployeeResponse(savedEmployee, "Employee declined successfully", true);
                })
                .orElse(new HREmployeeResponse(null, "Employee not found or access denied", false));
    }

    @Override
    public HREmployeeResponse updateEmployee(Employee employee, String hrDepartment) {
        log.info("Updating employee ID: {} for department: {}", employee.getEmpId(), hrDepartment);
        
        return employeeRepo.findById(employee.getEmpId())
                .filter(existing -> hrDepartment.equalsIgnoreCase(existing.getDeptCode()))
                .map(existing -> {
                    updateEmployeeFields(existing, employee);
                    Employee savedEmployee = employeeRepo.save(existing);
                    initializeLazyRelationships(savedEmployee);
                    return new HREmployeeResponse(savedEmployee, "Employee updated successfully", true);
                })
                .orElse(new HREmployeeResponse(null, "Employee not found or access denied", false));
    }

    @Override
    public Employee getEmployeeDetails(int empId, String hrDepartment) {
        log.info("Fetching details for employee ID: {} in department: {}", empId, hrDepartment);
        
        return employeeRepo.findById(empId)
                .filter(emp -> hrDepartment.equalsIgnoreCase(emp.getDeptCode()))
                .map(emp -> {
                    initializeLazyRelationships(emp);
                    return emp;
                })
                .orElse(null);
    }

    // Helper methods
    private void initializeLazyRelationships(Employee employee) {
        if (employee.getSalary() != null) {
            employee.getSalary().getRoleCode(); // Trigger initialization
        }
    }

    private void updateEmployeeFields(Employee existing, Employee updates) {
        existing.setFirstName(updates.getFirstName());
        existing.setLastName(updates.getLastName());
        existing.setAge(updates.getAge());
        existing.setAddress(updates.getAddress());
        existing.setPhone(updates.getPhone());
        existing.setRoleCode(updates.getRoleCode());
    }
}