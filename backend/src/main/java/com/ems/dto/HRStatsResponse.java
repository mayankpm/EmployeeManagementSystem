package com.ems.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class HRStatsResponse {
    private long totalEmployees;
    private long regularCount;
    private long pendingApprovals;
    private String hrDepartment;
}