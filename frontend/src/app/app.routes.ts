import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  // HR Routes
  { 
    path: 'hr/dashboard', 
    loadComponent: () => import('./components/hr/dashboard/dashboard.component').then(m => m.HRDashboardComponent)
  },
  { 
    path: 'hr/employees', 
    loadComponent: () => import('./components/hr/employee-list/employee-list.component').then(m => m.HREmployeeListComponent)
  },
  { path: '**', redirectTo: '/login' }
];