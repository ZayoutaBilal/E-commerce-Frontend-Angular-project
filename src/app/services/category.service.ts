import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category/category.module';
import {StorageService} from "./storage.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiURL = environment.apiUrl;
  private token = this.storage.getItem('token');
  private readonly headers : HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient,
              private storage : StorageService
  ){
    if(this.token){
      this.headers = this.headers.append('Authorization', `Bearer ${this.token}`);
    }
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiURL}/user/categories/get-categories`,{headers : this.headers});
  }

  getAllCategoriesForCustomerService(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/customer-service/categories/get`,{headers : this.headers});
  }

  deleteCategory(categoryId : number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(`${this.apiURL}/customer-service/categories/delete`, {
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
    return this.http.post<any>(`${this.apiURL}/customer-service/categories/add`, formData, {
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
    return this.http.put<string>(`${this.apiURL}/customer-service/categories/update`, formData, {
      headers: this.headers,
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }






}
