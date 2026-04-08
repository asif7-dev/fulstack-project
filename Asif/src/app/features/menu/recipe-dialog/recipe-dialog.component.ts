import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MenuService } from '../../../core/services/menu.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { MenuItem, RecipeIngredientRequest } from '../../../core/models/core-models';

@Component({
  selector: 'app-recipe-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Recipe: {{ data.name }}</h2>
    <form [formGroup]="recipeForm" (ngSubmit)="onSave()">
      <mat-dialog-content>
        <div formArrayName="ingredients" class="ingredient-list">
          <div *ngFor="let ingredient of ingredients.controls; let i = index" [formGroupName]="i" class="ingredient-row">
            <mat-form-field appearance="outline">
              <mat-label>Ingredient</mat-label>
              <mat-select formControlName="inventoryItemID">
                <mat-option *ngFor="let item of inventoryService.inventory()" [value]="item.inventoryItemID">
                  {{ item.name }} ({{ item.unit || '-' }})
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Qty per cup/item</mat-label>
              <input matInput type="number" min="0.01" step="0.01" formControlName="ingredientQuantity">
            </mat-form-field>

            <button mat-icon-button color="warn" type="button" (click)="removeIngredient(i)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <button mat-stroked-button type="button" (click)="addIngredient()">
          <mat-icon>add</mat-icon> Add Ingredient
        </button>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit">Save Recipe</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .ingredient-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 520px;
      margin-bottom: 12px;
    }
    .ingredient-row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 12px;
      align-items: center;
    }
    mat-form-field { width: 100%; }
  `]
})
export class RecipeDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RecipeDialogComponent>);
  menuService = inject(MenuService);
  inventoryService = inject(InventoryService);
  data = inject<MenuItem>(MAT_DIALOG_DATA);

  recipeForm = this.fb.group({
    ingredients: this.fb.array([])
  });

  constructor() {
    this.menuService.getRecipe(this.data.menuItemID).subscribe(existing => {
      if (existing.length === 0) {
        this.addIngredient();
        return;
      }

      existing.forEach(item => {
        this.ingredients.push(this.fb.group({
          inventoryItemID: [item.inventoryItemID, Validators.required],
          ingredientQuantity: [item.ingredientQuantity, [Validators.required, Validators.min(0.01)]]
        }));
      });
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.fb.group({
      inventoryItemID: [null, Validators.required],
      ingredientQuantity: [0, [Validators.required, Validators.min(0.01)]]
    }));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  onSave() {
    const payload: RecipeIngredientRequest[] = this.ingredients.controls
      .map(control => control.value as RecipeIngredientRequest)
      .filter(row => !!row.inventoryItemID && !!row.ingredientQuantity && row.ingredientQuantity > 0);

    this.menuService.replaceRecipe(this.data.menuItemID, payload).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
