import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private apiUrl = 'http://localhost:8080/api/v1/users/web';

  constructor(private http: HttpClient) {}

  // Enviar el código de verificación
  sendVerificationCode(email: string): Observable<any> {
    let params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.apiUrl}/password-reset/resend`, { params });
  }

  // Solicitar el restablecimiento de contraseña/ Solicitar el restablecimiento de contraseña
  requestPasswordReset(email: string): Observable<any> {
    let params = new HttpParams().set('email', email);
    return this.http.post<any>(`${this.apiUrl}/password-reset/request`, null, { params });
  }

  // Restablecer la contraseña
  resetPassword(verificationCode: string, newPassword: string): Observable<any> {
    const body = {
      verificationCode: verificationCode,
      newPassword: newPassword
    };
    return this.http.post<any>(`${this.apiUrl}/password-reset`, body);
  }
}
