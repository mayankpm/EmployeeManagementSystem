package com.ems.dto;

import com.ems.model.Employee;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class HREmployeeResponse {
    private Employee employee;
    private String message;
    private boolean success;
}