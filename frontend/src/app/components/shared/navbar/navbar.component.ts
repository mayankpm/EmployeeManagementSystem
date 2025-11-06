import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const userData = sessionStorage.getItem('auth-user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserRoleDisplay(): string {
    if (!this.currentUser?.roleCode) return 'Employee';
    
    const role = this.currentUser.roleCode.toUpperCase();
    if (role.startsWith('ADM')) return 'Administrator';
    if (role === 'HR') return 'HR Manager';
    return 'Employee';
  }
}