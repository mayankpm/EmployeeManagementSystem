import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const PAYROLL_API = 'http://localhost:8080/api/payroll/';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getEmployeePayroll(): Observable<any> {
    return this.http.get<any>(
      PAYROLL_API + 'employee',
      { headers: this.getAuthHeaders() }
    );
  }

  downloadSalarySlip(): Observable<Blob> {
    return this.http.get(
      PAYROLL_API + 'employee/pdf',
      {
        headers: this.getAuthHeaders(),
        responseType: 'blob'
      }
    );
  }
}