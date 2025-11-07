import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminSidebarComponent], 
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
searchText: any;
navigateToAddEmployee() {
throw new Error('Method not implemented.');
}

  currentUser = { name: 'Admin' };
  activeRoute = 'dashboard';

  stats = {
    totalEmployees: 0,
    totalDepartments: 0,
    totalRoles: 0,
    pendingApprovals: 0
  };

  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 6;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadEmployees();
  }

  loadStats(): void {
    this.stats = {
      totalEmployees: 156,
      totalDepartments: 12,
      totalRoles: 15,
      pendingApprovals: 8
    };
  }

  loadEmployees(): void {
    this.employees = [
      { empId: 'EMP001', firstName: 'John', lastName: 'Doe', personalEmail: 'john.doe@company.com', phone: '+1 234-567-8900', age: 32, roleCode: 'ADMIN', address: '123 Main St' },
      { empId: 'EMP002', firstName: 'Jane', lastName: 'Smith', personalEmail: 'jane.smith@company.com', phone: '+1 234-567-8901', age: 28, roleCode: 'HR', address: '456 Oak Ave' },
      { empId: 'EMP003', firstName: 'Mike', lastName: 'Johnson', personalEmail: 'mike.johnson@company.com', phone: '+1 234-567-8902', age: 35, roleCode: 'SDE-1', address: '789 Pine Rd' }
    ];
    this.filteredEmployees = [...this.employees];
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = term
      ? this.employees.filter(e =>
          e.firstName.toLowerCase().includes(term) ||
          e.lastName.toLowerCase().includes(term) ||
          e.personalEmail.toLowerCase().includes(term) ||
          e.roleCode.toLowerCase().includes(term)
        )
      : [...this.employees];

    this.currentPage = 1;
  }

  get paginatedEmployees(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmployees.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  viewEmployee(empId: string): void {
    this.router.navigate(['/admin/dashboard']); // ✅ TEMP FIX to avoid invalid routes
  }

  editEmployee(empId: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/admin/dashboard']);
  }

  managePayroll(empId: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/admin/dashboard']);
  }

  getRoleBadgeClass(role: string): string {
    return role === 'ADMIN' ? 'role-admin' :
           role === 'HR' ? 'role-hr' : 'role-employee';
  }

  getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

}
