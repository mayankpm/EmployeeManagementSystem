import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HRService } from '../../../services/hr.service';
import { User } from '../../../models/user.model';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './viewdetails.components.html',
  styleUrls: ['./viewdetails.components.css']
})
export class EmployeeDetailsComponent implements OnInit {
  employee: User | null = null;
  isLoading = false;
  errorMessage = '';
  currentUser: any;
  activeRoute = 'dashboard';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hrService: HRService
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    this.loadEmployeeDetails();
  }

  loadEmployeeDetails(): void {
    this.isLoading = true;
    const empId = this.route.snapshot.paramMap.get('id');
    
    if (!empId) {
      this.errorMessage = 'Employee ID not provided';
      this.isLoading = false;
      return;
    }

    this.hrService.getEmployeeDetails(+empId).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.isLoading = false;
        console.log('Employee details loaded:', employee);
      },
      error: (error) => {
        this.errorMessage = 'Failed to load employee details';
        this.isLoading = false;
        console.error('Error loading employee details:', error);
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

  getStatusBadgeClass(status: string | undefined): string {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return 'badge bg-success';
      case 'DECLINED': return 'badge bg-danger';
      case 'PENDING': return 'badge bg-warning text-dark';
      case 'UNDEFINED': return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
  }

  goBack(): void {
    this.router.navigate(['/hr/dashboard']);
  }
}