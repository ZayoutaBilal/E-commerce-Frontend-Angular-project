import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category/category.module';
import {StorageService} from "./storage.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiURL = environment.apiUrl;
  private headers : HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient, private storage: StorageService) {
    this.storage.getToken().subscribe((token) => {
      token ? this.headers = new HttpHeaders({ Authorization: `Bearer ${token}` })
        : this.headers = new HttpHeaders();
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiURL}/user/categories/get-categories`,{headers : this.headers});
  }

  getAllCategoriesForCustomerService(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/customer-service/categories`,{headers : this.headers});
  }

  deleteCategory(categoryId : number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(`${this.apiURL}/customer-service/categories`, {
      headers: this.headers,
      observe: 'response',
      responseType: 'text' as 'json',
      params: { categoryId: categoryId }
    });
  }

  addCategory(name:string,description:string,parentCategoryId:number,image? : File): Observable<HttpResponse<any>> {
    const formData = new FormData();
    if(image) formData.append('image',image);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('parentCategoryId', parentCategoryId.toString());
    return this.http.post<any>(`${this.apiURL}/customer-service/categories`, formData, {
      headers: this.headers,
      observe: 'response',
    });
  }

  updateCategory(categoryId:number,name:string,description:string,parentCategoryId:number,image? : File): Observable<HttpResponse<string>> {
    const formData = new FormData();
    if(image) formData.append('image',image);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('parentCategoryId', parentCategoryId.toString());
    formData.append('categoryId', categoryId.toString());
    return this.http.put<string>(`${this.apiURL}/customer-service/categories`, formData, {
      headers: this.headers,
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }






}
