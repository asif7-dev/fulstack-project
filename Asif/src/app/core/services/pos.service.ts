import { Injectable, signal, computed } from '@angular/core';
import { MenuItem, TransactionDetail, Customer } from '../models/core-models';
import { NotificationService } from './notification.service';
import { OrderService } from './order.service';
import { AuthService } from './auth.service';
import { InventoryService } from './inventory.service';

interface CartItem {
    product: MenuItem;
    quantity: number;
    subtotal: number;
}

@Injectable({
    providedIn: 'root'
})
export class PosService {
    private _cart = signal<CartItem[]>([]);
    readonly cart = this._cart.asReadonly();

    private _selectedCustomer = signal<Customer | null>(null);
    readonly selectedCustomer = this._selectedCustomer.asReadonly();

    readonly totalCHECKOUT = computed(() =>
        this._cart().reduce((total, item) => total + item.subtotal, 0)
    );

    constructor(
        private notification: NotificationService,
        private orderService: OrderService,
        private authService: AuthService,
        private inventoryService: InventoryService
    ) { }

    selectCustomer(customer: Customer | null) {
        this._selectedCustomer.set(customer);
    }

    addToCart(product: MenuItem) {
        this._cart.update(items => {
            const existing = items.find(i => i.product.menuItemID === product.menuItemID);
            if (existing) {
                return items.map(i => i.product.menuItemID === product.menuItemID
                    ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.product.price }
                    : i);
            }
            return [...items, { product, quantity: 1, subtotal: product.price }];
        });
    }

    removeFromCart(productId: string) {
        this._cart.update(items => items.filter(i => i.product.menuItemID !== productId));
    }

    updateQuantity(productId: string, quantity: number) {
        if (quantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        this._cart.update(items =>
            items.map(i => i.product.menuItemID === productId
                ? { ...i, quantity, subtotal: quantity * i.product.price }
                : i
            )
        );
    }

    clearCart() {
        this._cart.set([]);
        this._selectedCustomer.set(null);
    }

    checkout(paymentMethod: 'cash' | 'card') {
        if (this._cart().length === 0) {
            this.notification.error('Cart is empty');
            return;
        }

        const details: TransactionDetail[] = this._cart().map(item => ({
            transactionDetailID: Math.random().toString(36).substr(2, 9),
            transactionID: '', // Set by OrderService
            menuItemID: item.product.menuItemID,
            quantity: item.quantity,
            price: item.product.price
        }));

        const userID = this.authService.currentUser()?.userID || 'unknown-user';
        const customerID = this._selectedCustomer()?.customerID || 'walk-in';

        this.orderService.createOrder(details, userID, customerID).subscribe({
            next: (transaction) => {
                console.log('Processed Transaction:', transaction, details);
                this.inventoryService.refreshInventory();
                this.notification.success('Transaction processed successfully!');
                this.clearCart();
            },
            error: () => {
                // Error notifications are handled by OrderService.
            }
        });
    }
}
