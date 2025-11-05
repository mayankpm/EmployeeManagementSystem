import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { HRStats, HREmployeeResponse } from '../models/hr.models';

@Injectable({
  providedIn: 'root'
})
export class HRService {
  private apiUrl = '/api/hr';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return new HttpHeaders({
      'X-HR-Department': user.deptCode || ''
    });
  }

  getDashboardStats(): Observable<HRStats> {
    return this.http.get<HRStats>(`${this.apiUrl}/dashboard/stats`, { 
      headers: this.getHeaders() 
    });
  }

  getDepartmentEmployees(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/employees`, { 
      headers: this.getHeaders() 
    });
  }

  getPendingApprovals(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/approvals/pending`, { 
      headers: this.getHeaders() 
    });
  }

  getEmployeeDetails(empId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/employees/${empId}`, { 
      headers: this.getHeaders() 
    });
  }

  approveEmployee(empId: number): Observable<HREmployeeResponse> {
    return this.http.post<HREmployeeResponse>(
      `${this.apiUrl}/employees/${empId}/approve`, 
      {},
      { headers: this.getHeaders() }
    );
  }

  declineEmployee(empId: number): Observable<HREmployeeResponse> {
    return this.http.post<HREmployeeResponse>(
      `${this.apiUrl}/employees/${empId}/decline`, 
      {},
      { headers: this.getHeaders() }
    );
  }

  updateEmployee(empId: number, employee: User): Observable<HREmployeeResponse> {
    return this.http.put<HREmployeeResponse>(
      `${this.apiUrl}/employees/${empId}`, 
      employee,
      { headers: this.getHeaders() }
    );
  }

  getCurrentHRDepartment(): string {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.deptCode || '';
  }
}