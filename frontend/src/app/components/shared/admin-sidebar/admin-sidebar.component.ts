import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent {
  @Input() currentUser: any;
  @Input() activeRoute: string = 'dashboard';

  constructor(private router: Router) {}

  logout(): void {
    this.router.navigate(['/login']);
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }

  addNewEmployee(): void {
    this.router.navigate(['/register']);
  }
}