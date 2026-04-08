import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MenuService } from '../../core/services/menu.service';
import { MenuItem } from '../../core/models';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="p-2">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2>Menu Management</h2>
        <button mat-raised-button color="primary" (click)="onAddItem()">
          <mat-icon>add</mat-icon> Add New Item
        </button>
      </div>

      <mat-table [dataSource]="menuItems$" class="mat-elevation-z2 mt-2">
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef> Item Name </mat-header-cell>
          <mat-cell *matCellDef="let element"> {{element.name}} </mat-cell>
        </ng-container>

        <ng-container matColumnDef="category">
          <mat-header-cell *matHeaderCellDef> Category </mat-header-cell>
          <mat-cell *matCellDef="let element"> {{element.category}} </mat-cell>
        </ng-container>

        <ng-container matColumnDef="price">
          <mat-header-cell *matHeaderCellDef> Price </mat-header-cell>
          <mat-cell *matCellDef="let element"> \${{element.price.toFixed(2)}} </mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef> Actions </mat-header-cell>
          <mat-cell *matCellDef="let element">
            <button mat-icon-button color="accent">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="onDeleteItem(element.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </mat-table>
    </div>
  `
})
export class MenuListComponent {
  displayedColumns: string[] = ['name', 'category', 'price', 'actions'];
  menuItems$ = this.menuService.menuItems$;

  constructor(private menuService: MenuService) {}

  onAddItem() {
    // Logic for dialog would go here
    const itemName = prompt('Item Name?');
    const price = prompt('Price?');
    if (itemName && price) {
      this.menuService.addMenuItem({
        name: itemName,
        category: 'Coffee',
        price: parseFloat(price),
        available: true
      });
    }
  }

  onDeleteItem(id: string) {
    if (confirm('Are you sure?')) {
      this.menuService.deleteMenuItem(id);
    }
  }
}
