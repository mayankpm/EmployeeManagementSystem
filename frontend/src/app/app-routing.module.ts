import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EmployeeDashboardComponent } from './components/employee/employee-dashboard/employee-dashboard.component';
import { EmployeeProfileComponent } from './components/employee/employee-profile/employee-profile.component';
import { EmployeePayrollComponent } from './components/employee/employee-payroll/employee-payroll.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminAddEmployeeComponent } from './components/admin/admin-add-employee/admin-add-employee.component';
import { HrDashboardComponent } from './components/hr/hr-dashboard/hr-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'employee/dashboard', 
    component: EmployeeDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'ADM', 'ADMINISTRATOR'] }
  },
  {
    path: 'admin/add-employee',
    component: AdminAddEmployeeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN', 'ADM', 'ADMINISTRATOR'] }
  },
  {
    path: 'hr/dashboard',
    component: HrDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['HR'] }
  },
  { 
    path: 'employee/profile', 
    component: EmployeeProfileComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'employee/payroll', 
    component: EmployeePayrollComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }