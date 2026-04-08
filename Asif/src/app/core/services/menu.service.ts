import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem, Category, RecipeIngredient, RecipeIngredientRequest } from '../models/core-models';
import { NotificationService } from './notification.service';
import { tap, catchError, of, forkJoin, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private notification = inject(NotificationService);
  private apiUrl = 'http://localhost:8080/api/menu-items';
  private categoryUrl = 'http://localhost:8080/api/categories';
  private recipeUrl = 'http://localhost:8080/api/recipes';

  private _products = signal<MenuItem[]>([]);
  readonly products = this._products.asReadonly();

  private _categories = signal<Category[]>([]);
  readonly categories = this._categories.asReadonly();
  private _recipeConfigured = signal<Record<string, boolean>>({});

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    forkJoin({
        categories: this.http.get<Category[]>(this.categoryUrl).pipe(
            catchError(err => {
                console.error("Backend unreachable for categories, falling back to defaults", err);
                return of([
                    { categoryID: '1', categoryName: 'Coffee' },
                    { categoryID: '2', categoryName: 'Tea' },
                    { categoryID: '3', categoryName: 'Pastries' },
                    { categoryID: '4', categoryName: 'Sandwiches' }
                ] as Category[]);
            })
        ),
        menuItems: this.http.get<any[]>(this.apiUrl).pipe(
            catchError(err => {
                console.error("Backend unreachable for menu items, falling back to empty list", err);
                return of([]);
            })
        )
    }).subscribe({
        next: (data) => {
            if (data.categories.length === 0) {
               data.categories = [
                    { categoryID: '1', categoryName: 'Coffee' },
                    { categoryID: '2', categoryName: 'Tea' },
                    { categoryID: '3', categoryName: 'Pastries' },
                    { categoryID: '4', categoryName: 'Sandwiches' }
                ];
            }
            this._categories.set(data.categories);
            
            // Map the backend MenuItem which has { category: Category } into frontend interface with categoryID
            const mappedProducts = data.menuItems.map(p => ({
                ...p,
                categoryID: p.category?.categoryID || p.categoryID, // fallback just in case
                imageUrl: p.imageUrl || this.getKnownImage(p.name, p.category?.categoryID || p.categoryID)
            }));
            
            this._products.set(mappedProducts);
            this.loadRecipeConfigurationFlags(mappedProducts.map((p: MenuItem) => p.menuItemID));
        },
        error: () => this.notification.error('Failed to load menu data')
    });
  }

  private loadRecipeConfigurationFlags(menuItemIDs: string[]) {
    if (!menuItemIDs.length) {
      this._recipeConfigured.set({});
      return;
    }

    const checks = menuItemIDs.map(id =>
      this.getRecipe(id).pipe(
        map(recipe => ({ id, hasRecipe: recipe.length > 0 })),
        catchError(() => of({ id, hasRecipe: false }))
      )
    );

    forkJoin(checks).subscribe(results => {
      const flags: Record<string, boolean> = {};
      results.forEach(r => { flags[r.id] = r.hasRecipe; });
      this._recipeConfigured.set(flags);
    });
  }

  private getKnownImage(name: string, categoryID: string): string {
    if (!name) return 'assets/images/placeholder_food_1768939673576.png';
    // Specific item images
    if (name === 'Espresso') return 'assets/images/espresso_coffee_1768937965452.png';
    if (name === 'Cappuccino' || name === 'Latte') return 'assets/images/latte_real.jpg';
    if (name === 'Green Tea') return 'assets/images/tea_image.png';
    if (name === 'Croissant') return 'assets/images/croissant_pastry_1768937982423.png';
    if (name === 'Club Sandwich' || name === 'Sandwich') return 'assets/images/sandwich_real.jpg';

    // Category defaults
    switch (categoryID) {
      case '1': return 'assets/images/espresso_coffee_1768937965452.png'; // Coffee
      case '2': return 'assets/images/tea_image.png'; // Tea
      case '3': return 'assets/images/croissant_pastry_1768937982423.png'; // Pastries
      case '4': return 'assets/images/sandwich_real.jpg'; // Sandwiches
      default: return 'assets/images/placeholder_food_1768939673576.png';
    }
  }

  addProduct(product: Omit<MenuItem, 'menuItemID'>): Observable<MenuItem> {
    const { categoryID, ...rest } = product as any;
    const backendPayload = {
        ...rest,
        category: { categoryID: product.categoryID }, // map to nested object expected by backend
        imageUrl: product.imageUrl || this.getKnownImage(product.name, product.categoryID!)
    };
    
    return this.http.post<any>(this.apiUrl, backendPayload).pipe(
        tap(p => {
            const mapped = {
                ...p,
                categoryID: p.category?.categoryID || p.categoryID
            };
            this._products.update(products => [...products, mapped]);
            this.notification.success('Product added successfully');
        }),
        catchError(err => {
            console.error("Failed to add product:", err);
            this.notification.error('Failed to add product');
            return throwError(() => err);
        })
    );
  }

  updateProduct(id: string, updates: Partial<MenuItem>): Observable<MenuItem> {
    const existing = this._products().find(p => p.menuItemID === id);
    if (!existing) {
      return throwError(() => new Error('Product not found'));
    }

    const { categoryID, ...restUpdates } = updates as any;
    const payloadUpdates: any = { ...restUpdates };
    
    if (updates.categoryID) {
        payloadUpdates.category = { categoryID: updates.categoryID };
    }

    const { categoryID: existingCatId, ...existingRest } = existing as any;

    return this.http.put<any>(`${this.apiUrl}/${id}`, { ...existingRest, ...payloadUpdates }).pipe(
        tap(p => {
            const mapped = {
                ...p,
                categoryID: p.category?.categoryID || p.categoryID
            };
            this._products.update(products => products.map(item => item.menuItemID === id ? mapped : item));
            this.notification.success('Product updated successfully');
        }),
        catchError(err => {
            console.error("Failed to update product:", err);
            this.notification.error('Failed to update product');
            return throwError(() => err);
        })
    );
  }

  deleteProduct(id: string) {
    this.http.delete(`${this.apiUrl}/${id}`).pipe(
        tap(() => {
            this._products.update(products => products.filter(p => p.menuItemID !== id));
            this.notification.success('Product deleted');
        }),
        catchError(err => {
            this.notification.error('Failed to delete product');
            return of(null);
        })
    ).subscribe();
  }

  getProduct(id: string): MenuItem | undefined {
    return this._products().find(p => p.menuItemID === id);
  }

  getCategoryName(categoryId: string): string {
    return this._categories().find(c => c.categoryID === categoryId)?.categoryName || 'Unknown';
  }

  isRecipeConfigured(menuItemID: string): boolean {
    return this._recipeConfigured()[menuItemID] === true;
  }

  getRecipe(menuItemID: string): Observable<RecipeIngredient[]> {
    return this.http.get<any[]>(`${this.recipeUrl}/menu/${menuItemID}`).pipe(
      map(rows => rows.map((row: any) => ({
        recipeID: row.recipeID,
        menuItemID: row.menuItem?.menuItemID ?? menuItemID,
        inventoryItemID: row.inventoryItem?.inventoryItemID ?? row.inventoryItemID,
        ingredientQuantity: row.ingredientQuantity,
        inventoryItem: row.inventoryItem
      } as RecipeIngredient))),
      catchError(err => {
        this.notification.error('Failed to load recipe');
        return of([]);
      })
    );
  }

  replaceRecipe(menuItemID: string, ingredients: RecipeIngredientRequest[]): Observable<RecipeIngredient[]> {
    return this.http.post<any[]>(`${this.recipeUrl}`, { menuItemID, ingredients }).pipe(
      map(rows => rows.map((row: any) => ({
        recipeID: row.recipeID,
        menuItemID: row.menuItem?.menuItemID ?? menuItemID,
        inventoryItemID: row.inventoryItem?.inventoryItemID ?? row.inventoryItemID,
        ingredientQuantity: row.ingredientQuantity,
        inventoryItem: row.inventoryItem
      } as RecipeIngredient))),
      tap((recipe) => {
        this._recipeConfigured.update(flags => ({ ...flags, [menuItemID]: recipe.length > 0 }));
        this.notification.success('Recipe updated successfully');
      }),
      catchError(err => {
        this.notification.error('Failed to update recipe');
        return of([]);
      })
    );
  }
}
