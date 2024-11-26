import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private searchCategory = new BehaviorSubject<string>('');
  searchCategory$ = this.searchCategory.asObservable();

  updateSearchQuery(query: string): void {
    this.searchCategory.next(query);
  }
}
