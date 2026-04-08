import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  getData<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  setData(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeData(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
