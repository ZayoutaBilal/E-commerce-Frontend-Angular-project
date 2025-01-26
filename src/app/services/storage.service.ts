import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductCart } from '../models/product-cart/product-cart.module';
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser: boolean;
  private cartLengthKey = 'cartLength';
  private cartLengthSubject = new BehaviorSubject<number>(0);

  cartLength$ = this.cartLengthSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);


    if (this.isBrowser) {
      const cartItemsLength = this.getItem<number>(this.cartLengthKey) || 0;
      this.cartLengthSubject.next(cartItemsLength);
    }
  }

  setItem(key: string, value: any): void {
    if (this.isBrowser) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getItem<T>(key: string): T | null {
    if (this.isBrowser) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          return JSON.parse(item) as T;
        } catch (error) {
          console.error('Error parsing JSON from localStorage:', error);
          return null;
        }
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  getToken(): string | null {
    return this.getItem(environment.tokenName);
  }

  setToken(value : any): void {
    this.setItem(environment.tokenName,value);
  }

  removeToken(): void {
    this.removeItem(environment.tokenName);
  }


  setCartLength(length: number): void {
    if (this.isBrowser) {
      this.setItem(this.cartLengthKey, length);
      this.cartLengthSubject.next(length);
    }
  }


  getCartLength(): number {
    return this.cartLengthSubject.value;
  }
}
