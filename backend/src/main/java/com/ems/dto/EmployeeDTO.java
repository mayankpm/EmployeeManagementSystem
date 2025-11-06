package com.ems.dto;

public class EmployeeDTO {
    private int empId;
    private String firstName;
    private String lastName;
    private Integer age;
    private String address;
    private String personalEmail;
    private String phone;
    private String workMail;
    private String roleCode;
    private String deptCode;
    private String approvalStatus;

    // Constructors
    public EmployeeDTO() {}

    public EmployeeDTO(int empId, String firstName, String lastName, Integer age, 
                      String address, String personalEmail, String phone, String workMail, 
                      String roleCode, String deptCode, String approvalStatus) {
        this.empId = empId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.address = address;
        this.personalEmail = personalEmail;
        this.phone = phone;
        this.workMail = workMail;
        this.roleCode = roleCode;
        this.deptCode = deptCode;
        this.approvalStatus = approvalStatus;
    }

    // Getters and Setters
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

    public String getRoleCode() { return roleCode; }
    public void setRoleCode(String roleCode) { this.roleCode = roleCode; }

    public String getDeptCode() { return deptCode; }
    public void setDeptCode(String deptCode) { this.deptCode = deptCode; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
}