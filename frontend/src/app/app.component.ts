import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <app-navbar *ngIf="isLoggedIn()"></app-navbar>
    <div class="container-fluid p-0">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Employee Management System';

  isLoggedIn(): boolean {
    return sessionStorage.getItem('auth-token') !== null;
  }
}