import { Component, OnInit } from '@angular/core';
import { PayrollService } from '../../../services/payroll.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-payroll',
  standalone: false,
  templateUrl: './employee-payroll.component.html',
  styleUrls: ['./employee-payroll.component.css']
})
export class EmployeePayrollComponent implements OnInit {
  payrollData: any = null;
  loading = false;
  errorMessage = '';
  today: Date = new Date();

  constructor(private payrollService: PayrollService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadPayroll();
  }

  loadPayroll(): void {
    this.loading = true;
    this.payrollService.getEmployeePayroll().subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Payroll response:', response);
        
        if (response.employee && response.payrolls) {
          this.payrollData = response;
        } else if (response.data) {
          this.payrollData = response.data;
        } else {
          this.payrollData = response;
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error loading payroll data';
      }
    });
  }

  downloadSalarySlip(): void {
    this.loading = true;
    this.payrollService.downloadSalarySlip().subscribe({
      next: (blob: Blob) => {
        this.loading = false;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'salary-slip.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error downloading salary slip';
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  }
}