import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetailsModule } from '../models/user-details/user-details.module';
import { UserInfosModule } from '../models/user-infos/user-infos.module';
import { HttpParams } from '@angular/common/http';
import { StorageService } from './storage.service';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService{

  private apiURL = environment.apiUrl;
  private headers: HttpHeaders = new HttpHeaders();


  constructor(private http: HttpClient, private storage: StorageService) {
    this.storage.getToken().subscribe((token) => {
      token ? this.headers = new HttpHeaders({ Authorization: `Bearer ${token}` })
        : this.headers = new HttpHeaders();
    });
  }

  login(body : any): Observable<HttpResponse<UserDetailsModule>> {
    console.log(body);
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

  passwordHasBeenForgotten(email: string): Observable<HttpResponse<string>> {
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

  reportUser(userId : number):Observable<HttpResponse<string>> {
    return this.http.put<string>(`${this.apiURL}/customer-service/customers/${userId}/report`, null, {
    headers: this.headers,
    observe: 'response',
    responseType: 'text' as 'json'
    });
  }

  UnReportUser(userId : number):Observable<HttpResponse<string>> {
    return this.http.put<string>(`${this.apiURL}/customer-service/customers/${userId}/unReport`, null, {
      headers: this.headers,
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }




}
