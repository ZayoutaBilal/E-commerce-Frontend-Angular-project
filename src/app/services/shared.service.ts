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

  updateSearchQuery(searchCategory: string): void {
    this.searchCategory.next(searchCategory);
  }

  updateSelectedItem(selectedItem: string): void {
    this.selectedItem.next(selectedItem);
  }

}
