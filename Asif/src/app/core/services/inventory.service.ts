import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InventoryItem } from '../models/core-models';
import { NotificationService } from './notification.service';
import { tap, catchError, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private http = inject(HttpClient);
    private notification = inject(NotificationService);
    private apiUrl = 'http://localhost:8080/api/inventory';

    private _inventory = signal<InventoryItem[]>([]);
    readonly inventory = this._inventory.asReadonly();

    constructor() {
        this.loadInventory();
    }

    refreshInventory() {
        this.loadInventory();
    }

    private loadInventory() {
        this.http.get<InventoryItem[]>(this.apiUrl).subscribe({
            next: (items) => this._inventory.set(items),
            error: () => this.notification.error('Failed to load inventory')
        });
    }

    addItem(item: Omit<InventoryItem, 'inventoryItemID'>) {
        this.http.post<InventoryItem>(this.apiUrl, item).pipe(
            tap(newItem => {
                this._inventory.update(items => [...items, newItem]);
                this.notification.success('Inventory item added');
            }),
            catchError(err => {
                this.notification.error('Failed to add inventory item');
                return of(null);
            })
        ).subscribe();
    }

    updateItem(id: string, updates: Partial<InventoryItem>) {
        const existing = this._inventory().find(i => i.inventoryItemID === id);
        if (!existing) return;
        this.http.put<InventoryItem>(`${this.apiUrl}/${id}`, { ...existing, ...updates }).pipe(
            tap(updatedItem => {
                this._inventory.update(items => items.map(p => p.inventoryItemID === id ? updatedItem : p));
                this.notification.success('Inventory updated');
            }),
            catchError(err => {
                this.notification.error('Failed to update inventory item');
                return of(null);
            })
        ).subscribe();
    }

    // Compatibility Alias
    updateItemDetails(id: string, updates: Partial<InventoryItem>) {
        this.updateItem(id, updates);
    }

    // Compatibility Alias
    updateStock(id: string, quantityChange: number) {
        const item = this._inventory().find(i => i.inventoryItemID === id);
        if (item) {
            this.updateItem(id, { quantity: item.quantity + quantityChange });
        }
    }

    restockItem(id: string, quantity: number) {
        this.updateStock(id, quantity);
        this.notification.success(`Restocking requested`);
    }

    deductStock(id: string, quantity: number) {
        this.updateStock(id, -quantity);
    }

    deleteItem(id: string) {
        this.http.delete(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                this._inventory.update(items => items.filter(item => item.inventoryItemID !== id));
                this.notification.success('Item removed from inventory');
            }),
            catchError(err => {
                this.notification.error('Failed to delete inventory item');
                return of(null);
            })
        ).subscribe();
    }

    checkLowStock(): InventoryItem[] {
        return this._inventory().filter(i => i.quantity <= i.reorderLevel);
    }
}
