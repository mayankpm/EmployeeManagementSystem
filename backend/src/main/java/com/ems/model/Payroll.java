package com.ems.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Optional;

@Entity
@Table(name = "payroll")
public class Payroll {

    @Id
    @Column(name = "EmpId")
    private int empId;

    @Column(name = "DeptCode", length = 10)
    private String deptCode;

    @Column(name = "Tax", precision = 10, scale = 2)
    private BigDecimal tax;

    @Column(name = "Allowances", precision = 10, scale = 2)
    private BigDecimal allowances;

    @Column(name = "Incentive", precision = 10, scale = 2)
    private BigDecimal incentive;

    @Column(name = "CTC", precision = 10, scale = 2)
    private BigDecimal ctc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EmpId", referencedColumnName = "EmpId", insertable = false, updatable = false)
    private Employee employee;

    // --- Getters & Setters ---
    public int getEmpId() { return empId; }
    public void setEmpId(int empId) { this.empId = empId; }

    public String getDeptCode() { return deptCode; }
    public void setDeptCode(String deptCode) { this.deptCode = deptCode; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public BigDecimal getAllowances() { return allowances; }
    public void setAllowances(BigDecimal allowances) { this.allowances = allowances; }

    public BigDecimal getIncentive() { return incentive; }
    public void setIncentive(BigDecimal incentive) { this.incentive = incentive; }

    public BigDecimal getCtc() { return ctc; }
    public void setCtc(BigDecimal ctc) { this.ctc = ctc; }

    @Transient
    public BigDecimal getBaseSalary() {
        if (employee != null && employee.getSalary() != null) {
            return employee.getSalary().getBaseSalary();
        }
        return BigDecimal.ZERO;
    }

    @Transient
    public BigDecimal getBaseSalaryFromRole() {
        return Optional.ofNullable(employee)
                .map(Employee::getSalary)
                .map(Salary::getBaseSalary)
                .orElse(BigDecimal.ZERO);
    }

    @Transient
    public BigDecimal getComputedCtc() {
        BigDecimal base = getBaseSalaryFromRole();
        BigDecimal a = allowances != null ? allowances : BigDecimal.ZERO;
        BigDecimal i = incentive  != null ? incentive  : BigDecimal.ZERO;
        BigDecimal t = tax        != null ? tax        : BigDecimal.ZERO;
        return base.add(a).add(i).subtract(t);
    }


    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    
    
}

 