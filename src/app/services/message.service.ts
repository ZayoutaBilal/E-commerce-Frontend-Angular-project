import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { Page } from '../models/page/page.module';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiURL = environment.apiUrl;
  private headers : HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient, private storage: StorageService) {
    this.storage.getToken().subscribe((token) => {
      token ? this.headers = new HttpHeaders({ Authorization: `Bearer ${token}` })
        : this.headers = new HttpHeaders();
    });
  }

  getMessages(page: number, pageSize: number): Observable<HttpResponse<Page<any>>> {
    return this.http.get<Page<any>>(`${this.apiURL}/admin/messages?page=${page}&size=${pageSize}`, { headers: this.headers , observe: 'response'});
  }

  markAsRead(messageId: number): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.apiURL}/admin/messages/mark-as-read/${messageId}`, {}, { headers: this.headers , observe: 'response',responseType: 'text' as 'json' });
  }

  sendReply(reply: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.apiURL}/admin/messages/send-reply`, reply , { headers: this.headers , observe: 'response',responseType: 'text' as 'json' });
  }

  deleteMessage(messageId: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.apiURL}/admin/messages/delete/${messageId}`, { headers: this.headers , observe: 'response',responseType: 'text' as 'json' });
  }


}
