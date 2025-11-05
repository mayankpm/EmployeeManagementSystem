import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Employee Management System';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isHR(): boolean {
    const user = this.authService.getCurrentUser();
    return user && user.roleCode === 'HR';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}