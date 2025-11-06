package com.ems.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ems.model.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    
    // Existing methods
    Employee findByPersonalEmail(String personalEmail);
    List<Employee> findByApprovalStatus(String approvalStatus);
    
    // NEW METHODS NEEDED FOR LOGIN:
    Employee findByWorkMail(String workMail);
    
    // Method 1: Find by workMail and password
    @Query("SELECT e FROM Employee e WHERE e.workMail = :email AND e.password = :password")
    Employee findByWorkMailAndPassword(@Param("email") String email, @Param("password") String password);
    
    // Method 2: Find by personalEmail and password  
    @Query("SELECT e FROM Employee e WHERE e.personalEmail = :email AND e.password = :password")
    Employee findByPersonalEmailAndPassword(@Param("email") String email, @Param("password") String password);
    
    // Alternative approach without @Query (if field names match exactly):
    // Employee findByWorkMailAndPassword(String workMail, String password);
    // Employee findByPersonalEmailAndPassword(String personalEmail, String password);
}