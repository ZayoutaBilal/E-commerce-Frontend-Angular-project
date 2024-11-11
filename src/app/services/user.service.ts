import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Observable, observeOn } from 'rxjs';
import { UserDetailsModule } from '../models/user-details/user-details.module';
import {CookieService} from 'ngx-cookie-service';
import { UserInfosModule } from '../models/user-infos/user-infos.module';
import { HttpParams } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token = this.storage.getItem('token');

  private headers = new HttpHeaders({ 'Content-Type': 'application/json'});

  private headersWithToken = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
    'Content-Type': 'application/json'
  });

  private headersWithTokenImage = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
    'enctype': 'multipart/form-data'
  });


  constructor(private http: HttpClient,
    private storage : StorageService
  ){ }

  login(login: string, password: string): Observable<HttpResponse<UserDetailsModule>> {
    const body = { login, password };
    console.log(body);
    return this.http.post<UserDetailsModule>('http://localhost:8080/user/login', body, { 
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
    return this.http.post<any>('http://localhost:8080/user/signup', body,  {  headers : this.headers, observe: 'response' ,responseType: 'text' as 'json'});
  }

  forgetpassword(email: string): Observable<HttpResponse<string>> {
    const url = `http://localhost:8080/user/forgot-password?email=${encodeURIComponent(email)}`;
    return this.http.get<string>(url, {  headers : this.headers, observe: 'response', responseType: 'text' as 'json' });
  }

  verifyCode(email: string,newPassword:string,code:string): Observable<HttpResponse<string>> {
    let body = {
      email,newPassword,code
    };
    return this.http.post<string>('http://localhost:8080/user/verify-code',body, {  headers : this.headers, observe: 'response', responseType: 'text' as 'json' });
  }

  confirmEmail(email: string,code:string): Observable<HttpResponse<string>> {
    let body = {
      email,code
    };
    return this.http.post<string>('http://localhost:8080/user/confirm-email',body, {  headers : this.headers, observe: 'response', responseType: 'text' as 'json' });
  }

  getUserInfo(): Observable<UserInfosModule> {
    return this.http.get<UserInfosModule>('http://localhost:8080/common/get-user-infos', { headers : this.headersWithToken });
  }

  checkToken(toekn : string):Observable<HttpResponse<string>> {
    return this.http.get<string>('http://localhost:8080/common/check-token',{ headers : this.headersWithToken, observe: 'response', responseType: 'text' as 'json' })
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
      return this.http.put<string>('http://localhost:8080/common/update-user-infos',body,{ headers : this.headersWithToken , observe : 'response', responseType: 'text' as 'json'})
    }

  updatePassword(  oldPassword : string , newPassword : string) : Observable<HttpResponse<string>>{
      let body = {
        oldPassword,newPassword
      };
      return this.http.put<string>('http://localhost:8080/common/update-password',body,{ headers : this.headersWithToken , observe : 'response', responseType: 'text' as 'json'})
    }

  deleteMyAccount() : Observable<HttpResponse<string>>{
    return this.http.delete<string>('http://localhost:8080/common/delete-my-account',{ headers : this.headersWithToken , observe : 'response', responseType: 'text' as 'json'})
  }

  updateUsername(username: string): Observable<HttpResponse<string>> {
    const params = new HttpParams().set('username', username);
    return this.http.put<string>('http://localhost:8080/common/update-username', null, {
      headers: this.headersWithToken,
      observe: 'response',
      responseType: 'text' as 'json',
      params: params
    });
  }

  updatePictur(file: File): Observable<HttpResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>('http://localhost:8080/common/upload-picture', formData, {
      headers: this.headersWithTokenImage,
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }

  sendMessage(message : string, email : string, name : string) : Observable<HttpResponse<string>>{
    let body = {
      message,email,name
    };
    return this.http.post<string>('http://localhost:8080/user/message/send-message',body, {  headers : this.headers, observe: 'response', responseType: 'text' as 'json' });
  }


}
