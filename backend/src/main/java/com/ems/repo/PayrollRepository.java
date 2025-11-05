package com.ems.repo;

import com.ems.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PayrollRepository extends JpaRepository<Payroll, Integer> {
    List<Payroll> findByEmpId(int empId);
}

 