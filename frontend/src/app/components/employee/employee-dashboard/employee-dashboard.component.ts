import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: false,
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit, OnDestroy {
  employee: any = null;
  searchResults: any[] = [];
  searchQuery: string = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  private routerSubscription?: Subscription;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication before loading dashboard
    this.checkAuthAndLoad();
    
    // Also listen to router events in case of browser navigation
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthAndLoad();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
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
    
    // Always reload dashboard data when navigating (including browser back/forward)
    // This ensures fresh data and validates authentication
    if (!this.loading) {
      this.loadDashboard();
    }
  }

  loadDashboard(): void {
    // Triple-check authentication before making API call
    const token = this.authService.getToken();
    const user = this.authService.getUser();
    
    if (!token || !user || !this.authService.isLoggedIn()) {
      sessionStorage.clear();
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

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
        // If 401 or 403, authentication failed - redirect to login
        if (error.status === 401 || error.status === 403) {
          sessionStorage.clear();
          this.router.navigate(['/login'], { replaceUrl: true });
          return;
        }
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}