import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HRService } from '../../../services/hr.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-hr-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class HREmployeeListComponent implements OnInit {
  employees: User[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private hrService: HRService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.hrService.getDepartmentEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load employees';
        this.isLoading = false;
        console.error('Employee list error:', error);
      }
    });
  }

  viewEmployeeDetails(empId: number): void {
    this.router.navigate([`/hr/employees/${empId}`]);
  }

  editEmployee(empId: number): void {
    this.router.navigate([`/hr/employees/${empId}/edit`]);
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return 'badge bg-success';
      case 'DECLINED': return 'badge bg-danger';
      case 'UNDEFINED': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }
}