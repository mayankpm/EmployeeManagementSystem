import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  departmentOptions: string[] = ['PSO', 'CSO', 'R&D'];
  roleOptions: string[] = ['SDE-1', 'SDE-2', 'SDE-3', 'M1', 'M2', 'M3', 'L1', 'L2', 'L3', 'HR']

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      personalEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator]],
      address: ['', [Validators.required]],
      age: ['', [Validators.required, this.ageValidator]],
      deptCode: ['', [Validators.required]],
      roleCode: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const userDataRaw = sessionStorage.getItem('auth-user');
      const roleCode = userDataRaw ? (JSON.parse(userDataRaw).roleCode || '').toString().toUpperCase() : '';
      // Allow Admin and HR to access registration page for adding employees
      if (!roleCode.startsWith('ADM') && roleCode !== 'HR') {
        this.router.navigate(['/employee/dashboard']);
      }
    }
  }

  phoneValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const phoneValue = control.value.toString().trim();
    const digitsOnly = phoneValue.replace(/[\s\-\(\)\+\.]/g, '');
    
    if (!/^\d+$/.test(digitsOnly)) {
      return { phoneInvalid: true, message: 'Phone number must contain only numbers' };
    }
    
    if (digitsOnly.length !== 10) {
      return { phoneInvalid: true, message: 'Phone number must have exactly 10 digits' };
    }
    
    return null;
  }

  ageValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const age = Number(control.value);
    if (isNaN(age)) {
      return { ageInvalid: true, message: 'Age must be a number' };
    }
    
    if (age < 18) {
      return { ageInvalid: true, message: 'Age must be at least 18' };
    }
    
    if (age > 100) {
      return { ageInvalid: true, message: 'Age cannot exceed 100' };
    }
    
    return null;
  }

  onPhoneInput(event: any): void {
    let value = event.target.value;
    value = value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    this.registerForm.patchValue({ phone: value }, { emitEvent: true });
    // Trigger validation after patching
    this.registerForm.get('phone')?.updateValueAndValidity();
  }

  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    if (!this.registerForm.valid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = { ...this.registerForm.value };
    // Convert age to number if it's a string
    if (formData.age) {
      formData.age = Number(formData.age);
    }
    // Set default password or empty - backend will handle it
    formData.password = '';

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.errorMessage = ''; // Clear any previous errors
          this.successMessage = response.message || 'Employee registered successfully! Please wait for HR approval.';
          this.registerForm.reset();
          
          // Check if Admin/HR is logged in
          const userDataRaw = sessionStorage.getItem('auth-user');
          const roleCode = userDataRaw ? (JSON.parse(userDataRaw).roleCode || '').toString().toUpperCase() : '';
          
          if (roleCode.startsWith('ADM') || roleCode === 'HR') {
            // Admin/HR: Show success message and stay on page to add more employees
            // Success message will remain visible until user dismisses it or adds another employee
            // Optionally redirect back to dashboard after 3 seconds
            setTimeout(() => {
              if (roleCode.startsWith('ADM')) {
                this.router.navigate(['/admin/dashboard']);
              } else if (roleCode === 'HR') {
                this.router.navigate(['/hr/dashboard']);
              }
            }, 3000);
          } else {
            // Regular user - redirect to login after 3 seconds
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          }
        } else {
          this.errorMessage = response.message || 'Registration failed';
          this.successMessage = '';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.successMessage = '';
      }
    });
  }

  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get personalEmail() { return this.registerForm.get('personalEmail'); }
  get phone() { return this.registerForm.get('phone'); }
  get address() { return this.registerForm.get('address'); }
  get age() { return this.registerForm.get('age'); }
  get deptCode() { return this.registerForm.get('deptCode'); }
  get roleCode() { return this.registerForm.get('roleCode'); }
}