import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const userDataRaw = sessionStorage.getItem('auth-user');
      const roleCode = userDataRaw ? (JSON.parse(userDataRaw).roleCode || '') : '';
      this.redirectBasedOnRole(roleCode);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            sessionStorage.setItem('auth-token', response.token);
            sessionStorage.setItem('auth-user', JSON.stringify({
              empId: response.empId,
              firstName: response.firstName,
              roleCode: response.roleCode,
              email: response.email
            }));
            
            this.redirectBasedOnRole(response.roleCode);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  private redirectBasedOnRole(roleCode: string): void {
    const role = roleCode?.toUpperCase();
    
    if (role?.startsWith('ADM')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'HR') {
      this.router.navigate(['/hr/dashboard']);
    } else {
      this.router.navigate(['/employee/dashboard']);
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}