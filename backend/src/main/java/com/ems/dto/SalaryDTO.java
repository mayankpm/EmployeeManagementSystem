package com.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

public class SalaryDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String roleCode;
        private BigDecimal baseSalary;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String roleCode;
        private BigDecimal baseSalary;
    }
}