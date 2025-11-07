import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HrService } from '../../../services/hr.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-hr-dashboard',
  standalone: false,
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent implements OnInit {
  loading = false;
  errorMessage = '';
  data: any = null;
  employeeSearch = '';
  empPage = 1;
  empPageSize = 6;
  activeTab: 'employees' | 'payroll' | 'approvals' = 'employees';
  showSidebar = true;
  editOpen = false;
  editLoading = false;
  editTarget: any = null;
  viewDetailsOpen = false;
  viewDetailsEmployee: any = null;
  editModel: any = { firstName: '', lastName: '', phone: '', age: '', address: '', roleCode: '', personalEmail: '' };
  editForm: FormGroup;
  roleOptions: string[] = [];

  payrollOpen = false;
  payrollLoading = false;
  payrollTarget: any = null;
  payrollData: any = null;
  payrollListLoading = false;
  payrollRows: Array<{ empId: number; name: string; net: number; generatedDate: string }>|null = null;
  
  editPayOpen = false;
  editPayLoading = false;
  editPaySaving = false;
  editPayTarget: any = null;
  editPayModel: any = { empId: null, tax: 0, allowances: 0, incentive: 0, ctc: 0 };
  approvalsLoading = false;
  approvals: any[] | null = null;
  approvalsPage = 1;
  approvalsPageSize = 8;
  approveLoading = new Set<number>(); // Track loading state for approve actions
  approveSuccess = new Set<number>(); // Track success animation state for approve actions
  approveAnimationPhase = new Map<number, 'processing' | 'filling' | 'centered' | 'checkmark'>(); // Track animation phases
  declineLoading = new Set<number>(); // Track loading state for decline actions
  approvalMessages: { [key: number]: { type: 'success' | 'error', message: string } } = {}; // Track messages for individual approvals
  payrollPage = 1;
  payrollPageSize = 8;

  constructor(
    private hrService: HrService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    // Initialize edit form with validation
    this.editForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required, this.phoneValidator]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      address: ['', [Validators.required]],
      roleCode: ['', [Validators.required]],
      personalEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Check authentication before loading dashboard
    this.checkAuthAndLoad();
  }

  private checkAuthAndLoad(): void {
    // Aggressively check authentication
    const token = this.authService.getToken();
    const user = this.authService.getUser();
    
    if (!token || !user || !this.authService.isLoggedIn()) {
      sessionStorage.clear();
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }
    this.fetchDashboard();
  }

  fetchDashboard(): void {
    // Triple-check authentication before making API call
    const token = this.authService.getToken();
    const user = this.authService.getUser();
    
    if (!token || !user || !this.authService.isLoggedIn()) {
      sessionStorage.clear();
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.hrService.getDashboard().subscribe({
      next: (res) => {
        this.loading = false;
        this.data = res;
        const roles = new Set<string>();
        (res?.employees || []).forEach((e: any) => {
          if (e?.roleCode) roles.add(String(e.roleCode));
        });
        this.roleOptions = Array.from(roles).sort();
      },
      error: (err) => {
        this.loading = false;
        // If 401 or 403, authentication failed - redirect to login
        if (err.status === 401 || err.status === 403) {
          sessionStorage.clear();
          this.router.navigate(['/login'], { replaceUrl: true });
          return;
        }
        this.errorMessage = err.error?.message || 'Failed to load HR dashboard';
      }
    });
  }

  getInitials(e: any): string {
    const first = (e?.firstName || '').trim();
    const last = (e?.lastName || '').trim();
    const a = first ? first.charAt(0) : '';
    const b = last ? last.charAt(0) : '';
    return (a + b).toUpperCase() || 'NA';
  }

  get filteredDeptEmployees(): any[] {
    const list = this.data?.employees || [];
    const q = (this.employeeSearch || '').toString().trim().toLowerCase();
    if (!q) return list;
    return list.filter((e: any) => {
      const name = `${e.firstName || ''} ${e.lastName || ''}`.toLowerCase();
      const email = (e.workMail || e.personalEmail || '').toLowerCase();
      const role = (e.roleCode || '').toLowerCase();
      const id = String(e.empId || '').toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q) || id.includes(q);
    });
  }

  private paginate<T>(arr: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize;
    return arr.slice(start, start + pageSize);
  }

  get pagedApprovals(): any[] {
    const list = this.approvals || [];
    return this.paginate(list, this.approvalsPage, this.approvalsPageSize);
  }

  get approvalsTotalPages(): number {
    const total = (this.approvals || []).length;
    return Math.max(1, Math.ceil(total / this.approvalsPageSize));
  }

  get pagedPayrollRows(): any[] {
    const list = this.payrollRows || [];
    return this.paginate(list, this.payrollPage, this.payrollPageSize);
  }

  get payrollTotalPages(): number {
    const total = (this.payrollRows || []).length;
    return Math.max(1, Math.ceil(total / this.payrollPageSize));
  }

  get pagedDeptEmployees(): any[] {
    return this.paginate(this.filteredDeptEmployees, this.empPage, this.empPageSize);
  }

  get empTotalPages(): number {
    const total = this.filteredDeptEmployees.length || 0;
    return Math.max(1, Math.ceil(total / this.empPageSize));
  }

  // Helper methods for approval actions
  isApproveLoading(empId: number): boolean {
    return this.approveLoading.has(empId);
  }

  isApproveSuccess(empId: number): boolean {
    return this.approveSuccess.has(empId);
  }

  getApproveAnimationPhase(empId: number): 'processing' | 'filling' | 'centered' | 'checkmark' | null {
    return this.approveAnimationPhase.get(empId) || null;
  }

  isDeclineLoading(empId: number): boolean {
    return this.declineLoading.has(empId);
  }

  isAnyApprovalLoading(empId: number): boolean {
    return this.isApproveLoading(empId) || this.isDeclineLoading(empId) || this.isApproveSuccess(empId);
  }

  getApprovalMessage(empId: number): { type: 'success' | 'error', message: string } | null {
    return this.approvalMessages[empId] || null;
  }

  setTab(tab: 'employees' | 'payroll' | 'approvals'): void {
    this.activeTab = tab;
    if (tab === 'payroll' && !this.payrollRows) {
      this.loadPayrollOverview();
    }
    if (tab === 'approvals') {
      this.loadApprovals();
    }
  }

  isTab(tab: 'employees' | 'payroll' | 'approvals'): boolean {
    return this.activeTab === tab;
  }

  private loadPayrollOverview(): void {
    this.payrollListLoading = true;
    this.hrService.getPayrollOverview().subscribe({
      next: (res) => {
        // res.employees and res.payrolls expected
        const employees = res.employees || [];
        const payrolls = res.payrolls || [];
        const latestByEmp = new Map<number, any>();
        payrolls.forEach((p: any) => {
          const curr = latestByEmp.get(p.empId);
          if (!curr || new Date(p.generatedDate || p.month) < new Date(p.generatedDate || p.month)) {
            // This simple condition is placeholder; we'll store by most recent using generatedDate if present
          }
          latestByEmp.set(p.empId, p);
        });
        this.payrollRows = employees.map((e: any) => {
          const p = latestByEmp.get(e.empId);
          return {
            empId: e.empId,
            name: `${e.firstName} ${e.lastName}`.trim(),
            net: p?.ctc ?? 0,
            generatedDate: p?.generatedDate || p?.month || ''
          };
        });
        this.payrollListLoading = false;
      },
      error: () => {
        this.payrollListLoading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  }

  private loadApprovals(): void {
    this.approvalsLoading = true;
    this.hrService.getApprovals().subscribe({
      next: (res) => {
        // As a safety net, filter by current HR department from dashboard data if present
        const dept = this.data?.hrDepartment;
        this.approvals = Array.isArray(res) ? (
          dept ? res.filter((e: any) => (e?.deptCode || '').toString().trim().toLowerCase() === (dept || '').toString().trim().toLowerCase()) : res
        ) : [];
        this.approvalsLoading = false;
      },
      error: () => { this.approvalsLoading = false; }
    });
  }

  approve(empId: number): void {
    this.approveLoading.add(empId);
    this.approveAnimationPhase.set(empId, 'processing');
    delete this.approvalMessages[empId]; // Clear any previous messages

    this.hrService.approveEmployee(empId).subscribe({
      next: (response) => {
        this.approveLoading.delete(empId);
        this.approveSuccess.add(empId);

        // Start the animation sequence
        setTimeout(() => {
          // Phase 1: Fill the spinner and fade text
          this.approveAnimationPhase.set(empId, 'filling');

          // Phase 2: Move spinner to center
          setTimeout(() => {
            this.approveAnimationPhase.set(empId, 'centered');

            // Phase 3: Show checkmark
            setTimeout(() => {
              this.approveAnimationPhase.set(empId, 'checkmark');

              // Remove from approvals list after animation completes (longer delay)
              setTimeout(() => {
                if (this.approvals) this.approvals = this.approvals.filter(a => a.empId !== empId);
                this.approveSuccess.delete(empId);
                this.approveAnimationPhase.delete(empId);
              }, 2000);
            }, 400);
          }, 500);
        }, 1000);
      },
      error: (error) => {
        this.approveLoading.delete(empId);
        this.approveAnimationPhase.delete(empId);
        this.approvalMessages[empId] = {
          type: 'error',
          message: error.error?.message || 'Failed to approve employee. Please try again.'
        };
        // Clear error message after 5 seconds
        setTimeout(() => {
          delete this.approvalMessages[empId];
        }, 5000);
      }
    });
  }

  decline(empId: number): void {
    this.declineLoading.add(empId);
    delete this.approvalMessages[empId]; // Clear any previous messages

    this.hrService.declineEmployee(empId).subscribe({
      next: (response) => {
        this.declineLoading.delete(empId);
        this.approvalMessages[empId] = {
          type: 'success',
          message: response?.message || 'Employee declined successfully.'
        };
        // Remove from approvals list after a short delay to show success message
        setTimeout(() => {
          if (this.approvals) this.approvals = this.approvals.filter(a => a.empId !== empId);
          delete this.approvalMessages[empId];
        }, 2000);
      },
      error: (error) => {
        this.declineLoading.delete(empId);
        this.approvalMessages[empId] = {
          type: 'error',
          message: error.error?.message || 'Failed to decline employee. Please try again.'
        };
        // Clear error message after 5 seconds
        setTimeout(() => {
          delete this.approvalMessages[empId];
        }, 5000);
      }
    });
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  /**
   * Custom validator for phone numbers - exactly 10 digits
   */
  phoneValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const phoneValue = control.value.toString().trim();
    const digitsOnly = phoneValue.replace(/[\s\-\(\)\+\.]/g, '');
    
    if (!/^\d+$/.test(digitsOnly)) {
      return { pattern: { message: 'Phone number must contain only numbers' } };
    }
    
    if (digitsOnly.length !== 10) {
      return { pattern: { message: 'Phone number must have exactly 10 digits' } };
    }
    
    return null;
  }

  openEdit(e: any): void {
    this.editTarget = e;
    // Populate form with employee data
    this.editForm.patchValue({
      firstName: e.firstName || '',
      lastName: e.lastName || '',
      phone: e.phone || '',
      age: e.age || '',
      address: e.address || '',
      roleCode: e.roleCode || '',
      personalEmail: e.personalEmail || e.workMail || ''
    });
    this.editOpen = true;
  }

  closeEdit(): void {
    if (this.editLoading) return;
    this.editOpen = false;
    this.editForm.reset();
  }

  saveEdit(): void {
    if (!this.editTarget) return;
    
    // Mark all fields as touched to show validation errors
    if (!this.editForm.valid) {
      Object.keys(this.editForm.controls).forEach(key => {
        this.editForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.editLoading = true;
    const formData = this.editForm.value;
    
    this.hrService.updateEmployee(this.editTarget.empId, formData).subscribe({
      next: (res) => {
        this.editLoading = false;
        this.editOpen = false;
        // Update local data to reflect changes immediately
        this.editTarget.firstName = formData.firstName;
        this.editTarget.lastName = formData.lastName;
        this.editTarget.phone = formData.phone;
        this.editTarget.age = formData.age;
        this.editTarget.address = formData.address;
        this.editTarget.roleCode = formData.roleCode;
        this.editTarget.personalEmail = formData.personalEmail;
        this.editForm.reset();
      },
      error: () => {
        this.editLoading = false;
      }
    });
  }

  /**
   * Handle phone input to restrict to digits only and limit to 10 digits
   */
  onPhoneInput(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    this.editForm.patchValue({ phone: value }, { emitEvent: false });
  }

  // Getters for form controls
  get editFirstName() { return this.editForm.get('firstName'); }
  get editLastName() { return this.editForm.get('lastName'); }
  get editPhone() { return this.editForm.get('phone'); }
  get editAge() { return this.editForm.get('age'); }
  get editAddress() { return this.editForm.get('address'); }
  get editRoleCode() { return this.editForm.get('roleCode'); }
  get editPersonalEmail() { return this.editForm.get('personalEmail'); }

  viewEmployeeDetails(e: any): void {
    this.viewDetailsEmployee = { ...e };
    this.viewDetailsOpen = true;
  }

  closeViewDetails(): void {
    this.viewDetailsOpen = false;
    this.viewDetailsEmployee = null;
  }

  editFromViewDetails(): void {
    if (this.viewDetailsEmployee) {
      this.closeViewDetails();
      this.openEdit(this.viewDetailsEmployee);
    }
  }

  openPayroll(e: any): void {
    this.payrollTarget = e;
    this.payrollOpen = true;
    this.payrollLoading = true;
    this.payrollData = null;
    this.hrService.getEmployeePayroll(e.empId).subscribe({
      next: (res) => {
        this.payrollLoading = false;
        this.payrollData = res;
      },
      error: () => {
        this.payrollLoading = false;
      }
    });
  }

  editPay(e: any): void {
    this.editPayTarget = e;
    this.editPayOpen = true;
    this.editPayLoading = true;
    this.editPayModel = { empId: e.empId, tax: 0, allowances: 0, incentive: 0, ctc: 0 };
    
    // Fetch current payroll data
    this.hrService.getEmployeePayroll(e.empId).subscribe({
      next: (res) => {
        this.editPayLoading = false;
        // Get the first/latest payroll record
        const payrolls = res?.payrolls || [];
        if (payrolls.length > 0) {
          const latestPayroll = payrolls[0];
          this.editPayModel = {
            empId: e.empId,
            tax: latestPayroll.tax || 0,
            allowances: latestPayroll.allowances || 0,
            incentive: latestPayroll.incentive || 0,
            ctc: latestPayroll.ctc || 0
          };
        }
      },
      error: () => {
        this.editPayLoading = false;
      }
    });
  }

  closeEditPay(): void {
    if (this.editPaySaving) return;
    this.editPayOpen = false;
    this.editPayTarget = null;
  }

  saveEditPay(): void {
    if (!this.editPayTarget) return;
    this.editPaySaving = true;
    this.hrService.updatePayroll(this.editPayModel).subscribe({
      next: () => {
        this.editPaySaving = false;
        this.editPayOpen = false;
        // Refresh the dashboard to show updated data
        this.fetchDashboard();
        // If on payroll tab, refresh that too
        if (this.activeTab === 'payroll') {
          this.loadPayrollOverview();
        }
      },
      error: () => {
        this.editPaySaving = false;
      }
    });
  }

  closePayroll(): void {
    if (this.payrollLoading) return;
    this.payrollOpen = false;
  }

  downloadSlip(): void {
    if (!this.payrollTarget) return;
    this.hrService.downloadSalarySlip(this.payrollTarget.empId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `salary-slip-${this.payrollTarget.empId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        // Refresh payroll list after download to reflect any server-side updates
        this.refreshPayroll();
      }
    });
  }

  generatePayroll(): void {
    if (!this.payrollTarget) return;
    this.payrollLoading = true;
    this.hrService.generatePayroll(this.payrollTarget.empId).subscribe({
      next: () => this.refreshPayroll(),
      error: () => this.payrollLoading = false
    });
  }

  private refreshPayroll(): void {
    if (!this.payrollTarget) return;
    this.hrService.getEmployeePayroll(this.payrollTarget.empId).subscribe({
      next: (res) => {
        this.payrollLoading = false;
        this.payrollData = res;
      },
      error: () => {
        this.payrollLoading = false;
      }
    });
  }
}

