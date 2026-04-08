import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/core-models';
import { NotificationService } from './notification.service';
import { tap, catchError, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private http = inject(HttpClient);
    private notification = inject(NotificationService);
    private apiUrl = 'http://localhost:8080/api/categories';

    private _categories = signal<Category[]>([]);
    readonly categories = this._categories.asReadonly();

    constructor() {
        this.loadCategories();
    }

    private loadCategories() {
        this.http.get<Category[]>(this.apiUrl).subscribe({
            next: (categories) => {
                if (categories.length === 0) {
                   categories = [
                        { categoryID: '1', categoryName: 'Coffee' },
                        { categoryID: '2', categoryName: 'Tea' },
                        { categoryID: '3', categoryName: 'Pastries' },
                        { categoryID: '4', categoryName: 'Sandwiches' }
                    ];
                }
                this._categories.set(categories);
            },
            error: () => {
                this.notification.error('Failed to load categories');
                // Fallback for resilient UI debugging
                this._categories.set([
                    { categoryID: '1', categoryName: 'Coffee' },
                    { categoryID: '2', categoryName: 'Tea' },
                    { categoryID: '3', categoryName: 'Pastries' },
                    { categoryID: '4', categoryName: 'Sandwiches' }
                ]);
            }
        });
    }

    addCategory(name: string) {
        const newCategory = { categoryName: name };
        this.http.post<Category>(this.apiUrl, newCategory).pipe(
            tap(cat => {
                this._categories.update(cats => [...cats, cat]);
                this.notification.success('Category added');
            }),
            catchError(err => {
                this.notification.error('Failed to add category');
                return of(null);
            })
        ).subscribe();
    }

    updateCategory(id: string, name: string) {
        const existing = this._categories().find(c => c.categoryID === id);
        if (!existing) return;
        this.http.put<Category>(`${this.apiUrl}/${id}`, { ...existing, categoryName: name }).pipe(
            tap(cat => {
                this._categories.update(cats => cats.map(c => c.categoryID === id ? cat : c));
                this.notification.success('Category updated');
            }),
            catchError(err => {
                this.notification.error('Failed to update category');
                return of(null);
            })
        ).subscribe();
    }

    deleteCategory(id: string) {
        this.http.delete(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                this._categories.update(cats => cats.filter(c => c.categoryID !== id));
                this.notification.success('Category deleted');
            }),
            catchError(err => {
                this.notification.error('Failed to delete category');
                return of(null);
            })
        ).subscribe();
    }

    getCategoryName(id: string): string {
        return this._categories().find(c => c.categoryID === id)?.categoryName || 'Unknown';
    }
}
