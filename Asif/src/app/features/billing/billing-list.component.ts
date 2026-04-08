import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-billing-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-2">
      <h2>Billing History</h2>
      
      <mat-table [dataSource]="orders$" class="mat-elevation-z2 mt-2">
        <ng-container matColumnDef="orderNumber">
          <mat-header-cell *matHeaderCellDef> Order # </mat-header-cell>
          <mat-cell *matCellDef="let element"> {{element.orderNumber}} </mat-cell>
        </ng-container>

        <ng-container matColumnDef="date">
          <mat-header-cell *matHeaderCellDef> Date </mat-header-cell>
          <mat-cell *matCellDef="let element"> {{element.createdAt | date:'short'}} </mat-cell>
        </ng-container>

        <ng-container matColumnDef="total">
          <mat-header-cell *matHeaderCellDef> Total </mat-header-cell>
          <mat-cell *matCellDef="let element"> \${{element.totalAmount.toFixed(2)}} </mat-cell>
        </ng-container>

        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef> Status </mat-header-cell>
          <mat-cell *matCellDef="let element"> 
            <span class="badge-success">{{element.status}}</span>
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef> Invoice </mat-header-cell>
          <mat-cell *matCellDef="let element">
            <button mat-icon-button color="primary" (click)="viewInvoice(element)">
              <mat-icon>print</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </mat-table>
    </div>
  `
})
export class BillingListComponent {
  displayedColumns: string[] = ['orderNumber', 'date', 'total', 'status', 'actions'];
  orders$ = this.orderService.orders$;

  constructor(private orderService: OrderService) {}

  viewInvoice(order: any) {
    alert(`Order: ${order.orderNumber}\nTotal: $${order.totalAmount}\nItems: ${order.items.length}`);
  }
}
