package com.ems.impl;

import com.ems.dto.SalaryDTO.Response;
import com.ems.model.Salary;
import com.ems.repo.SalaryRepository;
import com.ems.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryServiceImpl implements SalaryService {

    private final SalaryRepository salaryRepository;

    @Override
    public List<Response> getAllRoles() {
        return salaryRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Response addRole(String roleCode, Double baseSalary) {
        if (salaryRepository.existsById(roleCode)) {
            throw new RuntimeException("Role already exists with code: " + roleCode);
        }

        Salary salary = new Salary(roleCode, BigDecimal.valueOf(baseSalary));
        Salary savedSalary = salaryRepository.save(salary);
        return convertToResponseDTO(savedSalary);
    }

    @Override
    public Response updateRole(String roleCode, Double baseSalary) {
        Salary existingSalary = salaryRepository.findById(roleCode)
                .orElseThrow(() -> new RuntimeException("Role not found with code: " + roleCode));

        existingSalary.setBaseSalary(BigDecimal.valueOf(baseSalary));
        Salary updatedSalary = salaryRepository.save(existingSalary);
        return convertToResponseDTO(updatedSalary);
    }

    @Override
    public void deleteRole(String roleCode) {
        if (!salaryRepository.existsById(roleCode)) {
            throw new RuntimeException("Role not found with code: " + roleCode);
        }
        salaryRepository.deleteById(roleCode);
    }

    private Response convertToResponseDTO(Salary salary) {
        return new Response(salary.getRoleCode(), salary.getBaseSalary());
    }
}