package com.ems.service;

import com.ems.dto.SalaryDTO.Response;
import java.util.List;

public interface SalaryService {
    List<Response> getAllRoles();
    Response addRole(String roleCode, Double baseSalary);
    Response updateRole(String roleCode, Double baseSalary);
    void deleteRole(String roleCode);
}