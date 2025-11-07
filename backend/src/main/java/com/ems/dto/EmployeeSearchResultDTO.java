package com.ems.dto;

public class EmployeeSearchResultDTO {
    private String name;
    private String department;
    private String workEmail;
    private String phone;

    // Constructors
    public EmployeeSearchResultDTO() {}

    public EmployeeSearchResultDTO(String name, String department, String workEmail, String phone) {
        this.name = name;
        this.department = department;
        this.workEmail = workEmail;
        this.phone = phone;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getWorkEmail() {
        return workEmail;
    }

    public void setWorkEmail(String workEmail) {
        this.workEmail = workEmail;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}