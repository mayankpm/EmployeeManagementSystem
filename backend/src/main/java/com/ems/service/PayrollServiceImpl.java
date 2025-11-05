package com.ems.service;

import com.ems.model.Employee;
import com.ems.model.Payroll;
import com.ems.model.Salary;
import com.ems.repo.EmployeeRepository;
import com.ems.repo.PayrollRepository;
import com.ems.repo.SalaryRepository;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayrollServiceImpl implements PayrollService {

    private static final BigDecimal DEFAULT_ALLOWANCE_RATE = new BigDecimal("0.10");
    private static final BigDecimal DEFAULT_INCENTIVE_RATE = new BigDecimal("0.05");
    private static final BigDecimal DEFAULT_TAX_RATE = new BigDecimal("0.15");

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final SalaryRepository salaryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Payroll> getPayrollDetails() {
        return enrichPayrolls(payrollRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payroll> getPayrollsForEmployee(int empId) {
        return enrichPayrolls(payrollRepository.findByEmpId(empId));
    }

    @Override
    @Transactional
    public void updatePayroll(Payroll payroll) {
        Employee employee = employeeRepository.findById(payroll.getEmpId())
            .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + payroll.getEmpId()));
        if (payroll.getDeptCode() == null || payroll.getDeptCode().isBlank()) {
            payroll.setDeptCode(employee.getDeptCode());
        }
        payrollRepository.save(payroll);
    }

    @Override
    @Transactional
    public void generatePayroll(int empId) {
        Employee employee = employeeRepository.findById(empId)
            .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + empId));

        // Prefer lookup by empId rather than assuming payroll PK == empId
        List<Payroll> existing = payrollRepository.findByEmpId(empId);
        Payroll payroll = existing.isEmpty() ? new Payroll() : existing.get(0);

        payroll.setEmpId(empId);
        payroll.setDeptCode(employee.getDeptCode());
        populateFromSalaryTemplate(payroll, employee);
        payrollRepository.save(payroll);
    }

    @Override
    public byte[] generateSalarySlipPDF(int empId) throws IOException {
        // Again, do not assume payroll PK == empId
        List<Payroll> list = payrollRepository.findByEmpId(empId);
        if (list.isEmpty()) {
            throw new IllegalArgumentException("Payroll not found: " + empId);
        }
        Payroll payroll = list.get(0);

        Employee employee = employeeRepository.findById(payroll.getEmpId())
            .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + payroll.getEmpId()));

        BigDecimal baseSalary = Optional.ofNullable(employee.getSalary())
            .map(Salary::getBaseSalary)
            .orElse(BigDecimal.ZERO);

        BigDecimal netSalary = calculateNetSalary(baseSalary, payroll);
        LocalDate generatedDate = LocalDate.now();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph header = new Paragraph("Salary Slip", headerFont);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);
            document.add(Chunk.NEWLINE);

            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingBefore(10f);
            addInfoRow(infoTable, "Employee ID", String.valueOf(employee.getEmpId()));
            addInfoRow(infoTable, "Name", buildFullName(employee));
            addInfoRow(infoTable, "Department", nullSafe(employee.getDeptCode()));
            addInfoRow(infoTable, "Generated Date", generatedDate.toString());
            document.add(infoTable);

            document.add(Chunk.NEWLINE);

            PdfPTable salaryTable = new PdfPTable(2);
            salaryTable.setWidthPercentage(100);
            salaryTable.setSpacingBefore(10f);
            addMoneyRow(salaryTable, "Base Salary", baseSalary);
            addMoneyRow(salaryTable, "Allowances", payroll.getAllowances());
            addMoneyRow(salaryTable, "Incentive", payroll.getIncentive());
            addMoneyRow(salaryTable, "Tax", payroll.getTax());
            addMoneyRow(salaryTable, "Net Salary (CTC)", netSalary);
            document.add(salaryTable);

            document.close();
            return baos.toByteArray();
        } catch (DocumentException e) {
            throw new IllegalStateException("Failed to generate salary slip PDF", e);
        }
    }

    // Internal helpers (same as your current class)
    private List<Payroll> enrichPayrolls(List<Payroll> payrolls) {
        if (payrolls.isEmpty()) return payrolls;

        Set<Integer> empIds = payrolls.stream()
            .map(Payroll::getEmpId)
            .collect(Collectors.toSet());

        Map<Integer, Employee> employeeMap = employeeRepository.findAllById(empIds).stream()
            .collect(Collectors.toMap(Employee::getEmpId, e -> e));

        payrolls.forEach(payroll -> {
            Employee e = employeeMap.get(payroll.getEmpId());
            if (e != null) payroll.setDeptCode(e.getDeptCode());
        });

        return payrolls.stream()
            .sorted(Comparator.comparing(Payroll::getEmpId))
            .collect(Collectors.toList());
    }

    private void populateFromSalaryTemplate(Payroll payroll, Employee employee) {
        String roleCode = employee.getRoleCode();
        BigDecimal baseSalary = salaryRepository.findByRoleCode(roleCode == null ? null : roleCode.trim())
            .map(Salary::getBaseSalary)
            .orElse(BigDecimal.ZERO);

        BigDecimal allowances = applyPercentage(baseSalary, DEFAULT_ALLOWANCE_RATE);
        BigDecimal incentive = applyPercentage(baseSalary, DEFAULT_INCENTIVE_RATE);
        BigDecimal tax = applyPercentage(baseSalary, DEFAULT_TAX_RATE);
        BigDecimal ctc = baseSalary.add(allowances).add(incentive).subtract(tax);

        payroll.setAllowances(allowances);
        payroll.setIncentive(incentive);
        payroll.setTax(tax);
        payroll.setCtc(ctc);
    }

    private BigDecimal calculateNetSalary(BigDecimal baseSalary, Payroll payroll) {
        BigDecimal base = zeroIfNull(baseSalary);
        BigDecimal allowances = zeroIfNull(payroll.getAllowances());
        BigDecimal incentive = zeroIfNull(payroll.getIncentive());
        BigDecimal tax = zeroIfNull(payroll.getTax());
        return base.add(allowances).add(incentive).subtract(tax);
    }

    private BigDecimal applyPercentage(BigDecimal base, BigDecimal rate) {
        if (base == null || rate == null) return BigDecimal.ZERO;
        return base.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal zeroIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private void addInfoRow(PdfPTable table, String label, String value) {
        table.addCell(createCell(label, true));
        table.addCell(createCell(value, false));
    }

    private void addMoneyRow(PdfPTable table, String label, BigDecimal amount) {
        table.addCell(createCell(label, true));
        table.addCell(createCell(formatCurrency(amount), false));
    }

    private PdfPCell createCell(String text, boolean header) {
        Font font = header ? FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12)
                           : FontFactory.getFont(FontFactory.HELVETICA, 12);
        PdfPCell cell = new PdfPCell(new Phrase(Optional.ofNullable(text).orElse("-"), font));
        cell.setPadding(8f);
        if (header) cell.setBackgroundColor(Color.lightGray);
        return cell;
    }

    private String buildFullName(Employee employee) {
        String first = employee.getFirstName();
        String last = employee.getLastName();
        if (first == null && last == null) return "-";
        if (first == null) return last;
        if (last == null || last.isBlank()) return first;
        return first + " " + last;
    }

    private String formatCurrency(BigDecimal amount) {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(Locale.US);
        return formatter.format(zeroIfNull(amount));
    }

    private String nullSafe(String value) {
        return value != null ? value : "-";
    }
}
