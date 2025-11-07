import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      personalEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginRequest = {
        personalEmail: this.loginForm.get('personalEmail')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful, user role:', response.user?.roleCode);
          
          // Redirect based on user role
          this.redirectBasedOnRole(response.user);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          console.error('Login error:', error);
        }
      });
    }
  }

  private redirectBasedOnRole(user: any): void {
    if (!user || !user.roleCode) {
      console.error('No user or role found after login');
      this.router.navigate(['/']);
      return;
    }

    const role = user.roleCode.trim().toUpperCase();
    console.log('Redirecting based on role:', role);
    
    if (role === 'HR') {
      // Redirect HR users to HR dashboard
      this.router.navigate(['/hr/dashboard']);
    } else if (role.startsWith('ADM')) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      
      this.router.navigate(['/hr/dashboard']);
    }
  }
}