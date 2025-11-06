import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      personalEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/employee/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      this.loading = true;
      this.errorMessage = '';

      const formData = { ...this.registerForm.value };
      delete formData.confirmPassword;

      this.authService.register(formData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = response.message || 'Registration successful! Please wait for HR approval.';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get personalEmail() { return this.registerForm.get('personalEmail'); }
  get phone() { return this.registerForm.get('phone'); }
  get address() { return this.registerForm.get('address'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}