import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <app-navbar *ngIf="isLoggedIn()"></app-navbar>
    <div class="container-fluid p-0">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Employee Management System';
  private routerSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Listen to all navigation events (including browser back/forward)
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        
        // Skip check for login/register pages
        if (url === '/login' || url === '/register' || url === '/') {
          return;
        }
        
        // Check if navigating to a protected route
        if (this.isProtectedRoute(url)) {
          // Aggressively verify authentication on every navigation
          const token = this.authService.getToken();
          const user = this.authService.getUser();
          
          // If token or user is missing, clear and redirect
          if (!token || !user) {
            sessionStorage.clear();
            this.router.navigate(['/login'], { replaceUrl: true });
            return;
          }
          
          // Verify authentication (checks token validity and expiration)
          if (!this.authService.isLoggedIn()) {
            sessionStorage.clear();
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  private isProtectedRoute(url: string): boolean {
    // List of protected routes that require authentication
    const protectedRoutes = [
      '/employee/dashboard',
      '/employee/profile',
      '/employee/payroll',
      '/admin/dashboard',
      '/hr/dashboard'
    ];
    return protectedRoutes.some(route => url.startsWith(route));
  }
}