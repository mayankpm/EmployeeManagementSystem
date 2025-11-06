import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  loading = false;
  errorMessage = '';
  data: any = null;
  editOpen = false;
  editLoading = false;
  editTarget: any = null;
  editModel: any = { firstName: '', lastName: '', age: '', personalEmail: '', phone: '', address: '', roleCode: '', deptCode: '', approvalStatus: '' };
  departmentOptions: string[] = [];
  roleOptions: string[] = [];
  activeTab: 'employees' | 'roles' | 'departments' = 'employees';
  rolesLoading = false;
  roles: Array<{ roleCode: string; baseSalary: number }> = [];
  newRole = { roleCode: '', baseSalary: 0 };

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.fetchDashboard();
  }

  fetchDashboard(): void {
    this.loading = true;
    this.errorMessage = '';
    this.adminService.getDashboard().subscribe({
      next: (res) => {
        this.loading = false;
        this.data = res;
        const depts = new Set<string>();
        const roles = new Set<string>();
        (res?.employees || []).forEach((e: any) => {
          if (e?.deptCode) depts.add(String(e.deptCode));
          if (e?.roleCode) roles.add(String(e.roleCode));
        });
        this.departmentOptions = Array.from(depts).sort();
        this.roleOptions = Array.from(roles).sort();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to load Admin dashboard';
      }
    });
  }

  getInitials(e: any): string {
    const a = (e?.firstName || '').trim();
    const b = (e?.lastName || '').trim();
    return ((a ? a[0] : '') + (b ? b[0] : '') || 'NA').toUpperCase();
  }

  deleteEmployee(empId: number): void {
    if (!confirm('Delete employee #' + empId + '?')) return;
    this.adminService.deleteEmployee(empId).subscribe({
      next: () => {
        if (this.data?.employees) {
          this.data.employees = this.data.employees.filter((e: any) => e.empId !== empId);
          this.data.totalEmployees = (this.data.totalEmployees || 1) - 1;
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to delete employee';
      }
    });
  }

  openEdit(e: any): void {
    this.editTarget = e;
    this.editModel = {
      firstName: e.firstName || '',
      lastName: e.lastName || '',
      age: e.age || '',
      personalEmail: e.personalEmail || e.workMail || '',
      phone: e.phone || '',
      address: e.address || '',
      roleCode: e.roleCode || '',
      deptCode: e.deptCode || '',
      approvalStatus: e.approvalStatus || ''
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
    this.adminService.updateEmployee(this.editTarget.empId, this.editModel).subscribe({
      next: (res) => {
        this.editLoading = false;
        this.editOpen = false;
        // merge changes into local data to reflect immediately
        Object.assign(this.editTarget, this.editModel);
      },
      error: (err) => {
        this.editLoading = false;
        this.errorMessage = err.error?.message || 'Failed to update employee';
      }
    });
  }

  // Sidebar tab helpers
  setTab(tab: 'employees' | 'roles' | 'departments'): void {
    this.activeTab = tab;
    if (tab === 'roles' && this.roles.length === 0) {
      this.loadRoles();
    }
  }

  isTab(tab: 'employees' | 'roles' | 'departments'): boolean {
    return this.activeTab === tab;
  }

  goToAddEmployee(): void {
    this.router.navigate(['/register']);
  }

  // Role management methods
  private loadRoles(): void {
    this.rolesLoading = true;
    this.adminService.getRoles().subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : [];
        // Normalize baseSalary to number to ensure binding with type=number inputs
        this.roles = list.map((r: any) => ({
          roleCode: r.roleCode,
          baseSalary: r.baseSalary != null ? Number(r.baseSalary) : 0
        })).sort((a: any, b: any) => String(a.roleCode).localeCompare(String(b.roleCode)));
        this.rolesLoading = false;
      },
      error: () => { this.rolesLoading = false; }
    });
  }

  updateRole(role: any): void {
    const base = Number(role.baseSalary);
    this.adminService.updateRole(role.roleCode, base).subscribe({
      next: () => {},
    });
  }

  deleteRole(role: any): void {
    if (!confirm('Delete role ' + role.roleCode + '?')) return;
    this.adminService.deleteRole(role.roleCode).subscribe({
      next: () => { this.roles = this.roles.filter(r => r.roleCode !== role.roleCode); },
    });
  }

  addRole(): void {
    const code = (this.newRole.roleCode || '').trim();
    const base = Number(this.newRole.baseSalary);
    if (!code) return;
    this.adminService.addRole(code, base).subscribe({
      next: (res) => {
        this.roles.push({ roleCode: code, baseSalary: base });
        this.newRole = { roleCode: '', baseSalary: 0 };
      }
    });
  }
}


