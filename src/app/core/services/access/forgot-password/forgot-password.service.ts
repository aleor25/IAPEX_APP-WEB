import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private apiUrl = 'http://localhost:8080/api/v1/userWeb';

  constructor(private http: HttpClient) {}

  sendVerificationCode(email: string): Observable<any> {
    let params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.apiUrl}/resend-verification`, { params });
  }

 /*  sendPasswordResetCode(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.apiUrl}/password-reset/request`, null, { params });
  }

  resendPasswordResetCode(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.apiUrl}/password-reset/resend`, null, { params });
  } */
}
