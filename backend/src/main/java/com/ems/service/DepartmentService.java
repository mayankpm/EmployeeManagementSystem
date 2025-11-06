package com.ems.service;

import com.ems.dto.DepartmentDTO;
import java.util.List;

public interface DepartmentService {
    List<DepartmentDTO.Response> getAllDepartments();
    DepartmentDTO.Response addDepartment(String deptCode, String deptName, String assignedHR);
    DepartmentDTO.Response updateDepartment(String deptCode, String deptName, String assignedHR);
    void deleteDepartment(String deptCode);
}