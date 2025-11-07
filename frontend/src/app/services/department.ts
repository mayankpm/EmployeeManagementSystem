import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DepartmentRequest {
  deptCode: string;
  deptName: string;
  assignedHR: string;
}

export interface DepartmentResponse {
  deptCode: string;
  deptName: string;
  assignedHR: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://localhost:8080/api/departments';

  constructor(private http: HttpClient) { }

  getAllDepartments(): Observable<DepartmentResponse[]> {
    return this.http.get<DepartmentResponse[]>(this.apiUrl);
  }

  addDepartment(department: DepartmentRequest): Observable<DepartmentResponse> {
    return this.http.post<DepartmentResponse>(`${this.apiUrl}/add`, department);
  }

  updateDepartment(department: DepartmentRequest): Observable<DepartmentResponse> {
    return this.http.post<DepartmentResponse>(`${this.apiUrl}/update`, department);
  }

  deleteDepartment(deptCode: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${deptCode}`);
  }
}