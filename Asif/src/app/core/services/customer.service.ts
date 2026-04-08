import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/core-models';
import { NotificationService } from './notification.service';
import { tap, catchError, of, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private http = inject(HttpClient);
    private notification = inject(NotificationService);
    private apiUrl = 'http://localhost:8080/api/customers';

    private _customers = signal<Customer[]>([]);
    readonly customers = this._customers.asReadonly();

    constructor() {
        this.loadCustomers();
    }

    private loadCustomers() {
        this.http.get<Customer[]>(this.apiUrl).subscribe(customers => {
            this._customers.set(customers);
        });
    }

    addCustomer(customer: Omit<Customer, 'customerID'>) {
        this.http.post<Customer>(this.apiUrl, customer).pipe(
            tap(newCustomer => {
                this._customers.update(customers => [...customers, newCustomer]);
                this.notification.success('Customer added successfully');
            }),
            catchError(err => {
                this.notification.error('Failed to add customer');
                return of(null);
            })
        ).subscribe();
    }

    updateCustomer(id: string, updates: Partial<Customer>) {
        const existing = this._customers().find(c => c.customerID === id);
        if (!existing) return;

        this.http.put<Customer>(`${this.apiUrl}/${id}`, { ...existing, ...updates }).pipe(
            tap(updatedCustomer => {
                this._customers.update(customers =>
                    customers.map(p => p.customerID === id ? updatedCustomer : p)
                );
                this.notification.success('Customer updated');
            }),
            catchError(err => {
                this.notification.error('Failed to update customer');
                return of(null);
            })
        ).subscribe();
    }

    getCustomer(id: string): Customer | undefined {
        return this._customers().find(c => c.customerID === id);
    }
}
