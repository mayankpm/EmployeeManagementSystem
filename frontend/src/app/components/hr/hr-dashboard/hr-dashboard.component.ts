import { Component, OnInit } from '@angular/core';
import { HrService } from '../../../services/hr.service';

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
  editModel: any = { phone: '', age: '', address: '', roleCode: '', personalEmail: '' };

  payrollOpen = false;
  payrollLoading = false;
  payrollTarget: any = null;
  payrollData: any = null;
  payrollListLoading = false;
  payrollRows: Array<{ empId: number; name: string; net: number; generatedDate: string }>|null = null;
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

  constructor(private hrService: HrService) {}

  ngOnInit(): void {
    this.fetchDashboard();
  }

  fetchDashboard(): void {
    this.loading = true;
    this.errorMessage = '';
    this.hrService.getDashboard().subscribe({
      next: (res) => {
        this.loading = false;
        this.data = res;
      },
      error: (err) => {
        this.loading = false;
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

  openEdit(e: any): void {
    this.editTarget = e;
    this.editModel = {
      phone: e.phone || '',
      age: e.age || '',
      address: e.address || '',
      roleCode: e.roleCode || '',
      personalEmail: e.personalEmail || e.workMail || ''
    };
    this.editOpen = true;
  }

  closeEdit(): void {
    if (this.editLoading) return;
    this.editOpen = false;
  }

  saveEdit(): void {
    if (!this.editTarget) return;
    this.editLoading = true;
    this.hrService.updateEmployee(this.editTarget.empId, this.editModel).subscribe({
      next: (res) => {
        this.editLoading = false;
        this.editOpen = false;
        // Update local data to reflect changes immediately
        this.editTarget.phone = this.editModel.phone;
        this.editTarget.age = this.editModel.age;
        this.editTarget.address = this.editModel.address;
        this.editTarget.roleCode = this.editModel.roleCode;
        this.editTarget.personalEmail = this.editModel.personalEmail;
      },
      error: () => {
        this.editLoading = false;
      }
    });
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

