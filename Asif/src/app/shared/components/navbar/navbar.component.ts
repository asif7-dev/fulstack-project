import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule],
  template: `
    <mat-toolbar class="navbar">
      @if (authService.currentUser()) {
        <button mat-icon-button (click)="toggleSidenav.emit()" class="menu-button">
          <mat-icon>menu</mat-icon>
        </button>
      }
      <span>Cafe System</span>
      <span class="spacer"></span>
      @if (authService.currentUser()) {
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          {{ authService.currentUser()?.userName }}
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="logout()" class="logout-item">
            <mat-icon color="warn">logout</mat-icon>
            <span class="warn-text">Logout</span>
          </button>
        </mat-menu>
      } @else {
        <button mat-button routerLink="/login">Login</button>
      }
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      background-color: #ffffff !important;
      color: #1e293b !important;
      border-bottom: 1px solid #e2e8f0;
      box-shadow: none !important;
    }
    .menu-button { margin-right: 12px; }
    .warn-text { color: #f44336; font-weight: 500; }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  @Output() toggleSidenav = new EventEmitter<void>();

  logout() {
    this.authService.logout();
  }
}
