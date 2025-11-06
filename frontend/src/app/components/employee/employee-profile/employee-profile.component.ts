import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';

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
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      personalEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
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
            // Redirect to dashboard after successful update
            setTimeout(() => {
              this.router.navigate(['/employee/dashboard']);
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
}