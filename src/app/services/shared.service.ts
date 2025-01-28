import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private searchCategory = new BehaviorSubject<string>('');
  searchCategory$ = this.searchCategory.asObservable();

  private selectedItem = new BehaviorSubject<string>('categories');
  selectedItem$ = this.selectedItem.asObservable();

  private productIdEditing = new BehaviorSubject<number>(0);
  productIdEditing$ = this.productIdEditing.asObservable();

  updateSearchQuery(searchCategory: string): void {
    this.searchCategory.next(searchCategory);
  }

  updateSelectedItem(selectedItem: string): void {
    this.selectedItem.next(selectedItem);
  }

  updateProductIdEditing(id: number): void {
    this.productIdEditing.next(id);
  }


}
