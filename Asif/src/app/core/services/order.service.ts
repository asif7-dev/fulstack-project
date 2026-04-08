import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionDetail, DashboardStats } from '../models/core-models';
import { NotificationService } from './notification.service';
import { tap, catchError, throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private notification = inject(NotificationService);
  private apiUrl = 'http://localhost:8080/api/orders';

  private _transactions = signal<Transaction[]>([]);
  readonly transactions = this._transactions.asReadonly();

  readonly transactionDetails = computed(() => {
    return this._transactions().reduce((acc, tx) => {
      if (tx.details) {
        return [...acc, ...tx.details];
      }
      return acc;
    }, [] as TransactionDetail[]);
  });

  constructor() {
    this.loadOrders();
  }

  private loadOrders() {
    this.http.get<Transaction[]>(this.apiUrl).subscribe({
        next: (orders) => this._transactions.set(orders),
        error: () => this.notification.error('Failed to load orders')
    });
  }

  createOrder(details: TransactionDetail[], userID: string, customerID: string = 'walk-in'): Observable<any> {
    const payload: any = {
      userID: userID,
      customerID: customerID,
      items: details.map(d => ({
        menuItemID: d.menuItemID,
        quantity: d.quantity
      }))
    };

    return this.http.post<any>(this.apiUrl, payload).pipe(
        tap((newTransaction) => {
            this.loadOrders();
        }),
        catchError(err => {
            const message = err?.error?.message || 'Failed to place order';
            this.notification.error(message);
            return throwError(() => err);
        })
    );
  }

  getDashboardStats(): DashboardStats {
    const orders = this._transactions();
    const today = new Date().toDateString();

    const todaysOrders = orders.filter(o => new Date(o.date).toDateString() === today);
    const totalRevenue = todaysOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalRevenue,
      totalOrders: todaysOrders.length,
      activeOrders: 0,
      bestSeller: 'N/A'
    };
  }
}
