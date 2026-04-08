import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { InventoryItem } from '../../../core/models/core-models';

@Component({
  selector: 'app-inventory-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit' : 'Add' }} Inventory Item</h2>
    <form [formGroup]="inventoryForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-column">
          <mat-form-field appearance="outline">
            <mat-label>Item Name</mat-label>
            <input matInput formControlName="name" placeholder="e.g. Milk">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Quantity</mat-label>
            <input matInput type="number" formControlName="quantity">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Unit</mat-label>
            <input matInput formControlName="unit" placeholder="kg, liters, pcs">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Reorder Level</mat-label>
            <input matInput type="number" formControlName="reorderLevel">
          </mat-form-field>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="inventoryForm.invalid">
            {{ data ? 'Save' : 'Add' }} Item
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-column {
      display: flex;
      flex-direction: column;
      gap: 15px;
      min-width: 300px;
    }
    mat-form-field { width: 100%; }
  `]
})
export class InventoryDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<InventoryDialogComponent>);
  protected data = inject<InventoryItem | null>(MAT_DIALOG_DATA, { optional: true });

  inventoryForm = this.fb.group({
    name: [this.data?.name || '', Validators.required],
    quantity: [this.data?.quantity || 0, [Validators.required, Validators.min(0)]],
    unit: [this.data?.unit || 'kg', Validators.required],
    reorderLevel: [this.data?.reorderLevel || 5, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    // Initialized in fb.group now, but keeping for reference or complex patching
  }

  onSubmit() {
    if (this.inventoryForm.valid) {
      this.dialogRef.close(this.inventoryForm.value);
    }
  }
}
