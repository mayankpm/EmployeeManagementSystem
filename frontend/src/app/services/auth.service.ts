import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, LoginRequest, AuthResponse, RegisterResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth'; 

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
            this.setUser(response.user);
          }
        })
      );
  }

  register(user: User): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, user);
  }

  // Store token and user info
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setUser(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): any {
    return this.getUser();
  }
}