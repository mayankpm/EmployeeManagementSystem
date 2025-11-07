import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SalaryService, SalaryResponse, SalaryRequest } from '../../../services/salary.service';
import { AdminSidebarComponent } from '../../shared/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminSidebarComponent],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: SalaryResponse[] = [];
  newRole: SalaryRequest = { roleCode: '', baseSalary: 0 };
  editingRole: { [key: string]: number } = {};
  currentUser: any = { name: 'Admin' };
  activeRoute: string = 'roles';

  constructor(private salaryService: SalaryService) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.salaryService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.roles.forEach(role => {
          this.editingRole[role.roleCode] = role.baseSalary;
        });
      },
      error: (error) => console.error('Error loading roles:', error)
    });
  }

  addRole(): void {
    this.salaryService.addRole(this.newRole).subscribe({
      next: (newRole) => {
        this.roles.push(newRole);
        this.editingRole[newRole.roleCode] = newRole.baseSalary;
        this.newRole = { roleCode: '', baseSalary: 0 };
      },
      error: (error) => console.error('Error adding role:', error)
    });
  }

  updateRole(roleCode: string): void {
    const salaryRequest: SalaryRequest = {
      roleCode: roleCode,
      baseSalary: this.editingRole[roleCode]
    };

    this.salaryService.updateRole(salaryRequest).subscribe({
      next: (updatedRole) => {
        const index = this.roles.findIndex(role => role.roleCode === updatedRole.roleCode);
        if (index !== -1) {
          this.roles[index] = updatedRole;
        }
      },
      error: (error) => console.error('Error updating role:', error)
    });
  }

  deleteRole(roleCode: string): void {
    if (confirm('Delete this role?')) {
      this.salaryService.deleteRole(roleCode).subscribe({
        next: () => {
          this.roles = this.roles.filter(role => role.roleCode !== roleCode);
          delete this.editingRole[roleCode];
        },
        error: (error) => console.error('Error deleting role:', error)
      });
    }
  }
}