import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InventoryService } from '../../core/services/inventory.service';
import { InventoryDialogComponent } from './inventory-dialog/inventory-dialog.component';
import { InventoryItem } from '../../core/models/core-models';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatProgressBarModule, MatTooltipModule],
  template: `
    <div class="inventory-container">
      <div class="header">
        <h1>Inventory Management</h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon> Add Stock
        </button>
      </div>

      <div class="alert-section" *ngIf="lowStockItems().length > 0">
        <mat-card class="alert-card">
            <mat-icon color="warn">warning</mat-icon>
            <span>Low Stock Alert: {{lowStockItems().length}} items are below reorder level!</span>
        </mat-card>
      </div>

      <mat-card>
        <table mat-table [dataSource]="inventoryService.inventory()" class="mat-elevation-z0">
          
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Item Name </th>
            <td mat-cell *matCellDef="let element"> {{element.name}} </td>
          </ng-container>

          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef> Quantity </th>
            <td mat-cell *matCellDef="let element"> 
                <div class="quantity-cell">
                    {{element.quantity}} {{element.unit}}
                    <mat-progress-bar mode="determinate" 
                        [value]="(element.quantity / 100) * 100" 
                        [color]="element.quantity <= element.reorderLevel ? 'warn' : 'primary'">
                    </mat-progress-bar>
                </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="threshold">
            <th mat-header-cell *matHeaderCellDef> Reorder Level </th>
            <td mat-cell *matCellDef="let element"> {{element.reorderLevel}} {{element.unit}} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let element">
              <span [class.low-stock]="element.quantity <= element.reorderLevel" [class.ok]="element.quantity > element.reorderLevel">
                {{element.quantity <= element.reorderLevel ? 'Low Stock' : 'OK'}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="primary" (click)="updateStock(element.inventoryItemID, 5)" matTooltip="Add Stock">
                <mat-icon>add_circle</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="updateStock(element.inventoryItemID, -1)" matTooltip="Decrease Stock">
                <mat-icon>remove_circle</mat-icon>
              </button>
              <button mat-icon-button color="accent" (click)="openAddDialog(element)" matTooltip="Edit Details">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteItem(element.inventoryItemID)" matTooltip="Delete Item">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .inventory-container {
      padding: 32px;
      background-color: #f8fafc;
      min-height: calc(100vh - 64px);
    }
    h1 { 
      color: #1e293b; 
      margin: 0;
      font-size: 1.875rem;
      font-weight: 600;
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 32px; 
    }
    .alert-section { margin-bottom: 24px; }
    .alert-card { 
      padding: 16px; 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      background-color: #fef2f2; 
      border: 1px solid #fee2e2; 
      color: #991b1b; 
      border-radius: 8px;
    }
    .quantity-cell { display: flex; flex-direction: column; gap: 8px; width: 160px; }
    .low-stock { color: #dc2626; font-weight: 500; background: #fef2f2; padding: 2px 8px; border-radius: 4px; }
    .ok { color: #16a34a; font-weight: 500; background: #f0fdf4; padding: 2px 8px; border-radius: 4px; }
    table { width: 100%; }
    mat-card { 
      border-radius: 8px; 
      overflow: hidden; 
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); 
      background: #ffffff;
    }
  `]
})
export class InventoryComponent {
  inventoryService = inject(InventoryService);
  dialog = inject(MatDialog);
  displayedColumns: string[] = ['name', 'quantity', 'threshold', 'status', 'actions'];

  lowStockItems = this.inventoryService.checkLowStock.bind(this.inventoryService);

  openAddDialog(item?: InventoryItem) {
    const dialogRef = this.dialog.open(InventoryDialogComponent, {
      width: '400px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (item) {
          this.inventoryService.updateItemDetails(item.inventoryItemID, result);
        } else {
          this.inventoryService.addItem(result);
        }
      }
    });
  }

  deleteItem(id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.inventoryService.deleteItem(id);
    }
  }

  updateStock(id: string, amount: number) {
    this.inventoryService.updateStock(id, amount);
  }
}
