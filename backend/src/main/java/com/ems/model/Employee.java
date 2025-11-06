package com.ems.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Entity
@Table(name = "employee")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RoleCode", referencedColumnName = "RoleCode", insertable = false, updatable = false)
    @JsonIgnore
    private Salary salary;

    @Column(name = "approval_status")
    private String approvalStatus = "UNDEFINED";
}