import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { StorageService } from './storage.service';
import { ProductOverview } from '../models/product-overview/product-overview.module';
import { Page } from '../models/page/page.module';
import { ColorSizeQuantityCombination, ProductDetailsModule } from '../models/product-details/product-details.module';
import {environment} from "../../environments/environment";
import {GetProductModule} from "../models/product-management/get-product.module";
import {CreateProductModule} from "../models/product-management/create-product.module";
import {UpdateProductModule} from "../models/product-management/update-product.module";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiURL = environment.apiUrl;
  private headers : HttpHeaders = new HttpHeaders();


  constructor(private http: HttpClient, private storage: StorageService) {
    this.storage.getToken().subscribe((token) => {
      token ? this.headers = new HttpHeaders({ Authorization: `Bearer ${token}` })
        : this.headers = new HttpHeaders();
    });
  }

  getAllForCustomer(page: number): Observable<Page<ProductOverview>> {
    const params = new HttpParams().set('page', page);
    return this.http.get<Page<ProductOverview>>(`${this.apiURL}/customer/products/all-for-customer`,{headers : this.headers , params : params });
  }

  getRecommendationsForNewUser(page: number): Observable<Page<ProductOverview>>{
    return this.http.get<Page<ProductOverview>>(`${this.apiURL}/user/products/new-user?page=${page}`);
  }

  getRecentProducts(): Observable<Page<ProductOverview>> {
    return this.http.get<Page<ProductOverview>>(`${this.apiURL}/user/products/recent`,{headers : this.headers });
  }

  getMostLikedProducts(): Observable<Page<ProductOverview>> {
    return this.http.get<Page<ProductOverview>>(`${this.apiURL}/user/products/most-liked`,{headers : this.headers });
  }

  getProductByCategory(categoryName : string,origin : string,page: number): Observable<Page<ProductOverview>> {
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
    return this.http.post<string>(`${this.apiURL}/customer/products/rate-and-comment`,productRating,{headers : this.headers, observe: 'response', responseType: 'text' as 'json' });
  }

  addProduct(product: CreateProductModule, images: File[]): Observable<HttpResponse<string>> {
    const formData = new FormData();
    formData.append('createProduct', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    images.forEach((image) => {
      formData.append('files', image);
    });
    return this.http.post<string>(`${this.apiURL}/customer-service/products`, formData, {
      headers: this.headers,
      observe: 'response',
      responseType : 'text' as 'json'
    });
  }

  updateProduct(product: UpdateProductModule, images: File[]): Observable<HttpResponse<string>> {
    const form = new FormData();
    form.append('updateProduct', new Blob([JSON.stringify(product)], { type: 'application/json' }));
    images.forEach((image) => {
      form.append('files', image);
    });
    return this.http.put<string>(`${this.apiURL}/customer-service/products`, form, {
      headers: this.headers,
      observe: 'response',
      responseType : 'text' as 'json'
    });
  }

  getProducts(page: number,size : number,sortedBy? :string,order? : string): Observable<Page<any>> {
    let params = new HttpParams();
    params = params.set('size', size);
    params = params.set('page', page);
    if(sortedBy) params = params.set('sortedBy', sortedBy);
    if(order) params = params.set('order', order);
    return this.http.get<Page<any>>(`${this.apiURL}/customer-service/products`,{headers : this.headers , params : params });
  }

  deleteProduct(productId: number) : Observable<HttpResponse<string>> {
    return this.http.delete<string>(`${this.apiURL}/customer-service/products`, {
      headers: this.headers,
      observe: 'response',
      responseType: 'text' as 'json',
      params: {productId: productId}
    });
  }

  getProductForManagement(productId: number): Observable<GetProductModule> {
    return this.http.get<GetProductModule>(`${this.apiURL}/customer-service/products/${productId}`,{headers : this.headers});
  }
}
