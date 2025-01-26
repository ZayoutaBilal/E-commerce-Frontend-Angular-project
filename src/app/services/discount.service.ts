import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {StorageService} from "./storage.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private apiURL = environment.apiUrl;
  private token = this.storage.getToken();
  private readonly headers : HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient,
              private storage : StorageService
  ){
    if(this.token){
      this.headers = this.headers.append('Authorization', `Bearer ${this.token}`);
    }
  }

  getAllCategoriesAndAllDiscounts():Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.apiURL}/customer-service/categories-discounts`,{headers : this.headers,observe: 'response',});
  }

}
