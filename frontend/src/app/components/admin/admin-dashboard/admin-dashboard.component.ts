import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';

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
  employeeSearch = '';
  empPage = 1;
  empPageSize = 6;
  editOpen = false;
  editLoading = false;
  editTarget: any = null;
  editModel: any = { firstName: '', lastName: '', age: '', personalEmail: '', phone: '', address: '', roleCode: '', deptCode: '', approvalStatus: '' };
  editForm: FormGroup;
  departmentOptions: string[] = [];
  roleOptions: string[] = [];
  activeTab: 'employees' | 'roles' | 'departments' = 'employees';
  rolesLoading = false;
  roles: Array<{ roleCode: string; baseSalary: number }> = [];
  newRole = { roleCode: '', baseSalary: 0 };
  rolesPage = 1;
  rolesPageSize = 10;
  deptsLoading = false;
  departments: Array<{ deptCode: string; deptName: string; assignedHR: string }> = [];
  newDept = { deptCode: '', deptName: '', assignedHR: '' };
  deptsPage = 1;
  deptsPageSize = 10;

  constructor(
    private adminService: AdminService, 
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    // Initialize edit form with validation
    this.editForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      personalEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator]],
      address: ['', [Validators.required]],
      roleCode: ['', [Validators.required]],
      deptCode: ['', [Validators.required]],
      approvalStatus: ['']
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
    // Preload roles so the list is ready when the tab is opened
    this.loadRoles();
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
        // If 401 or 403, authentication failed - redirect to login
        if (err.status === 401 || err.status === 403) {
          sessionStorage.clear();
          this.router.navigate(['/login'], { replaceUrl: true });
          return;
        }
        this.errorMessage = err.error?.message || 'Failed to load Admin dashboard';
      }
    });
  }

  // Filter employees for search in Employees tab
  get filteredEmployees(): any[] {
    const list = this.data?.employees || [];
    const q = (this.employeeSearch || '').toString().trim().toLowerCase();
    if (!q) return list;
    return list.filter((e: any) => {
      const name = `${e.firstName || ''} ${e.lastName || ''}`.toLowerCase();
      const email = (e.workMail || e.personalEmail || '').toLowerCase();
      const dept = (e.deptCode || '').toLowerCase();
      const role = (e.roleCode || '').toLowerCase();
      const id = String(e.empId || '').toLowerCase();
      return name.includes(q) || email.includes(q) || dept.includes(q) || role.includes(q) || id.includes(q);
    });
  }

  private paginate<T>(arr: T[], page: number, pageSize: number): T[] {
    const start = (page - 1) * pageSize;
    return arr.slice(start, start + pageSize);
  }

  get pagedEmployees(): any[] {
    return this.paginate(this.filteredEmployees, this.empPage, this.empPageSize);
  }

  get empTotalPages(): number {
    const total = this.filteredEmployees.length || 0;
    return Math.max(1, Math.ceil(total / this.empPageSize));
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
      age: e.age || '',
      personalEmail: e.personalEmail || e.workMail || '',
      phone: e.phone || '',
      address: e.address || '',
      roleCode: e.roleCode || '',
      deptCode: e.deptCode || '',
      approvalStatus: e.approvalStatus || ''
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
    
    this.adminService.updateEmployee(this.editTarget.empId, formData).subscribe({
      next: (res) => {
        this.editLoading = false;
        this.editOpen = false;
        // merge changes into local data to reflect immediately
        Object.assign(this.editTarget, formData);
        this.editForm.reset();
      },
      error: (err) => {
        this.editLoading = false;
        this.errorMessage = err.error?.message || 'Failed to update employee';
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
  get editAge() { return this.editForm.get('age'); }
  get editPersonalEmail() { return this.editForm.get('personalEmail'); }
  get editPhone() { return this.editForm.get('phone'); }
  get editAddress() { return this.editForm.get('address'); }
  get editRoleCode() { return this.editForm.get('roleCode'); }
  get editDeptCode() { return this.editForm.get('deptCode'); }

  // Sidebar tab helpers
  setTab(tab: 'employees' | 'roles' | 'departments'): void {
    this.activeTab = tab;
    if (tab === 'roles' && this.roles.length === 0) {
      this.loadRoles();
    }
    if (tab === 'departments' && this.departments.length === 0) {
      this.loadDepartments();
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

  get pagedRoles(): any[] {
    return this.paginate(this.roles, this.rolesPage, this.rolesPageSize);
  }

  get rolesTotalPages(): number {
    const total = this.roles.length || 0;
    return Math.max(1, Math.ceil(total / this.rolesPageSize));
  }

  // Department management methods
  private loadDepartments(): void {
    this.deptsLoading = true;
    this.adminService.getDepartments().subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : [];
        this.departments = list.map((d: any) => ({
          deptCode: d.deptCode,
          deptName: d.deptName,
          assignedHR: d.assignedHR
        })).sort((a, b) => String(a.deptCode).localeCompare(String(b.deptCode)));
        this.deptsLoading = false;
      },
      error: () => { this.deptsLoading = false; }
    });
  }

  get pagedDepartments(): any[] {
    return this.paginate(this.departments, this.deptsPage, this.deptsPageSize);
  }

  get deptsTotalPages(): number {
    const total = this.departments.length || 0;
    return Math.max(1, Math.ceil(total / this.deptsPageSize));
  }

  updateDepartment(d: any): void {
    this.adminService.updateDepartment(d.deptCode, d.deptName, d.assignedHR).subscribe({ next: () => {} });
  }

  deleteDepartment(d: any): void {
    if (!confirm('Delete department ' + d.deptCode + '?')) return;
    this.adminService.deleteDepartment(d.deptCode).subscribe({
      next: () => { this.departments = this.departments.filter(x => x.deptCode !== d.deptCode); }
    });
  }

  addDepartment(): void {
    const code = (this.newDept.deptCode || '').trim();
    if (!code) return;
    this.adminService.addDepartment(code, this.newDept.deptName, this.newDept.assignedHR).subscribe({
      next: () => {
        this.departments.push({ ...this.newDept });
        this.departments.sort((a, b) => String(a.deptCode).localeCompare(String(b.deptCode)));
        this.newDept = { deptCode: '', deptName: '', assignedHR: '' };
      }
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


