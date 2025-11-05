package com.ems.repo;

import com.ems.model.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, String> {
    Optional<Salary> findByRoleCode(String roleCode);
}
 