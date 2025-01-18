import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Observable, observeOn } from 'rxjs';
import { UserDetailsModule } from '../models/user-details/user-details.module';
import {CookieService} from 'ngx-cookie-service';
import { UserInfosModule } from '../models/user-infos/user-infos.module';
import { HttpParams } from '@angular/common/http';
import { StorageService } from './storage.service';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = environment.apiUrl;

  private token = this.storage.getItem('token');

  private readonly headers : HttpHeaders = new HttpHeaders();


  constructor(private http: HttpClient,
    private storage : StorageService
  ){if(this.token){
    this.headers = this.headers.append('Authorization', `Bearer ${this.token}`);
  } }

  login(login: string, password: string): Observable<HttpResponse<UserDetailsModule>> {
    const body = { login, password };
    return this.http.post<UserDetailsModule>(`${this.apiURL}/user/login`, body, {
      headers: this.headers,
      observe: 'response'
    });
  }


  register(username: string,email: string,password: string,
    firstName: string,lastName: string,phone: string,city: string): Observable<HttpResponse<any>> {
    let body ={
      user:{
      username,
      email,
      password
    },customer:{
      firstName,
      lastName,
      phone,
      city
    }
  };
    return this.http.post<any>(`${this.apiURL}/user/signup`, body,  {  headers : this.headers, observe: 'response' ,responseType: 'text' as 'json'});
  }

  forgetpassword(email: string): Observable<HttpResponse<string>> {
    const url = `${this.apiURL}/user/forgot-password?email=${encodeURIComponent(email)}`;
    return this.http.get<string>(url, {  headers : this.headers, observe: 'response', responseType: 'text' as 'json' });
  }

  verifyCode(email: string,newPassword:string,code:string): Observable<HttpResponse<string>> {
    let body = {
      email,newPassword,code
    };
    return this.http.post<string>(`${this.apiURL}/user/verify-code`,body, {  headers : this.headers, observe: 'response', responseType: 'text' as 'json' });
  }

  confirmEmail(email: string,code:string): Observable<HttpResponse<string>> {
    let body = {
      email,code
    };
    return this.http.post<string>(`${this.apiURL}/user/confirm-email`,body, {  headers : this.headers, observe: 'response', responseType: 'text' as 'json' });
  }

  getUserInfo(): Observable<UserInfosModule> {
    return this.http.get<UserInfosModule>(`${this.apiURL}/common/account/get-user-infos`, { headers : this.headers });
  }

  checkToken():Observable<HttpResponse<string[]>> {
    return this.http.get<string[]>(`${this.apiURL}/common/check-token`,{ headers : this.headers, observe: 'response', responseType: 'text' as 'json' })
  }

  updateUserInfos( firstName : string,lastName :string,birthday : Date,gender:string,address : string,
    phone : string, city:string  ) : Observable<HttpResponse<string>>{
      let body = {
        firstName,
        lastName,
        birthday,
        gender,
        address,
        phone,
        city
      };
      return this.http.put<string>(`${this.apiURL}/common/account/update-user-infos`,body,{ headers : this.headers , observe : 'response', responseType: 'text' as 'json'})
    }

  updatePassword(  oldPassword : string , newPassword : string) : Observable<HttpResponse<string>>{
      let body = {
        oldPassword,newPassword
      };
      return this.http.put<string>(`${this.apiURL}/common/account/update-password`,body,{ headers : this.headers , observe : 'response', responseType: 'text' as 'json'})
    }

  deleteMyAccount() : Observable<HttpResponse<string>>{
    return this.http.delete<string>(`${this.apiURL}/common/account/delete-mine`,{ headers : this.headers , observe : 'response', responseType: 'text' as 'json'})
  }

  updateUsername(username: string): Observable<HttpResponse<string>> {
    const params = new HttpParams().set('username', username);
    return this.http.put<string>(`${this.apiURL}/common/account/update-username`, null, {
      headers: this.headers,
      observe: 'response',
      responseType: 'text' as 'json',
      params: params
    });
  }

  updatePicture(file: File): Observable<HttpResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.apiURL}/common/account/upload-picture`, formData, {
      headers: this.headers,
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }

  sendMessage(message : string, email : string, name : string) : Observable<HttpResponse<string>>{
    let body = {
      message,email,name
    };
    return this.http.post<string>(`${this.apiURL}/user/message/send-message`,body, {  headers : this.headers, observe: 'response', responseType: 'text' as 'json' });
  }


}
