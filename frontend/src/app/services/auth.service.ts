import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'login',
      {
        personalEmail: email,
        password,
      },
      httpOptions
    );
  }

  register(employee: Employee): Observable<any> {
    return this.http.post(
      AUTH_API + 'register',
      employee,
      httpOptions
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('auth-token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  logout(): void {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('auth-user');
  }
}