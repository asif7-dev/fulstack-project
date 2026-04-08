import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="auth-container">
      <div class="login-wrapper">
        <mat-card class="login-card">
          <mat-card-header>
            <div class="header-content">
              <h1>Welcome Back</h1>
              <p>Sign in to your account</p>
            </div>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="w-full custom-field">
                <mat-label>Username</mat-label>
                <mat-icon matPrefix>person</mat-icon>
                <input matInput formControlName="username" placeholder="admin or staff">
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full custom-field">
                <mat-label>Password</mat-label>
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput type="password" formControlName="password">
              </mat-form-field>

              <button mat-raised-button color="primary" class="login-btn" type="submit" [disabled]="loginForm.invalid">
                LOG IN
              </button>
            </form>
            <div class="hints">
              <span class="pill">admin / admin123</span>
              <span class="pill">staff / staff123</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f1f5f9;
    }
    .login-wrapper {
      width: 100%;
      max-width: 400px;
      padding: 24px;
    }
    .login-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 32px 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header-content {
      text-align: center;
      width: 100%;
      margin-bottom: 32px;
    }
    h1 {
      color: #0f172a;
      font-size: 1.75rem;
      font-weight: 600;
      margin: 0;
    }
    p { color: #64748b; margin-top: 8px; }
    .custom-field { margin-bottom: 16px; }
    .login-btn {
      width: 100%;
      padding: 12px;
      font-size: 1rem;
      font-weight: 500;
      border-radius: 8px;
      margin-top: 16px;
      height: 48px;
    }
    .hints {
      margin-top: 32px;
      display: flex;
      justify-content: center;
      gap: 12px;
    }
    .pill {
      background: #f1f5f9;
      padding: 6px 12px;
      border-radius: 6px;
      color: #475569;
      font-size: 0.813rem;
      font-weight: 500;
    }
    mat-card-header { display: block; }
  `]
})
export class LoginComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username!, password!).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.snackBar.open('Invalid credentials', 'Close', { duration: 3000 });
          }
        },
        error: (err) => {
          this.snackBar.open('Login failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
