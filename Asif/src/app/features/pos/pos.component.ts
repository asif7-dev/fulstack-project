import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MenuService } from '../../core/services/menu.service';
import { PosService } from '../../core/services/pos.service';
import { CustomerService } from '../../core/services/customer.service';
import { MenuItem } from '../../core/models/core-models';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatBadgeModule,
    MatSelectModule,
    MatDividerModule
  ],
  template: `
    <div class="pos-container">
      <div class="product-grid-section">
        <div class="header-actions">
          <mat-form-field appearance="outline" class="customer-select">
            <mat-select [value]="posService.selectedCustomer()?.customerID || null" 
                        (selectionChange)="onCustomerChange($event.value)"
                        placeholder="Select">
                <mat-option value="walk-in">Walk-in Customer</mat-option>
                <mat-option value="take-away">Take Away</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="category-filter">
            <button mat-button [class.active]="selectedCategory() === 'all'" (click)="filterCategory('all')">All</button>
            <button mat-button *ngFor="let cat of menuService.categories()" 
                    [class.active]="selectedCategory() === cat.categoryID" 
                    (click)="filterCategory(cat.categoryID)">
                {{cat.categoryName}}
            </button>
          </div>
        </div>

        <div class="products-grid">
           @for (product of filteredProducts(); track product.menuItemID) {
             <mat-card class="product-card" (click)="addToCart(product)" [class.unavailable]="!product.isAvailable">
               <img mat-card-image [src]="getImage(product)" alt="{{product.name}}">
               <mat-card-content>
                 <div class="product-name">{{product.name}}</div>
                 <div class="product-price">\${{product.price.toFixed(2)}}</div>
               </mat-card-content>
             </mat-card>
           }
        </div>
      </div>

      <div class="cart-section">
        <mat-card class="cart-card">
          <mat-card-header>
            <mat-card-title>Current Order</mat-card-title>
          </mat-card-header>
          <mat-card-content class="cart-items">
            @if (cartItems().length === 0) {
              <div class="empty-cart">
                <mat-icon>shopping_cart_checkout</mat-icon>
                <p>Cart is empty</p>
              </div>
            } @else {
              <div class="cart-item" *ngFor="let item of cartItems()">
                <div class="item-info">
                   <span class="item-name">{{item.product.name}}</span>
                   <span class="item-price">\${{item.subtotal.toFixed(2)}}</span>
                </div>
                <div class="item-controls">
                  <button mat-icon-button small (click)="updateQuantity(item.product.menuItemID, item.quantity - 1)">
                    <mat-icon>remove</mat-icon>
                  </button>
                  <span>{{item.quantity}}</span>
                  <button mat-icon-button small (click)="updateQuantity(item.product.menuItemID, item.quantity + 1)">
                    <mat-icon>add</mat-icon>
                  </button>
                </div>
              </div>
            }
          </mat-card-content>
          <mat-card-footer class="cart-footer">
            <div class="total-row">
              <h3>Total:</h3>
              <h3>\${{cartTotal().toFixed(2)}}</h3>
            </div>
            <div class="checkout-actions">
              <button mat-raised-button color="warn" (click)="clearCart()" [disabled]="cartItems().length === 0">Clear</button>
              <button mat-raised-button color="primary" (click)="checkout()" [disabled]="cartItems().length === 0">
                Checkout
              </button>
            </div>
            <button mat-button color="accent" class="w-full" (click)="printReceipt()" [disabled]="cartItems().length === 0">
                <mat-icon>print</mat-icon> Print Receipt
            </button>
          </mat-card-footer>
        </mat-card>
      </div>
    </div>
    
    <!-- Receipt Template (Hidden) -->
    <div id="receipt-print" class="printable-receipt" style="display:none;">
        <div class="receipt-header">
            <h2>Cafe Receipt</h2>
            <p>Date: {{today | date:'medium'}}</p>
            <p *ngIf="posService.selectedCustomer()">Customer: {{posService.selectedCustomer()?.name}}</p>
        </div>
        <div class="receipt-items">
            <div *ngFor="let item of cartItems()" class="receipt-item">
                <span>{{item.quantity}}x {{item.product.name}}</span>
                <span>\${{item.subtotal.toFixed(2)}}</span>
            </div>
        </div>
        <div class="receipt-total">
            <h3>Total: \${{cartTotal().toFixed(2)}}</h3>
        </div>
        <p>Thank you!</p>
    </div>
  `,
  styles: [`
    .pos-container {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 32px;
      padding: 32px;
      height: calc(100vh - 64px);
      background-color: #f8fafc;
      color: #1e293b;
    }
    .product-grid-section { overflow-y: auto; padding-right: 16px; }
    .cart-section { 
      width: 100%; 
      padding: 0; 
      background: #ffffff; 
      border: 1px solid #e2e8f0; 
      border-radius: 12px; 
      overflow: hidden;
      display: flex;
    }
    
    .header-actions {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e2e8f0;
    }

    .customer-select { width: 300px; }

    .category-filter { 
      display: flex; 
      gap: 12px; 
      flex-wrap: wrap;
    }
    .category-filter button {
      border-radius: 8px;
      padding: 0 16px;
      border: 1px solid #e2e8f0;
      color: #64748b;
      background: #ffffff;
      transition: all 0.2s ease;
    }
    .category-filter button:hover {
      background-color: #f1f5f9;
      color: #0f172a;
    }
    .category-filter button.active {
      background-color: #3b82f6;
      color: #ffffff;
      border-color: #3b82f6;
    }
    
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    
    .product-card {
      cursor: pointer;
      background: #ffffff;
      color: #1e293b;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .product-card img { height: 160px; object-fit: cover; }
    .product-name { font-weight: 600; margin-top: 12px; font-size: 1rem; color: #0f172a; }
    .product-price { color: #3b82f6; font-weight: 700; margin-top: 4px; }
    
    .cart-card { 
      height: 100%; 
      display: flex; 
      flex-direction: column; 
      background: transparent; 
      color: #1e293b; 
      box-shadow: none;
      border-radius: 0;
    }
    .cart-card mat-card-header {
      padding: 24px;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
    }
    .cart-items { flex: 1; overflow-y: auto; padding: 24px; }
    .cart-item { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      margin-bottom: 16px; 
      padding: 16px; 
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .item-info { display: flex; flex-direction: column; }
    .item-name { font-weight: 600; color: #0f172a; }
    .item-price { color: #64748b; font-size: 0.875rem; }
    
    .item-controls { display: flex; align-items: center; gap: 12px; background: #f1f5f9; border-radius: 8px; padding: 4px; }
    .item-controls button { width: 32px; height: 32px; line-height: 32px; color: #475569; }
    
    .cart-footer { padding: 24px; background: #ffffff; border-top: 1px solid #e2e8f0; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 1.5rem; }
    .total-row h3 { margin: 0; color: #0f172a; font-weight: 700; }
    
    .checkout-actions { display: grid; grid-template-columns: 1fr 2fr; gap: 16px; margin-bottom: 16px; }
    .checkout-actions button { height: 52px; font-size: 1rem; font-weight: 600; }
    
    .empty-cart { text-align: center; color: #94a3b8; margin-top: 64px; }
    .empty-cart mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5; }
  `]
})
export class PosComponent {
  menuService = inject(MenuService);
  posService = inject(PosService);
  customerService = inject(CustomerService);

