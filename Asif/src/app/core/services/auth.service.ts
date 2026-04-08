import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/core-models';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storage = inject(StorageService);
  private router = inject(Router);
  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  constructor() {
    // Load from local storage if exists
    const stored = this.storage.getData<User>('user');
    if (stored) {
      this._currentUser.set(stored);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      // Mock credential check
      let role: 'admin' | 'staff' | null = null;

      if (username === 'admin' && password === 'admin123') role = 'admin';
      else if (username === 'staff' && password === 'staff123') role = 'staff';

      if (role) {
        const user: User = {
          userID: Math.random().toString(36).substr(2, 9),
          userName: username,
          role
        };
        this._currentUser.set(user);
        localStorage.setItem('user', JSON.stringify(user));
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  logout() {
    this._currentUser.set(null);
    this.storage.removeData('user');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this._currentUser();
  }
}
