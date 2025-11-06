package com.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class DepartmentDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String deptCode;
        private String deptName;
        private String assignedHR;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String deptCode;
        private String deptName;
        private String assignedHR;
    }
}