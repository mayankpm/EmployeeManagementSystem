import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component'; 
//import { DepartmentService, DepartmentResponse, DepartmentRequest } from '../../../services/department.service';
//import { DepartmentService, DepartmentResponse, DepartmentRequest } from '../../../../services/department.service';
import { from } from 'rxjs';
import { DepartmentRequest, DepartmentResponse } from '../../../models/department';
import { DepartmentService } from '../../../services/department';
@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminSidebarComponent],
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  departments: DepartmentResponse[] = [];
  editingDepartments: { [key: string]: DepartmentRequest } = {};
  newDepartment: DepartmentRequest = { deptCode: '', deptName: '', assignedHR: '' };
  currentUser: any = { name: 'Admin' };
  activeRoute: string = 'departments';

  constructor(
    private departmentService: DepartmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (data: DepartmentResponse[]) => {
        this.departments = data;
        this.departments.forEach(dept => {
          this.editingDepartments[dept.deptCode] = {
            deptCode: dept.deptCode,
            deptName: dept.deptName,
            assignedHR: dept.assignedHR || ''
          };
        });
      },
      error: (error: any) => console.error('Error loading departments:', error)
    });
  }

  addDepartment(): void {
    this.departmentService.addDepartment(this.newDepartment).subscribe({
      next: (newDept: DepartmentResponse) => {
        this.departments.push(newDept);
        this.editingDepartments[newDept.deptCode] = {
          deptCode: newDept.deptCode,
          deptName: newDept.deptName,
          assignedHR: newDept.assignedHR || ''
        };
        this.newDepartment = { deptCode: '', deptName: '', assignedHR: '' };
      },
      error: (error: any) => console.error('Error adding department:', error)
    });
  }

  updateDepartment(deptCode: string): void {
    const departmentRequest = this.editingDepartments[deptCode];
    this.departmentService.updateDepartment(departmentRequest).subscribe({
      next: (updatedDept: DepartmentResponse) => {
        const index = this.departments.findIndex(dept => dept.deptCode === updatedDept.deptCode);
        if (index !== -1) {
          this.departments[index] = updatedDept;
        }
      },
      error: (error: any) => console.error('Error updating department:', error)
    });
  }

  deleteDepartment(deptCode: string): void {
    if (confirm('Delete this department?')) {
      this.departmentService.deleteDepartment(deptCode).subscribe({
        next: () => {
          this.departments = this.departments.filter(dept => dept.deptCode !== deptCode);
          delete this.editingDepartments[deptCode];
        },
        error: (error: any) => console.error('Error deleting department:', error)
      });
    }
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}