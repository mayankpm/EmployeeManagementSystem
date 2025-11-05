package com.ems.service;

import com.ems.model.Employee;
import com.ems.repo.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public List<Employee> getEmployeeDetails() {
        return employeeRepository.findAll();
    }

    @Override
    public Optional<Employee> getEmployee(int empId) {
        return employeeRepository.findById(empId);
    }

    @Override
    public void updateEmployee(Employee employee) {
        employeeRepository.save(employee);
    }

    @Override
    public void assignEmployeeRole(int empId, String roleCode) {
        Employee emp = employeeRepository.findById(empId)
            .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        emp.setRoleCode(roleCode);
        employeeRepository.save(emp);
    }

    @Override
    public void assignEmpDept(int empId, String deptCode) {
        Employee emp = employeeRepository.findById(empId)
            .orElseThrow(() -> new IllegalArgumentException("Employee not found"));
        emp.setDeptCode(deptCode);
        employeeRepository.save(emp);
    }
}
