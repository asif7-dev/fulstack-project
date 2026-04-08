import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MenuService } from '../../core/services/menu.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { MenuItem, TransactionDetail } from '../../core/models';
import { of } from 'rxjs';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="pos-grid p-2">
      <!-- Menu Selection -->
      <div>
        <h2>Menu Selection</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
          <mat-card *ngFor="let item of menuItems()" class="menu-item-card">
            <img mat-card-image [src]="item.imageUrl" [alt]="item.name" style="height: 120px; object-fit: cover;">
            <mat-card-content>
              <div class="mt-2" style="font-weight: bold;">{{ item.name }}</div>
              <div style="color: #3f51b5;">\${{ item.price.toFixed(2) }}</div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-flat-button color="primary" class="w-full" (click)="addToCart(item)">
                ADD TO ORDER
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <!-- Current Order -->
      <div>
        <h2>Current Order</h2>
        <mat-card>
          <mat-card-content>
            <mat-list>
              <div *ngIf="currentOrderItems.length === 0" class="text-center p-2">No items selected</div>
              <mat-list-item *ngFor="let item of currentOrderItems">
                <div matListItemTitle>{{ getItemName(item.menuItemID) }}</div>
                <div matListItemLine>
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>Qty: {{ item.quantity }} x \${{ item.price.toFixed(2) }}</span>
                    <span>\${{ (item.quantity * item.price).toFixed(2) }}</span>
                  </div>
                </div>
                <div matListItemMeta>
                  <button mat-icon-button color="warn" (click)="removeFromCart(item.menuItemID)">
                    <mat-icon>remove_circle</mat-icon>
                  </button>
                </div>
              </mat-list-item>
            </mat-list>
            
            <mat-divider class="mt-2"></mat-divider>
            
            <div class="mt-2" style="font-size: 1.2rem; font-weight: bold; display: flex; justify-content: space-between;">
              <span>Total:</span>
              <span>\${{ cartTotal.toFixed(2) }}</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="accent" class="w-full" 
                    [disabled]="currentOrderItems.length === 0" 
                    (click)="checkout()">
              COMPLETE ORDER
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `
})
export class OrderCreateComponent {
  private menuService = inject(MenuService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  menuItems = this.menuService.products;
  currentOrderItems: TransactionDetail[] = [];

  addToCart(item: MenuItem) {
    const existing = this.currentOrderItems.find(i => i.menuItemID === item.menuItemID);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.currentOrderItems.push({
        transactionDetailID: Date.now().toString(),
        transactionID: '', // Set on checkout
        menuItemID: item.menuItemID,
        quantity: 1,
        price: item.price
      });
    }
  }

  getItemName(menuItemID: string): string {
    return this.menuItems().find(i => i.menuItemID === menuItemID)?.name || 'Unknown';
  }

  removeFromCart(menuItemID: string) {
    const index = this.currentOrderItems.findIndex(i => i.menuItemID === menuItemID);
    if (index > -1) {
      if (this.currentOrderItems[index].quantity > 1) {
        this.currentOrderItems[index].quantity -= 1;
      } else {
        this.currentOrderItems.splice(index, 1);
      }
    }
  }

  get cartTotal() {
    return this.currentOrderItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  }

  checkout() {
    const user = this.authService.currentUser();
    if (user) {
      this.orderService.createOrder([...this.currentOrderItems], user.userID);
      this.currentOrderItems = [];
      this.snackBar.open('Order created successfully!', 'OK', { duration: 3000 });
    }
  }
}
