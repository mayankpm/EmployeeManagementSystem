import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { EmployeeDashboardComponent } from './components/employee/employee-dashboard/employee-dashboard.component';
import { EmployeeProfileComponent } from './components/employee/employee-profile/employee-profile.component';
import { EmployeePayrollComponent } from './components/employee/employee-payroll/employee-payroll.component';
import { AuthGuard } from './guards/auth.guard';

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