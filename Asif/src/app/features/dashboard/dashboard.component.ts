import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { OrderService } from '../../core/services/order.service';
import { InventoryService } from '../../core/services/inventory.service';
import { MenuService } from '../../core/services/menu.service';

import { TransactionDetail } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule, MatTableModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to the Cafe Management System</p>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="primary">payments</mat-icon>
            <mat-card-title>Total Sales (Today)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">\${{ dailyStats().totalRevenue.toFixed(2) }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="accent">receipt_long</mat-icon>
            <mat-card-title>Orders (Today)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value">{{ dailyStats().totalOrders }}</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card clickable-card" (click)="navigateToInventory()">
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">inventory_2</mat-icon>
            <mat-card-title>Low Stock Items</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-value" [class.text-warn]="lowStockCount() > 0">{{ lowStockCount() }}</div>
            <p class="status-msg" *ngIf="lowStockCount() > 0">Needs attention</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="dashboard-grid mt-4">
        <mat-card class="transactions-card">
          <mat-card-header>
            <mat-card-title>Recent Transactions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="recentTransactions()" class="w-full">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef> ID </th>
                <td mat-cell *matCellDef="let t"> #{{t.transactionID}} </td>
              </ng-container>
              <ng-container matColumnDef="customer">
                <th mat-header-cell *matHeaderCellDef> Customer </th>
                <td mat-cell *matCellDef="let t"> {{t.customerID}} </td>
              </ng-container>
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef> Amount </th>
                <td mat-cell *matCellDef="let t"> \${{t.totalAmount.toFixed(2)}} </td>
              </ng-container>
              <ng-container matColumnDef="time">
                <th mat-header-cell *matHeaderCellDef> Time </th>
                <td mat-cell *matCellDef="let t"> {{t.date | date:'shortTime'}} </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="['id', 'customer', 'amount', 'time']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['id', 'customer', 'amount', 'time'];"></tr>
            </table>
            <div *ngIf="recentTransactions().length === 0" class="empty-state">
              No transactions yet today
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="top-sellers-card">
          <mat-card-header>
            <mat-card-title>Top Selling Items</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="seller-list">
              @for (item of topSellers(); track item.name) {
                <div class="seller-row">
                  <span class="seller-name">{{item.name}}</span>
                  <span class="seller-count">{{item.count}} sold</span>
                </div>
              }
              @if (topSellers().length === 0) {
                <div class="empty-state">No sales data yet</div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 32px;
      background-color: #f8fafc;
      min-height: calc(100vh - 64px);
    }
    .header { margin-bottom: 32px; }
    .header h1 { margin: 0; color: #1e293b; font-size: 1.875rem; font-weight: 600; }
    .header p { margin: 4px 0 0; color: #64748b; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .stat-card { padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
    .clickable-card { cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .clickable-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.1); }
    mat-card-header { margin-bottom: 16px; align-items: center; }
    mat-card-title { font-size: 0.875rem; font-weight: 500; color: #64748b; margin-bottom: 0 !important; }
    .stat-value { font-size: 2.25rem; font-weight: 700; color: #0f172a; }
    .text-warn { color: #ef4444; }
    .status-msg { margin-top: 8px; font-size: 0.875rem; color: #ef4444; font-weight: 500; }
    .mt-4 { margin-top: 32px; }
    .w-full { width: 100%; }
    .empty-state { text-align: center; padding: 32px; color: #94a3b8; }
    .dashboard-grid { 
      display: grid; 
      grid-template-columns: 2fr 1fr; 
      gap: 24px; 
    }
    .transactions-card, .top-sellers-card { border-radius: 12px; border: 1px solid #e2e8f0; }
    
    .seller-list { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
    .seller-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f1f5f9; border-radius: 8px; }
    .seller-name { font-weight: 600; color: #0f172a; }
    .seller-count { color: #3b82f6; font-weight: 700; font-size: 0.875rem; }

    @media (max-width: 1024px) {
      .dashboard-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent {
  orderService = inject(OrderService);
  inventoryService = inject(InventoryService);
  menuService = inject(MenuService);
  router = inject(Router);

  dailyStats = computed(() => this.orderService.getDashboardStats());
  lowStockCount = computed(() => this.inventoryService.checkLowStock().length);

  recentTransactions = computed(() => {
    const today = new Date().toDateString();
    return this.orderService.transactions()
      .filter(t => new Date(t.date).toDateString() === today)
      .slice(0, 5);
  });

  topSellers = computed(() => {
    const details = this.orderService.transactionDetails();
    const salesMap: Record<string, number> = {};

    details.forEach((detail: TransactionDetail) => {
      salesMap[detail.menuItemID] = (salesMap[detail.menuItemID] || 0) + detail.quantity;
    });

    return Object.entries(salesMap)
      .map(([id, count]) => ({
        name: this.menuService.getProduct(id)?.name || 'Unknown',
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  navigateToInventory() {
    this.router.navigate(['/inventory']);
  }
}
