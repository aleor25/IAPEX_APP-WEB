import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/users/web';
  private _http = inject(HttpClient);

  confirmUser(code: string): Observable<any> {
    let params = new HttpParams().set('code', code);
    return this._http.get<any>(`${this.apiUrl}/confirm`, { params });
  }

  resendCode(email: string): Observable<any> {
    let params = new HttpParams().set('email', email);
    return this._http.get<any>(`${this.apiUrl}/confirm/resend`, { params });
  }

  registerUser(user: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/register`, user);
  }

  requestPasswordReset(email: string): Observable<any> {
    let params = new HttpParams().set('email', email);
    return this._http.post<any>(`${this.apiUrl}/password-reset/request`, null, { params });
  }

  // resendPasswordReset(email: string): Observable<any> {
  //   let params = new HttpParams().set('email', email);
  //   return this._http.post<any>(`${this.apiUrl}/password-reset/resend`, {}, { params });
  // }

  resetPassword(request: { verificationCode: string, newPassword: string }): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/password-reset`, request);
  }
}