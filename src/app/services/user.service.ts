import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDetailsModule } from '../models/user-details/user-details.module';
import {CookieService} from 'ngx-cookie-service';
import { UserInfosModule } from '../models/user-infos/user-infos.module';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token = this.cookieService.get('token');

  private headers = new HttpHeaders({ 'Content-Type': 'application/json'});

  private headersWithToken = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
    'Content-Type': 'application/json'
  });


  constructor(private http: HttpClient,
    private cookieService: CookieService,
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
    return this.http.post<string>(`http://localhost:8080/user/verify-code`,body, {  headers : this.headers, observe: 'response', responseType: 'text' as 'json' });
  }

  getUserInfo(): Observable<UserInfosModule> {
    return this.http.get<UserInfosModule>('http://localhost:8080/common/get-user-infos', { headers : this.headersWithToken });
  }

  checkToken(toekn : string):Observable<HttpResponse<string>> {
    return this.http.get<string>('http://localhost:8080/common/check-token',{ headers : this.headersWithToken, observe: 'response', responseType: 'text' as 'json' })
  }


}
