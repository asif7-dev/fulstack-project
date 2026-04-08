import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive,
    MatToolbarModule, 
    MatSidenavModule, 
    MatListModule, 
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="h-screen" style="height: 100vh;">
      <mat-sidenav #sidenav mode="side" opened class="w-64">
        <div class="p-2 text-center">
          <mat-icon style="font-size: 48px; height: 48px; width: 48px; color: #3f51b5;">local_cafe</mat-icon>
          <h3>Cafe CMS</h3>
          <p style="font-size: 0.8rem;">Logged as: {{ (authService.currentUser$ | async)?.fullName }}</p>
        </div>
        <mat-divider></mat-divider>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <div matListItemTitle>Dashboard</div>
          </a>
          <a mat-list-item routerLink="/pos" routerLinkActive="active-link">
            <mat-icon matListItemIcon>shopping_cart</mat-icon>
            <div matListItemTitle>Point of Sale</div>
          </a>
          <a mat-list-item routerLink="/billing" routerLinkActive="active-link">
             <mat-icon matListItemIcon>receipt</mat-icon>
             <div matListItemTitle>Billing History</div>
          </a>
          <a mat-list-item routerLink="/menu" routerLinkActive="active-link" *ngIf="authService.hasRole('ADMIN')">
            <mat-icon matListItemIcon>menu_book</mat-icon>
            <div matListItemTitle>Menu Management</div>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>{{ title }}</span>
          <span class="spacer"></span>
          <button mat-button (click)="onLogout()">
            <mat-icon>logout</mat-icon> Logout
          </button>
        </mat-toolbar>
        
        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .h-screen { min-height: 100vh; }
    .active-link { background: rgba(63, 81, 181, 0.1); color: #3f51b5; border-right: 4px solid #3f51b5; }
  `]
})
export class LayoutComponent {
  title = 'Cafe Management';
  constructor(public authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }
}
