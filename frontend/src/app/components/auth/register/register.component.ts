import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  departments = [
    { value: 'HR', label: 'Human Resources' },
    { value: 'PSO', label: 'Pre-Sales Operations' },
    { value: 'CSO', label: 'Customer Success Operations' },
    { value: 'R&D', label: 'Research & Development' }
  ];

  roles = [
    { value: 'SDE-1', label: 'SDE-1' },
    { value: 'SDE-2', label: 'SDE-2' },
    { value: 'SDE-3', label: 'SDE-3' },
    { value: 'M1', label: 'Manager-1' },
    { value: 'M2', label: 'Manager-2' },
    { value: 'M3', label: 'Manager-3' },
    { value: 'L1', label: 'Level-1' },
    { value: 'L2', label: 'Level-2' },
    { value: 'L3', label: 'Level-3' },
    { value: 'HR', label: 'HR' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      personalEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      deptCode: ['', [Validators.required]],
      roleCode: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message || 'Registration successful! Waiting for HR approval.';
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          console.error('Registration error:', error);
        }
      });
    }
  }
}