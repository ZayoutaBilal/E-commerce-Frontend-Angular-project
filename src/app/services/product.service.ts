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

@Injectable({
  providedIn: 'root'
})
export class ProductService {

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
    return this.http.get<Page<ProductOverview>>('http://localhost:8080/customer/products/all-for-customer',{headers : this.headersWithToken , params : params });
  }
}
