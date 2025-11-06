import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-employee-profile',
  standalone: false,
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  profileForm: FormGroup;
  employee: any = null;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      personalEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator]],
      address: ['', [Validators.required]],
      password: [''],
      confirmPassword: ['']
    });
  }

  /**
   * Custom validator for phone numbers
   * Accepts: Exactly 10 digits, with optional +, spaces, dashes, parentheses
   * Examples: +91 9876543210, 9876543210, (987) 654-3210, 987-654-3210
   */
  phoneValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const phoneValue = control.value.toString().trim();
    
    // Remove common phone number formatting characters
    const digitsOnly = phoneValue.replace(/[\s\-\(\)\+\.]/g, '');
    
    // Check if it contains only digits
    if (!/^\d+$/.test(digitsOnly)) {
      return { pattern: { message: 'Phone number must contain only numbers' } };
    }
    
    // Must be exactly 10 digits
    if (digitsOnly.length < 10) {
      return { pattern: { message: 'Phone number must have exactly 10 digits' } };
    }
    
    if (digitsOnly.length > 10) {
      return { pattern: { message: 'Phone number must have exactly 10 digits' } };
    }
    
    return null; // Valid phone number
  }

  ngOnInit(): void {
    // Aggressively check authentication before loading profile
    const token = this.authService.getToken();
    const user = this.authService.getUser();
    
    if (!token || !user || !this.authService.isLoggedIn()) {
      sessionStorage.clear();
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.employeeService.getProfile().subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Profile response:', response);
        
        if (response.employee) {
          this.employee = response.employee;
        } else {
          this.employee = response;
        }

        this.profileForm.patchValue({
          personalEmail: this.employee.personalEmail,
          phone: this.employee.phone,
          address: this.employee.address
        });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error loading profile';
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formData = { ...this.profileForm.value };
      
      // Check if passwords match if provided
      if (formData.password && formData.password !== formData.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      // Remove confirmPassword and empty password if not changed
      delete formData.confirmPassword;
      if (!formData.password) {
        delete formData.password;
      }

      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.employeeService.updateProfile(formData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = response.message || 'Profile updated successfully!';
            // Redirect to role-based home after successful update
            setTimeout(() => {
              const userDataRaw = sessionStorage.getItem('auth-user');
              const roleCode = userDataRaw ? (JSON.parse(userDataRaw).roleCode || '').toString().toUpperCase() : '';
              if (roleCode.startsWith('ADM')) {
                this.router.navigate(['/admin/dashboard']);
              } else if (roleCode === 'HR') {
                this.router.navigate(['/hr/dashboard']);
              } else {
                this.router.navigate(['/employee/dashboard']);
              }
            }, 1500); // Small delay to show success message
          } else {
            this.errorMessage = response.message;
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Error updating profile';
        }
      });
    } else {
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
    }
  }

  get personalEmail() { return this.profileForm.get('personalEmail'); }
  get phone() { return this.profileForm.get('phone'); }
  get address() { return this.profileForm.get('address'); }
  get password() { return this.profileForm.get('password'); }
  get confirmPassword() { return this.profileForm.get('confirmPassword'); }

  /**
   * Handle phone input to restrict to digits only and limit to 10 digits
   */
  onPhoneInput(event: any): void {
    let value = event.target.value;
    // Remove all non-digit characters
    value = value.replace(/\D/g, '');
    // Limit to 10 digits
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    // Update the form control value
    this.profileForm.patchValue({ phone: value }, { emitEvent: false });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}