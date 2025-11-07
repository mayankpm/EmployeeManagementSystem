import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-add-employee',
  standalone: false,
  templateUrl: './admin-add-employee.component.html',
  styleUrls: ['./admin-add-employee.component.css']
})
export class AdminAddEmployeeComponent implements OnInit {
  addEmployeeForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  departmentOptions: string[] = ['PSO', 'CSO', 'R&D'];
  roleOptions: string[] = ['SDE-1', 'SDE-2', 'SDE-3', 'M1', 'M2', 'M3', 'L1', 'L2', 'L3', 'HR'];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.addEmployeeForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      personalEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, this.phoneValidator]],
      address: ['', [Validators.required]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
      deptCode: ['', [Validators.required]],
      roleCode: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check if user is logged in and is admin
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const userData = this.authService.getUser();
    const roleCode = userData?.roleCode || '';
    const roleUpper = roleCode.toString().toUpperCase();

    // Only allow ADMIN to access this page
    if (!roleUpper.startsWith('ADM')) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(value)) {
      return { pattern: { message: 'Phone number must have exactly 10 digits' } };
    }
    return null;
  }

  onPhoneInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    this.addEmployeeForm.patchValue({ phone: value }, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.addEmployeeForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = { ...this.addEmployeeForm.value };

      this.authService.register(formData).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.successMessage = response.message || 'Employee added successfully!';
            // Reset form
            this.addEmployeeForm.reset();
            // Redirect to admin dashboard after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/admin/dashboard']);
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Failed to add employee. Please try again.';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Failed to add employee. Please try again.';
        }
      });
    } else {
      Object.keys(this.addEmployeeForm.controls).forEach(key => {
        this.addEmployeeForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  // Getters for form controls
  get firstName() { return this.addEmployeeForm.get('firstName'); }
  get lastName() { return this.addEmployeeForm.get('lastName'); }
  get personalEmail() { return this.addEmployeeForm.get('personalEmail'); }
  get phone() { return this.addEmployeeForm.get('phone'); }
  get address() { return this.addEmployeeForm.get('address'); }
  get age() { return this.addEmployeeForm.get('age'); }
  get deptCode() { return this.addEmployeeForm.get('deptCode'); }
  get roleCode() { return this.addEmployeeForm.get('roleCode'); }
}
