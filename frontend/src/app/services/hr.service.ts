import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const HR_API = 'http://localhost:8080/api/hr/';

@Injectable({ providedIn: 'root' })
export class HrService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ---------------------- HR DASHBOARD ----------------------
  getDashboard(): Observable<any> {
    return this.http.get<any>(HR_API + 'dashboard', { headers: this.getAuthHeaders() });
  }

  // ---------------------- EMPLOYEE MANAGEMENT ----------------------
  getEmployee(empId: number): Observable<any> {
    return this.http.get<any>(HR_API + 'employee/' + empId, { headers: this.getAuthHeaders() });
  }

  updateEmployee(empId: number, updates: any): Observable<any> {
    return this.http.put<any>(HR_API + 'employee/' + empId, updates, { headers: this.getAuthHeaders() });
  }

  // ---------------------- PAYROLL ----------------------
  getEmployeePayroll(empId: number): Observable<any> {
    return this.http.get<any>(HR_API.replace('/hr/', '/payroll/hr/employee') + `?empId=${empId}`, { headers: this.getAuthHeaders() });
  }

  downloadSalarySlip(empId: number): Observable<Blob> {
    return this.http.get(HR_API.replace('/hr/', '/payroll/hr/pdf/') + empId, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  generatePayroll(empId: number): Observable<any> {
    // POST /api/payroll/hr/generate?empId=...
    return this.http.post<any>(HR_API.replace('/hr/', '/payroll/hr/generate') + `?empId=${empId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  updatePayroll(payroll: any): Observable<any> {
    // PUT /api/payroll/hr/update
    return this.http.put<any>(HR_API.replace('/hr/', '/payroll/hr/update'), payroll, {
      headers: this.getAuthHeaders()
    });
  }

  getPayrollOverview(): Observable<any> {
    return this.http.get<any>(HR_API.replace('/hr/', '/payroll/hr'), { headers: this.getAuthHeaders() });
  }

  // ---------------------- APPROVALS ----------------------
  getApprovals(): Observable<any[]> {
    return this.http.get<any[]>(HR_API + 'approvals', { headers: this.getAuthHeaders() });
  }

approveEmployee(empId: number): Observable<any> {
  return this.http.post<any>(
    'http://localhost:8080/api/email/hr/sendCredentials/' + empId,
    {},
    { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
  );
}


  declineEmployee(empId: number): Observable<any> {
    return this.http.post<any>(HR_API + 'approvals/' + empId + '/decline', {}, { headers: this.getAuthHeaders() });
  }

}