  cartItems = this.posService.cart;
  cartTotal = this.posService.totalCHECKOUT;

  selectedCategory = signal<string>('all');
  today = new Date();

  filteredProducts = computed(() => {
    const products = this.menuService.products();
    const saleReadyProducts = products.filter(p => p.isAvailable && this.menuService.isRecipeConfigured(p.menuItemID));
    if (this.selectedCategory() === 'all') return saleReadyProducts;
    return saleReadyProducts.filter(p => p.categoryID === this.selectedCategory());
  });

  filterCategory(category: string) {
    this.selectedCategory.set(category);
  }

  addToCart(product: MenuItem) {
    if (product.isAvailable) {
      this.posService.addToCart(product);
    }
  }

  updateQuantity(id: string, qty: number) {
    this.posService.updateQuantity(id, qty);
  }

  clearCart() {
    this.posService.clearCart();
  }

  checkout() {
    this.posService.checkout('cash');
  }

  onCustomerChange(value: any) {
    if (value === 'take-away') {
      this.posService.selectCustomer({
        customerID: 'take-away',
        name: 'Take Away',
        contactInfo: 'N/A',
        loyaltyPoints: 0
      });
    } else if (value === 'walk-in') {
      this.posService.selectCustomer({
        customerID: 'walk-in',
        name: 'Walk-in Customer',
        contactInfo: 'N/A',
        loyaltyPoints: 0
      });
    } else {
      this.posService.selectCustomer(null);
    }
  }

  printReceipt() {
    const printContent = document.getElementById('receipt-print');
    if (!printContent) return;
    
    const WindowPrt = window.open('', '', 'left=0,top=0,width=400,height=600,toolbar=0,scrollbars=0,status=0');
    if (WindowPrt) {
      WindowPrt.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: 'Inter', Arial, sans-serif; padding: 20px; color: #000; }
              .receipt-header { text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #ccc; padding-bottom: 15px; }
              .receipt-header h2 { margin: 0 0 10px 0; font-size: 24px; }
              .receipt-header p { margin: 5px 0; font-size: 14px; color: #555; }
              .receipt-items { margin-bottom: 20px; }
              .receipt-item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 16px; }
              .receipt-total { border-top: 2px dashed #ccc; padding-top: 15px; margin-top: 15px; text-align: right; }
              .receipt-total h3 { margin: 0; font-size: 20px; }
              .printable-receipt > p:last-child { text-align: center; margin-top: 20px; font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="printable-receipt">
              ${printContent.innerHTML}
            </div>
          </body>
        </html>
      `);
      WindowPrt.document.close();
      WindowPrt.focus();
      setTimeout(() => {
        WindowPrt.print();
        WindowPrt.close();
      }, 250);
    }
  }

  getImage(product: MenuItem): string {
    if (product.imageUrl && product.imageUrl.trim() !== '') return product.imageUrl;
    const categoryName = this.menuService.getCategoryName(product.categoryID);
    if (categoryName === 'Food') return 'assets/images/placeholder_food_1768939673576.png';
    if (categoryName === 'Beverage') return 'assets/images/placeholder_beverage_1768939693526.png';
    if (categoryName === 'Dessert') return 'assets/images/placeholder_dessert_1768939709010.png';
    return 'assets/images/placeholder_food_1768939673576.png'; // fallback
  }
}
