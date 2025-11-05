package com.ems.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ems.model.Department;

public interface DepartemntRepo extends JpaRepository<Department, String> {
}