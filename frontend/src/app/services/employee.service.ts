import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const EMPLOYEE_API = 'http://localhost:8080/api/employee/';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getDashboard(): Observable<any> {
    return this.http.get<any>(
      EMPLOYEE_API + 'dashboard',
      { headers: this.getAuthHeaders() }
    );
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(
      EMPLOYEE_API + 'profile',
      { headers: this.getAuthHeaders() }
    );
  }

  updateProfile(employee: any): Observable<any> {
    return this.http.put(
      EMPLOYEE_API + 'profile',
      employee,
      { headers: this.getAuthHeaders() }
    );
  }

  searchEmployees(query: string): Observable<any> {
    return this.http.post<any>(
      EMPLOYEE_API + 'search',
      { query: query },
      { headers: this.getAuthHeaders() }
    );
  }
}