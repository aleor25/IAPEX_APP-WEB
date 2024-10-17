import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class VerifiedEmailService {

  private apiUrl = 'http://localhost:8080/api/v1/users/web';

  constructor(private http: HttpClient) { }

  sendVerificationCode(email: string): Observable<any> {
    let params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.apiUrl}/confirm/resend`, { params });
  }
  
  verifyCode(code: string): Observable<any> {
    let params = new HttpParams().set('code', code);
    return this.http.get<any>(`${this.apiUrl}/confirm`, { params });
  }

}
