package com.ems.impl;  

import com.ems.dto.DepartmentDTO.Response;
import com.ems.model.Department;
import com.ems.repo.DepartmentRepository;
import com.ems.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    public List<Response> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Response addDepartment(String deptCode, String deptName, String assignedHR) {
        if (departmentRepository.existsById(deptCode)) {
            throw new RuntimeException("Department already exists with code: " + deptCode);
        }

        Department department = new Department(deptCode, deptName, assignedHR);
        Department savedDepartment = departmentRepository.save(department);
        return convertToResponseDTO(savedDepartment);
    }

    @Override
    public Response updateDepartment(String deptCode, String deptName, String assignedHR) {
        Department existingDepartment = departmentRepository.findById(deptCode)
                .orElseThrow(() -> new RuntimeException("Department not found with code: " + deptCode));

        existingDepartment.setDeptName(deptName);
        existingDepartment.setAssignedHR(assignedHR);

        Department updatedDepartment = departmentRepository.save(existingDepartment);
        return convertToResponseDTO(updatedDepartment);
    }

    @Override
    public void deleteDepartment(String deptCode) {
        if (!departmentRepository.existsById(deptCode)) {
            throw new RuntimeException("Department not found with code: " + deptCode);
        }
        departmentRepository.deleteById(deptCode);
    }

    private Response convertToResponseDTO(Department department) {
        return new Response(
                department.getDeptCode(),
                department.getDeptName(),
                department.getAssignedHR()
        );
    }
}