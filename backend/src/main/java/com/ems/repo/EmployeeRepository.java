package com.ems.repo;

import com.ems.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    
    Employee findByPersonalEmail(String personalEmail);
    
    List<Employee> findByApprovalStatus(String approvalStatus);
    
    @Query("SELECT e FROM Employee e WHERE e.personalEmail = :email AND e.password = :password")
    Employee findByPersonalEmailAndPassword(@Param("email") String email, @Param("password") String password);
    
    boolean existsByPersonalEmail(String personalEmail);
}