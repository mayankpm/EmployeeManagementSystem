import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles: string[] | undefined = route.data?.['roles'];
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const userDataRaw = sessionStorage.getItem('auth-user');
    const userRoleCode = userDataRaw ? (JSON.parse(userDataRaw).roleCode || '').toString().toUpperCase() : '';

    // Normalize checks: allow values like ADM*, ADMIN, ADMINISTRATOR to count as admin
    const isAdmin = userRoleCode.startsWith('ADM') || userRoleCode === 'ADMIN' || userRoleCode === 'ADMINISTRATOR';
    const isHr = userRoleCode === 'HR';

    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());
    const allowed = (
      (isAdmin && (normalizedAllowed.includes('ADMIN') || normalizedAllowed.includes('ADM') || normalizedAllowed.includes('ADMINISTRATOR'))) ||
      (isHr && normalizedAllowed.includes('HR'))
    );

    if (allowed) return true;

    // If role not allowed, send to their home
    if (isAdmin) {
      this.router.navigate(['/admin/dashboard']);
    } else if (isHr) {
      this.router.navigate(['/hr/dashboard']);
    } else {
      this.router.navigate(['/employee/dashboard']);
    }
    return false;
  }
}