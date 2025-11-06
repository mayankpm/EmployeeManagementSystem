package com.ems.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EmpId")
    private int empId;

    @Column(name = "FirstName", length = 50)
    private String firstName;

    @Column(name = "LastName", length = 50)
    private String lastName;

    @Column(name = "Age")
    private Integer age;

    @Column(name = "Address", length = 200)
    private String address;

    @Column(name = "PersonalEmail", length = 100)
    private String personalEmail;

    @Column(name = "Phone", length = 15)
    private String phone;

    @Column(name = "WorkMail", length = 100)
    private String workMail;

    @Column(name = "Password", length = 255)
    private String password;

    @Column(name = "RoleCode", length = 20)
    private String roleCode;

    @Column(name = "DeptCode", length = 10)
    private String deptCode;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RoleCode", referencedColumnName = "RoleCode", insertable = false, updatable = false)
    private Salary salary;

    @Column(name = "approval_status")
    private String approvalStatus = "UNDEFINED";

    // --- Getters & Setters ---
    public int getEmpId() { return empId; }
    public void setEmpId(int empId) { this.empId = empId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPersonalEmail() { return personalEmail; }
    public void setPersonalEmail(String personalEmail) { this.personalEmail = personalEmail; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWorkMail() { return workMail; }
    public void setWorkMail(String workMail) { this.workMail = workMail; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRoleCode() { return roleCode; }
    public void setRoleCode(String roleCode) { this.roleCode = roleCode; }

    public String getDeptCode() { return deptCode; }
    public void setDeptCode(String deptCode) { this.deptCode = deptCode; }

    public Salary getSalary() { return salary; }
    public void setSalary(Salary salary) { this.salary = salary; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
}
