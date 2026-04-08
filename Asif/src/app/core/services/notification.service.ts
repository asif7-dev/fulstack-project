import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private snackBar = inject(MatSnackBar);

    success(message: string) {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });
    }

    error(message: string) {
        this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });
    }

    info(message: string) {
        this.snackBar.open(message, 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
        });
    }
}
