import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId); 
   }

   setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  getItem<T>(key: string): T | null {
    if(this.isBrowser){
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
  

  removeItem(key : string){
    localStorage.removeItem(key);
  }

}
