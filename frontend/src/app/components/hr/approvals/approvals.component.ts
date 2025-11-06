import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HRService } from '../../../services/hr.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { HREmployeeResponse } from '../../../models/hr.models';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-hr-approvals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css']
})
export class HrApprovalsComponent implements OnInit {
  pendingEmployees: User[] = [];
  filteredEmployees: User[] = [];
  isLoading = false;
  searchTerm = '';
  currentUser: any;
  activeRoute = 'approvals';
  
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
    console.log('Current HR User (Approvals):', this.currentUser);
    this.loadPendingApprovals();
  }

  loadPendingApprovals(): void {
    this.isLoading = true;
    
    this.hrService.getPendingApprovals().subscribe({
      next: (employees) => {
        this.pendingEmployees = employees;
        this.filteredEmployees = [...employees];
        this.updatePagination();
        this.isLoading = false;
        console.log('Pending approvals loaded:', employees);
      },
      error: (error) => {
        console.error('Error loading pending approvals:', error);
        this.isLoading = false;
        this.showError('Failed to load pending approvals');
      }
    });
  }

  getDepartmentName(deptCode: string): string {
    const departments: { [key: string]: string } = {
      'HR': 'Human Resources',
      'PSO': 'Pre-Sales Operations', 
      'CSO': 'Customer Success Operations',
      'R&D': 'Research & Development',
      'IT': 'Information Technology',
      'FIN': 'Finance',
      'MKT': 'Marketing',
      'SALES': 'Sales',
      'OPS': 'Operations'
    };
    return departments[deptCode] || deptCode;
  }

  performSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = [...this.pendingEmployees];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      this.filteredEmployees = this.pendingEmployees.filter(emp => 
        emp.firstName?.toLowerCase().includes(searchTermLower) ||
        emp.lastName?.toLowerCase().includes(searchTermLower) ||
        emp.personalEmail?.toLowerCase().includes(searchTermLower) ||
        emp.roleCode?.toLowerCase().includes(searchTermLower) ||
        emp.deptCode?.toLowerCase().includes(searchTermLower) ||
        emp.empId?.toString().includes(searchTermLower)
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

  getTotalCount(): number {
    return this.filteredEmployees.length;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
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

  approveEmployee(empId: number): void {
    if (confirm('Are you sure you want to approve this employee? This will grant them access to the system.')) {
      this.isLoading = true;
      
      this.hrService.approveEmployee(empId).subscribe({
        next: (response: HREmployeeResponse) => {
          this.isLoading = false;
          if (response.success) {
            // Remove the approved employee from the lists
            this.pendingEmployees = this.pendingEmployees.filter(emp => emp.empId !== empId);
            this.filteredEmployees = this.filteredEmployees.filter(emp => emp.empId !== empId);
            this.updatePagination();
            this.showSuccess(response.message || 'Employee approved successfully!');
            console.log(`Employee ${empId} approved:`, response);
          } else {
            this.showError(response.message || 'Failed to approve employee');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error approving employee:', error);
          this.showError('Failed to approve employee. Please try again.');
        }
      });
    }
  }

  declineEmployee(empId: number): void {
  if (confirm('Are you sure you want to decline this employee? This action cannot be undone.')) {
    this.isLoading = true;
    
    this.hrService.declineEmployee(empId).subscribe({
      next: (response: HREmployeeResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.pendingEmployees = this.pendingEmployees.filter(emp => emp.empId !== empId);
          this.filteredEmployees = this.filteredEmployees.filter(emp => emp.empId !== empId);
          this.updatePagination();
          this.showSuccess(response.message || 'Employee declined successfully!');
          console.log(`Employee ${empId} declined:`, response);
        } else {
          this.showError(response.message || 'Failed to decline employee');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error declining employee:', error);
        this.showError('Failed to decline employee. Please try again.');
      }
    });
  }
}

  sendCredentials(empId: number): void {
    this.isLoading = true;
    
    this.hrService.sendCredentials(empId).subscribe({
      next: (response: HREmployeeResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.showSuccess(response.message || 'Credentials sent successfully!');
          console.log(`Credentials sent for employee ${empId}:`, response);
        } else {
          this.showError(response.message || 'Failed to send credentials');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error sending credentials:', error);
        this.showError('Failed to send credentials. Please try again.');
      }
    });
  }

  getRoleBadgeClass(roleCode: string | undefined): string {
    const role = roleCode?.toUpperCase();
    if (role?.includes('ADMIN')) return 'badge bg-danger';
    if (role === 'HR') return 'badge bg-primary';
    if (role === 'MANAGER') return 'badge bg-purple';
    if (role === 'LEAD') return 'badge bg-info';
    return 'badge bg-secondary';
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return 'badge bg-success';
      case 'DECLINED': return 'badge bg-danger';
      case 'PENDING': return 'badge bg-warning text-dark';
      case 'UNDEFINED': return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
  }

  private showSuccess(message: string): void {
    // You can replace this with a proper toast notification service
    alert(`✅ ${message}`);
  }

  private showError(message: string): void {
    // You can replace this with a proper toast notification service
    alert(`❌ ${message}`);
  }

  // Method to check if there are any pending approvals
  hasPendingApprovals(): boolean {
    return this.pendingEmployees.length > 0;
  }

  // Method to get the count of pending approvals
  getPendingCount(): number {
    return this.pendingEmployees.length;
  }
}