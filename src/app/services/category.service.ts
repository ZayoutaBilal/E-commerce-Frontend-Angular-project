import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category/category.module';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiURL = 'http://localhost:8080';

  private headers = new HttpHeaders({ 'Content-Type': 'application/json'});
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiURL}/user/categories/get-categories`,{headers : this.headers});
  }






}
