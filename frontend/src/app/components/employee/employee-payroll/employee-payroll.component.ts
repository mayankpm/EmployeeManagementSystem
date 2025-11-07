import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollService } from '../../../services/payroll.service';
import { AuthService } from '../../../services/auth.service';
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
  employeeName: string = '';

  constructor(
    private payrollService: PayrollService,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // Aggressively check authentication before loading payroll
    const token = this.authService.getToken();
    const user = this.authService.getUser();
    
    if (!token || !user || !this.authService.isLoggedIn()) {
      sessionStorage.clear();
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }
    
    // Initialize employee name from session storage
    if (user) {
      this.employeeName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    this.loadPayroll();
  }

  loadPayroll(): void {
    // Triple-check authentication before making API call
    const token = this.authService.getToken();
    const user = this.authService.getUser();
    
    if (!token || !user || !this.authService.isLoggedIn()) {
      sessionStorage.clear();
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    this.loading = true;
    this.payrollService.getEmployeePayroll().subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Payroll response:', response);
        
        if (response.employee && response.payrolls) {
          this.payrollData = response;
          this.employeeName = `${response.employee.firstName || ''} ${response.employee.lastName || ''}`.trim();
        } else if (response.data) {
          this.payrollData = response.data;
          if (response.data.employee) {
            this.employeeName = `${response.data.employee.firstName || ''} ${response.data.employee.lastName || ''}`.trim();
          }
        } else {
          this.payrollData = response;
          if (response.employee) {
            this.employeeName = `${response.employee.firstName || ''} ${response.employee.lastName || ''}`.trim();
          }
        }

        // If employee name is still empty, try to get it from auth service
        if (!this.employeeName) {
          const user = this.authService.getUser();
          if (user) {
            this.employeeName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
          }
        }
      },
      error: (error) => {
        this.loading = false;
        // If 401 or 403, authentication failed - redirect to login
        if (error.status === 401 || error.status === 403) {
          sessionStorage.clear();
          this.router.navigate(['/login'], { replaceUrl: true });
          return;
        }
        this.errorMessage = error.error?.message || 'Error loading payroll data';
        
        // Try to get employee name from auth service even on error
        const user = this.authService.getUser();
        if (user) {
          this.employeeName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        }
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}