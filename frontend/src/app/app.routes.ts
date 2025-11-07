import { Routes } from '@angular/router';

export const routes: Routes = [

  
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Auth Routes
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component')
                        .then(m => m.LoginComponent)
  },

  // Admin Routes
  { 
    path: 'admin/dashboard', 
    loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component')
                        .then(m => m.AdminDashboardComponent)
  },
  { 
    path: 'admin/roles',
    loadComponent: () => import('./components/admin/role/roles.component')
                        .then(m => m.RolesComponent)
  },

  // ✅ Department Management
  { 
    path: 'admin/departments',
    loadComponent: () => import('./components/admin/department/department.component')
                        .then(m => m.DepartmentComponent)
  },

  // HR Routes
  { 
    path: 'hr/dashboard', 
    loadComponent: () => import('./components/hr/dashboard/dashboard.component')
                        .then(m => m.HRDashboardComponent)
  },

  // ✅ Wildcard route for invalid paths
  { path: '**', redirectTo: '/login' }
];
