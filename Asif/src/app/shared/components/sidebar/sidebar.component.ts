import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule],
  template: `
    <mat-nav-list>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
        <mat-icon matListItemIcon>dashboard</mat-icon>
        <div matListItemTitle>Dashboard</div>
      </a>
      
      @if (isAdmin()) {
        <a mat-list-item routerLink="/menu" routerLinkActive="active-link">
          <mat-icon matListItemIcon>restaurant_menu</mat-icon>
          <div matListItemTitle>Menu Management</div>
        </a>
      }
      <a mat-list-item routerLink="/inventory" routerLinkActive="active-link">
        <mat-icon matListItemIcon>inventory</mat-icon>
        <div matListItemTitle>Inventory</div>
      </a>

      <a mat-list-item routerLink="/pos" routerLinkActive="active-link">
        <mat-icon matListItemIcon>point_of_sale</mat-icon>
        <div matListItemTitle>POS / Billing</div>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      background-color: #ffffff; 
      color: #1e293b;
      border-right: 1px solid #e2e8f0;
    }
    mat-nav-list {
      padding-top: 16px;
    }
    a[mat-list-item] {
      color: #64748b !important; 
      transition: background-color 0.2s ease;
      margin: 4px 12px;
      border-radius: 6px;
    }
    a[mat-list-item]:hover {
      background-color: #f1f5f9;
      color: #0f172a !important;
    }
    a[mat-list-item] mat-icon {
      color: #94a3b8;
    }
    .active-link {
      background-color: #f1f5f9 !important;
      color: #0f172a !important;
      font-weight: 500;
    }
    .active-link mat-icon {
      color: #3b82f6 !important;
    }
  `]
})
export class SidebarComponent {
  authService = inject(AuthService);
  isAdmin = computed(() => this.authService.currentUser()?.role === 'admin');
}
