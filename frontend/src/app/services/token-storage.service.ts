import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    sessionStorage.clear();
  }

  public saveToken(token: string): void {
    sessionStorage.removeItem('auth-token');
    sessionStorage.setItem('auth-token', token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem('auth-token');
  }

  public saveUser(user: any): void {
    sessionStorage.removeItem('auth-user');
    sessionStorage.setItem('auth-user', JSON.stringify(user));
  }

  public getUser(): any {
    const user = sessionStorage.getItem('auth-user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
}