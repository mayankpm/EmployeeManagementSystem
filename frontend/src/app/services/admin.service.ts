import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const ADMIN_API = 'http://localhost:8080/api/admin/';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDashboard(): Observable<any> {
    return this.http.get<any>(ADMIN_API + 'dashboard', { headers: this.getAuthHeaders() });
  }

  deleteEmployee(empId: number): Observable<any> {
    return this.http.delete<any>(ADMIN_API + 'employee/' + empId, { headers: this.getAuthHeaders() });
  }

  updateEmployee(empId: number, updates: any): Observable<any> {
    return this.http.put<any>(ADMIN_API + 'employee/' + empId, updates, { headers: this.getAuthHeaders() });
  }

  // Roles API
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/roles', { headers: this.getAuthHeaders() });
  }

  addRole(roleCode: string, baseSalary: number): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/roles', { roleCode, baseSalary }, { headers: this.getAuthHeaders() });
  }

  updateRole(roleCode: string, baseSalary: number): Observable<any> {
    return this.http.put<any>('http://localhost:8080/api/roles/' + roleCode, { roleCode, baseSalary }, { headers: this.getAuthHeaders() });
  }

  deleteRole(roleCode: string): Observable<any> {
    return this.http.delete<any>('http://localhost:8080/api/roles/' + roleCode, { headers: this.getAuthHeaders() });
  }

  // Departments API
  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/departments', { headers: this.getAuthHeaders() });
  }

  addDepartment(deptCode: string, deptName: string, assignedHR: string): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/departments', { deptCode, deptName, assignedHR }, { headers: this.getAuthHeaders() });
  }

  updateDepartment(deptCode: string, deptName: string, assignedHR: string): Observable<any> {
    return this.http.put<any>('http://localhost:8080/api/departments/' + deptCode, { deptCode, deptName, assignedHR }, { headers: this.getAuthHeaders() });
  }

  deleteDepartment(deptCode: string): Observable<any> {
    return this.http.delete<any>('http://localhost:8080/api/departments/' + deptCode, { headers: this.getAuthHeaders() });
  }
}


