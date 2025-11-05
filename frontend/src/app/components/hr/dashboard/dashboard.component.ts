import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HRService } from '../../../services/hr.service';
import { AuthService } from '../../../services/auth.service';
import { HRStats } from '../../../models/hr.models';
import { User } from '../../../models/user.model';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class HRDashboardComponent implements OnInit {
  employees: User[] = [];
  filteredEmployees: User[] = [];
  stats: HRStats | null = null;
  isLoading = false;
  searchTerm = '';
  currentUser: any;
  activeRoute = 'dashboard';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 1;

  constructor(
    private hrService: HRService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current HR User:', this.currentUser);
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load stats and employees in parallel
    this.hrService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        console.log('Dashboard stats:', stats);
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });

    this.hrService.getDepartmentEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.filteredEmployees = [...employees];
        this.updatePagination();
        this.isLoading = false;
        console.log('Department employees loaded:', employees.length);
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.isLoading = false;
      }
    });
  }

  getDepartmentName(deptCode: string): string {
    const departments: { [key: string]: string } = {
      'HR': 'Human Resources',
      'PSO': 'Pre-Sales Operations', 
      'CSO': 'Customer Success Operations',
      'R&D': 'Research & Development'
    };
    return departments[deptCode] || deptCode;
  }

  getHREmployeesCount(): number {
    return this.employees.filter(emp => emp.roleCode === 'HR').length;
  }

  performSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = [...this.employees];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      this.filteredEmployees = this.employees.filter(emp => 
        emp.firstName?.toLowerCase().includes(searchTermLower) ||
        emp.lastName?.toLowerCase().includes(searchTermLower) ||
        emp.personalEmail?.toLowerCase().includes(searchTermLower) ||
        emp.roleCode?.toLowerCase().includes(searchTermLower) ||
        emp.phone?.includes(searchTermLower) ||
        emp.deptCode?.toLowerCase().includes(searchTermLower)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  getPaginatedEmployees(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmployees.slice(startIndex, endIndex);
  }

  getVisibleCount(): string {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredEmployees.length);
    return `${startIndex}-${endIndex}`;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewEmployeeDetails(empId: number): void {
    this.router.navigate([`/hr/employees/${empId}`]);
  }

  editEmployee(empId: number): void {
    this.router.navigate([`/hr/employees/${empId}/edit`]);
  }

  getRoleBadgeClass(roleCode: string | undefined): string {
    const role = roleCode?.toUpperCase();
    if (role?.includes('ADMIN')) return 'role-badge role-admin';
    if (role === 'HR') return 'role-badge role-hr';
    return 'role-badge role-employee';
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return 'badge bg-success';
      case 'DECLINED': return 'badge bg-danger';
      case 'UNDEFINED': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}