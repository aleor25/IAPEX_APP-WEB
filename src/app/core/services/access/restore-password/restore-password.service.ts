import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestorePasswordService {

  private apiUrl = 'http://localhost:8080/api/v1/users/web/password-reset';

  constructor(private http: HttpClient) { }
  resetPassword(request: { verificationCode: string, newPassword: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }

}