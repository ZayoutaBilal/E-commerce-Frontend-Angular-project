import { Injectable } from '@angular/core';
import { ProductCart } from '../models/product-cart/product-cart.module';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private token = this.storage.getItem('token');

  private headers = new HttpHeaders({ 'Content-Type': 'application/json'});

  private headersWithToken = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
    'Content-Type': 'application/json'
  });
  

  constructor(private http: HttpClient,
    private storage : StorageService,
  ) {}

  getCartItems(): Observable<ProductCart[]> {
    return this.http.get<ProductCart[]>('http://localhost:8080/customer/cart/get-products-from-cart', { headers : this.headersWithToken });
  }

  getCartItemsLength(): Observable<HttpResponse<number>> {
    return this.http.get<number>('http://localhost:8080/customer/cart/get-cart-length', {
      headers: this.headersWithToken,
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }

  removeItemFromCartItem(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>('http://localhost:8080/customer/cart/delete-item-from-cart', {
        headers: this.headersWithToken,
        observe: 'response',
        responseType: 'text' as 'json',
        params: { itemId: id }
    });
  }

  updateItemQuantity(itemId : number,newQuantity: number): Observable<HttpResponse<string>> {
    let body = {
      itemId,newQuantity
    };
    return this.http.put<string>('http://localhost:8080/customer/cart/update-item-quantity', body,{
        headers: this.headersWithToken,
        observe: 'response',
        responseType: 'text' as 'json'
    });
  }

  
}
