import { Injectable } from '@angular/core';
import { ProductCart } from '../models/product-cart/product-cart.module';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { ProductToCartModule } from '../models/product-to-cart/product-to-cart.module';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiURL = 'http://localhost:8080';

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
    return this.http.get<ProductCart[]>(`${this.apiURL}/customer/cart/get-products-from-cart`, { headers : this.headersWithToken });
  }

  getCartItemsLength(): Observable<HttpResponse<number>> {
    return this.http.get<number>(`${this.apiURL}/customer/cart/get-cart-length`, {
      headers: this.headersWithToken,
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }

  removeItemFromCartItem(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(`${this.apiURL}/customer/cart/delete-item-from-cart`, {
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
    return this.http.put<string>(`${this.apiURL}/customer/cart/update-item-quantity`, body,{
        headers: this.headersWithToken,
        observe: 'response',
        responseType: 'text' as 'json'
    });
  }

  addProductToCart(product : ProductToCartModule) : Observable<HttpResponse<string>>{
    return this.http.post<string>(`${this.apiURL}/customer/cart/add-item-to-cart`, product,{
      headers: this.headersWithToken,
      observe: 'response',
      responseType: 'text' as 'json'
  });
  }

  
}
