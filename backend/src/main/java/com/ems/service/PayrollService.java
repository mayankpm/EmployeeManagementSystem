package com.ems.service;

import com.ems.model.Payroll;

import java.io.IOException;
import java.util.List;

public interface PayrollService {
    List<Payroll> getPayrollDetails();
    List<Payroll> getPayrollsForEmployee(int empId);
    void updatePayroll(Payroll payroll);
    void generatePayroll(int empId);
    byte[] generateSalarySlipPDF(int empId) throws IOException;
}
