import { HttpHeaders, HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
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

  markAsReadAndDelete(idsToDelete: number[], idsToMarkAsRead: number[]): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${this.apiURL}/admin/messages`, { idsToMarkAsRead, idsToDelete }, { headers: this.headers , observe: 'response',responseType: 'text' as 'json' });
  }

  sendReply(reply: any, messageId: number): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.apiURL}/admin/messages/${messageId}/send-reply`, reply , { headers: this.headers , observe: 'response',responseType: 'text' as 'json' });
  }
}
