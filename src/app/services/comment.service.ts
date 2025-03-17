import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {StorageService} from "./storage.service";
import {Observable} from "rxjs";
import {ProductComment} from "../models/comment/comment.module";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiURL = environment.apiUrl;
  private headers : HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient, private storage: StorageService) {
    this.storage.getToken().subscribe((token) => {
      token ? this.headers = new HttpHeaders({ Authorization: `Bearer ${token}` })
        : this.headers = new HttpHeaders();
    });
  }

  getComments(productId: number, isApproved:boolean): Observable<HttpResponse<ProductComment[]>> {
    let params : HttpParams = new HttpParams().set('isApproved', isApproved);
    return this.http.get<ProductComment[]>(`${this.apiURL}/customer-service/comments/${productId}`,{headers : this.headers,params : params,observe: 'response'});
  }

  approveComment(commentId: number): Observable<HttpResponse<string>> {
    return this.http.put<string>(`${this.apiURL}/customer-service/comments/${commentId}/approve`, null,{headers : this.headers,observe: 'response',responseType: 'text' as 'json'});
  }

  deleteComment(commentId: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(`${this.apiURL}/customer-service/comments/${commentId}`,{headers : this.headers,observe: 'response',responseType: 'text' as 'json'});
  }
}
