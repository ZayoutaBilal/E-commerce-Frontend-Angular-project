import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Observable, observeOn } from 'rxjs';
import { UserDetailsModule } from '../models/user-details/user-details.module';
import {CookieService} from 'ngx-cookie-service';
import { UserInfosModule } from '../models/user-infos/user-infos.module';
import { HttpParams } from '@angular/common/http';
import { StorageService } from './storage.service';
import { ProductOverview } from '../models/product-overview/product-overview.module';
import { Page } from '../models/page/page.module';
import { ColorSizeQuantityCombination, ProductDetailsModule } from '../models/product-details/product-details.module';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiURL = 'http://localhost:8080';

  private token = this.storage.getItem('token');

  private headers = new HttpHeaders({ 'Content-Type': 'application/json'});

  private headersWithToken = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
    'Content-Type': 'application/json'
  });


  constructor(private http: HttpClient,
    private storage : StorageService
  ){ }

  getAllForCustomer(page: number): Observable<Page<ProductOverview>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<Page<ProductOverview>>(`${this.apiURL}/customer/products/all-for-customer`,{headers : this.headersWithToken , params : params });
  }

  getProductByCategpry(categoryName : string,origin : string,page: number): Observable<Page<ProductOverview>> {
    const body = {
      categoryName,origin,page
    };
    return this.http.post<Page<ProductOverview>>(`${this.apiURL}/user/products/by-category`,body,{headers : this.headers});
  }

  getProductDetails(productId: number): Observable<ProductDetailsModule> {
    const params = new HttpParams().set('productId', productId);
    return this.http.get<ProductDetailsModule>(`${this.apiURL}/user/products/product-details`,{headers : this.headers , params : params });
  }

  getProductColorSizeQuantityCombination(productId: number): Observable<ColorSizeQuantityCombination[]> {
    const params = new HttpParams().set('productId', productId);
    return this.http.get<ColorSizeQuantityCombination[]>(`${this.apiURL}/user/products/product-colors-size-quantity-combination`,{headers : this.headers , params : params });
  }

  submitFeedback(productRating:any): Observable<HttpResponse<string>> {
    return this.http.post<string>(`${this.apiURL}/customer/products/rate-and-comment`,productRating,{headers : this.headersWithToken, observe: 'response', responseType: 'text' as 'json' });
  }
}
