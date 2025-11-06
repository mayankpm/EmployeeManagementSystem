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

  getUser(): any {
    const userData = sessionStorage.getItem('auth-user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if JWT token is valid format and not expired (client-side check)
   */
  private isTokenValid(token: string): boolean {
    if (!token) return false;
    
    try {
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Decode the payload (second part)
      const payload = JSON.parse(atob(parts[1]));
      
      // Check expiration
      if (payload.exp) {
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        if (currentTime >= expirationTime) {
          // Token is expired
          return false;
        }
      }
      
      return true;
    } catch (e) {
      // Invalid token format
      return false;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    
    // Both token and user data must exist
    if (!token || !user) {
      return false;
    }

    // Validate token format and expiration
    if (!this.isTokenValid(token)) {
      // Token is invalid or expired - clear session
      this.logout();
      return false;
    }

    return true;
  }

  logout(): void {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('auth-user');
  }
}