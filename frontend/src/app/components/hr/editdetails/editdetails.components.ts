import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HRService } from '../../../services/hr.service';
import { User } from '../../../models/user.model';
import { HREmployeeResponse } from '../../../models/hr.models';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SidebarComponent],
  templateUrl: './editdetails.components.html',
  styleUrls: ['./editdetails.components.css']
})
export class EditEmployeeComponent implements OnInit {
  editForm: FormGroup;
  employee: User | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  currentUser: any;
  activeRoute = 'dashboard';

  // Role options
  roleOptions = [
    { value: 'L1', label: 'Level 1' },
    { value: 'L2', label: 'Level 2' },
    { value: 'L3', label: 'Level 3' },
    { value: 'M1', label: 'Manager Level 1' },
    { value: 'M2', label: 'Manager Level 2' },
    { value: 'M3', label: 'Manager Level 3' },
    { value: 'SDE-1', label: 'Software Dev Engineer 1' },
    { value: 'SDE-2', label: 'Software Dev Engineer 2' },
    { value: 'SDE-3', label: 'Software Dev Engineer 3' },
    { value: 'HR', label: 'HR' },
    { value: 'MGR', label: 'Manager' }
  ];

  // Department options
  departmentOptions = [
    { value: 'R&D', label: 'Research & Development' },
    { value: 'PSO', label: 'Pre-Sales Operations' },
    { value: 'CSO', label: 'Customer Success Operations' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'FIN', label: 'Finance' },
    { value: 'MKT', label: 'Marketing' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private hrService: HRService
  ) {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(65)]],
      personalEmail: ['', [Validators.required, Validators.email]],
      phone: [''],
      roleCode: ['', Validators.required],
      deptCode: ['', Validators.required],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    this.loadEmployeeData();
  }

  loadEmployeeData(): void {
    this.isLoading = true;
    const empId = this.route.snapshot.paramMap.get('id');
    
    if (!empId) {
      this.errorMessage = 'Employee ID not provided';
      this.isLoading = false;
      return;
    }

    this.hrService.getEmployeeDetails(+empId).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.populateForm(employee);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load employee data';
        this.isLoading = false;
        console.error('Error loading employee:', error);
      }
    });
  }

  populateForm(employee: User): void {
    this.editForm.patchValue({
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      age: employee.age || '',
      personalEmail: employee.personalEmail || '',
      phone: employee.phone || '',
      roleCode: employee.roleCode || '',
      deptCode: employee.deptCode || '',
      address: employee.address || ''
    });
  }

  onSubmit(): void {
    if (this.editForm.valid && this.employee) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.editForm.value;
      const updatedEmployee: User = {
        ...this.employee,
        ...formData
      };

      this.hrService.updateEmployee(this.employee.empId!, updatedEmployee).subscribe({
        next: (response: HREmployeeResponse) => {
          this.isSubmitting = false;
          if (response.success) {
            this.successMessage = response.message || 'Employee updated successfully!';
            setTimeout(() => {
              this.router.navigate(['/hr/dashboard']);
            }, 1500);
          } else {
            this.errorMessage = response.message || 'Failed to update employee';
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Failed to update employee. Please try again.';
          console.error('Error updating employee:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  getDepartmentName(deptCode: string): string {
    const dept = this.departmentOptions.find(d => d.value === deptCode);
    return dept ? dept.label : deptCode;
  }

  goBack(): void {
    this.router.navigate(['/hr/dashboard']);
  }

  // Form control helpers for template
  get firstName() { return this.editForm.get('firstName'); }
  get lastName() { return this.editForm.get('lastName'); }
  get age() { return this.editForm.get('age'); }
  get personalEmail() { return this.editForm.get('personalEmail'); }
  get roleCode() { return this.editForm.get('roleCode'); }
  get deptCode() { return this.editForm.get('deptCode'); }
}