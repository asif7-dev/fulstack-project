import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MenuService } from '../../core/services/menu.service';
import { MenuItem, ProductDialogResult } from '../../core/models/core-models';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { RecipeDialogComponent } from './recipe-dialog/recipe-dialog.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="menu-container">
      <div class="header">
        <h1>Menu Management</h1>
        <button mat-raised-button color="primary" (click)="openProductDialog()">
          <mat-icon>add</mat-icon> Add Product
        </button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="menuService.products()" class="mat-elevation-z0">
          
          <ng-container matColumnDef="image">
            <th mat-header-cell *matHeaderCellDef> Image </th>
            <td mat-cell *matCellDef="let element"> 
              <img [src]="getImage(element)" class="product-thumb"> 
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Name </th>
            <td mat-cell *matCellDef="let element"> 
              <strong>{{element.name}}</strong><br>
              <span class="text-caption">{{menuService.getCategoryName(element.categoryID)}}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef> Price </th>
            <td mat-cell *matCellDef="let element"> \${{element.price.toFixed(2)}} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let element">
              <span [class.available]="element.isAvailable && menuService.isRecipeConfigured(element.menuItemID)" [class.unavailable]="!element.isAvailable || !menuService.isRecipeConfigured(element.menuItemID)">
                {{element.isAvailable ? (menuService.isRecipeConfigured(element.menuItemID) ? 'Ready to Sell' : 'Recipe Missing') : 'Unavailable'}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="accent" (click)="openProductDialog(element)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="primary" (click)="openRecipeDialog(element)" title="Edit recipe">
                <mat-icon>restaurant</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProduct(element.menuItemID)">
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
    .menu-container {
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
    .product-thumb { 
      width: 48px; 
      height: 48px; 
      object-fit: cover; 
      border-radius: 6px; 
      border: 1px solid #e2e8f0;
    }
    .text-caption { font-size: 0.875rem; color: #64748b; }
    .available { color: #16a34a; font-weight: 500; }
    .unavailable { color: #dc2626; font-weight: 500; }
    table { width: 100%; }
    mat-card {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      background: #ffffff;
    }
  `]
})
export class MenuComponent {
  menuService = inject(MenuService);
  dialog = inject(MatDialog);
  displayedColumns: string[] = ['image', 'name', 'price', 'status', 'actions'];

  openProductDialog(product?: MenuItem) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const payload = result as ProductDialogResult;
        if (product) {
          this.menuService.updateProduct(product.menuItemID, payload.product).pipe(
            switchMap((saved: any) => this.menuService.replaceRecipe(saved.menuItemID || product.menuItemID, payload.recipeIngredients))
          ).subscribe();
        } else {
          this.menuService.addProduct(payload.product).pipe(
            switchMap((saved: any) => this.menuService.replaceRecipe(saved.menuItemID, payload.recipeIngredients))
          ).subscribe();
        }
      }
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.menuService.deleteProduct(id);
    }
  }

  openRecipeDialog(product: MenuItem) {
    this.dialog.open(RecipeDialogComponent, {
      width: '700px',
      data: product
    });
  }

  getImage(product: MenuItem): string {
    if (product.imageUrl && product.imageUrl.trim() !== '') {
      return product.imageUrl.startsWith('assets') ? '/' + product.imageUrl : product.imageUrl;
    }
    return '/assets/images/placeholder_food_1768939673576.png';
  }
}
