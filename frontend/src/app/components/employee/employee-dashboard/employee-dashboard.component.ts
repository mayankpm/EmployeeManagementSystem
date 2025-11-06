import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: false,
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  employee: any = null;
  searchResults: any[] = [];
  searchQuery: string = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.employeeService.getDashboard().subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Dashboard response:', response);
        
        if (response.employee) {
          this.employee = response.employee;
        } else if (response.data?.employee) {
          this.employee = response.data.employee;
        } else {
          this.employee = response;
        }

        if (response.searchResults) {
          this.searchResults = response.searchResults;
        } else if (response.data?.searchResults) {
          this.searchResults = response.data.searchResults;
        }

        this.successMessage = response.message || response.success || '';
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error loading dashboard';
      }
    });
  }

  searchEmployees(): void {
    this.loading = true;
    this.errorMessage = '';
    
    // Allow empty query to show all employees
    const query = this.searchQuery ? this.searchQuery.trim() : '';
    
    this.employeeService.searchEmployees(query).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Search response:', response);
        
        if (response.searchResults) {
          this.searchResults = response.searchResults;
        } else if (response.data?.searchResults) {
          this.searchResults = response.data.searchResults;
        } else if (Array.isArray(response)) {
          this.searchResults = response;
        } else {
          this.searchResults = [];
        }
        
        if (this.searchResults.length === 0 && query) {
          this.errorMessage = 'No employees found matching your search criteria.';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Search error:', error);
        this.errorMessage = error.error?.message || error.error?.error || 'Error searching employees';
        this.searchResults = [];
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.errorMessage = '';
  }
}