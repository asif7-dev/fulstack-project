import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem, ProductDialogResult, RecipeIngredientRequest } from '../../../core/models/core-models';
import { MenuService } from '../../../core/services/menu.service';
import { InventoryService } from '../../../core/services/inventory.service';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Add' }} Product</h2>
    <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-column">
          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" placeholder="Product Name">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="categoryID">
              <mat-option *ngFor="let cat of menuService.categories()" [value]="cat.categoryID">
                {{cat.categoryName}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Price</mat-label>
            <input matInput type="number" formControlName="price">
            <span matTextPrefix>$&nbsp;</span>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Image URL</mat-label>
            <input matInput formControlName="imageUrl" placeholder="https://...">
            <mat-hint>Leave blank for category default</mat-hint>
          </mat-form-field>

          <div class="image-preview" *ngIf="productForm.get('imageUrl')?.value">
            <img [src]="productForm.get('imageUrl')?.value" alt="Preview">
          </div>

          <mat-checkbox formControlName="isAvailable">Available</mat-checkbox>

          <div class="recipe-section">
            <h3>Recipe (for 1 quantity)</h3>
            <div formArrayName="recipeIngredients" class="ingredient-list">
              <div *ngFor="let ingredient of recipeIngredients.controls; let i = index" [formGroupName]="i" class="ingredient-row">
                <mat-form-field appearance="outline">
                  <mat-label>Ingredient</mat-label>
                  <mat-select formControlName="inventoryItemID">
                    <mat-option *ngFor="let item of inventoryService.inventory()" [value]="item.inventoryItemID">
                      {{item.name}} ({{item.baseUnit || item.unit || '-'}})
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Qty Required</mat-label>
                  <input matInput type="number" min="0.01" step="0.01" formControlName="ingredientQuantity">
                  <mat-hint>Use base unit (gram/ml)</mat-hint>
                </mat-form-field>

                <button mat-icon-button color="warn" type="button" (click)="removeIngredient(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>

            <button mat-stroked-button type="button" (click)="addIngredient()">
              <mat-icon>add</mat-icon> Add Ingredient
            </button>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="productForm.invalid || recipeIngredients.length === 0">Save</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-column {
      display: flex;
      flex-direction: column;
      gap: 15px;
      min-width: 400px;
    }
    mat-form-field { width: 100%; }
    .image-preview {
      width: 100%;
      height: 150px;
      border: 1px solid #ccc;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
    }
    .image-preview img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .recipe-section {
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
    }
    .recipe-section h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      font-weight: 600;
    }
    .ingredient-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 10px;
    }
    .ingredient-row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 10px;
      align-items: center;
    }
  `]
})
export class ProductDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProductDialogComponent>);
  menuService = inject(MenuService);
  inventoryService = inject(InventoryService);
  data = inject<MenuItem | null>(MAT_DIALOG_DATA);

  productForm = this.fb.group({
    name: [this.data?.name || '', Validators.required],
    categoryID: [this.data?.categoryID || null, Validators.required],
    price: [this.data?.price || 0, [Validators.required, Validators.min(0)]],
    description: [this.data?.description || ''],
    imageUrl: [this.data?.imageUrl || ''],
    isAvailable: [this.data?.isAvailable ?? true],
    recipeIngredients: this.fb.array([])
  });

  constructor() {
    if (!this.data) {
      this.addIngredient();
      return;
    }

    this.menuService.getRecipe(this.data.menuItemID).subscribe(recipe => {
      if (recipe.length === 0) {
        this.addIngredient();
        return;
      }

      recipe.forEach(r => {
        this.recipeIngredients.push(this.fb.group({
          inventoryItemID: [r.inventoryItemID, Validators.required],
          ingredientQuantity: [r.ingredientQuantity, [Validators.required, Validators.min(0.01)]]
        }));
      });
    });
  }

  get recipeIngredients(): FormArray {
    return this.productForm.get('recipeIngredients') as FormArray;
  }

  addIngredient() {
    this.recipeIngredients.push(this.fb.group({
      inventoryItemID: [null, Validators.required],
      ingredientQuantity: [0, [Validators.required, Validators.min(0.01)]]
    }));
  }

  removeIngredient(index: number) {
    this.recipeIngredients.removeAt(index);
  }

  onSubmit() {
    if (this.productForm.valid) {
      const { recipeIngredients, ...product } = this.productForm.value as any;
      const result: ProductDialogResult = {
        product,
        recipeIngredients: (recipeIngredients || []).filter((r: RecipeIngredientRequest) =>
          !!r.inventoryItemID && !!r.ingredientQuantity && r.ingredientQuantity > 0
        )
      };
      this.dialogRef.close(result);
    }
  }
}
