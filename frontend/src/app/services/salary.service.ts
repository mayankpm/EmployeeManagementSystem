import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalaryRequest {
  roleCode: string;
  baseSalary: number;
}

export interface SalaryResponse {
  roleCode: string;
  baseSalary: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private apiUrl = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) { }

  getAllRoles(): Observable<SalaryResponse[]> {
    return this.http.get<SalaryResponse[]>(this.apiUrl);
  }

  addRole(salary: SalaryRequest): Observable<SalaryResponse> {
    return this.http.post<SalaryResponse>(`${this.apiUrl}/add`, salary);
  }

  updateRole(salary: SalaryRequest): Observable<SalaryResponse> {
    return this.http.post<SalaryResponse>(`${this.apiUrl}/update`, salary);
  }

  deleteRole(roleCode: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${roleCode}`);
  }
}