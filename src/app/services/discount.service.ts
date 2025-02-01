import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {StorageService} from "./storage.service";
import {Observable} from "rxjs";
import {DiscountOverviewModule} from "../models/discount-overview/discount-overview.module";

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private apiURL = environment.apiUrl;
  private headers : HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient, private storage: StorageService) {
    this.storage.getToken().subscribe((token) => {
      token ? this.headers = new HttpHeaders({ Authorization: `Bearer ${token}` })
        : this.headers = new HttpHeaders();
    });
  }

  getAllCategoriesAndAllDiscounts():Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.apiURL}/customer-service/categories-discounts`,{headers : this.headers,observe: 'response'});
  }

  getAllDiscounts(isEnded : boolean,all : boolean):Observable<HttpResponse<DiscountOverviewModule[]>> {
    let params = new HttpParams();
    params = params.set('isEnded', isEnded);
    params = params.set('all', all);
    return this.http.get<DiscountOverviewModule[]>(`${this.apiURL}/customer-service/discounts`,{headers : this.headers,params : params,observe: 'response'});
  }

}
