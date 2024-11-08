import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = 'http://localhost:8080/api/v1/users/web';
  private _http = inject(HttpClient);
  private userKey = 'apiUserData';
  private authTokenKey = 'authToken';

  confirmUser(code: string): Observable<any> {
    let params = new HttpParams().set('code', code);
    return this._http.get<any>(`${this.apiUrl}/confirm`, { params });
  }

  resendVerificationCode(email: string): Observable<any> {
    let params = new HttpParams().set('email', email);
    return this._http.get<any>(`${this.apiUrl}/confirm/resend`, { params });
  }

  getCurrentUser(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get<any>(this.apiUrl + '/me', { headers })
  }

  registerUser(user: any): Observable<any> {
    return this._http.post<any>(this.apiUrl, user);
  }

  loginUser(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ email, password });

    return this._http.post<any>(`${this.apiUrl}/login`, body, { headers })
      .pipe(
        tap(response => {
          if (!response || !response.token) {
            throw new Error('Invalid login response');
          }
          localStorage.setItem(this.authTokenKey, response.token);
        }),
        switchMap(() => this.getCurrentUser()),
      );
  }

  requestPasswordReset(email: string): Observable<any> {
    let params = new HttpParams().set('email', email);
    return this._http.post<any>(`${this.apiUrl}/password-reset/request`, null, { params });
  }

  resendPasswordReset(email: string): Observable<any> {
    let params = new HttpParams().set('email', email);
    return this._http.get<any>(`${this.apiUrl}/password-reset/resend`, { params });
  }

  resetPassword(request: { verificationCode: string, newPassword: string }): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/password-reset`, request);
  }

  updateUserWeb(userId: number, updatedData: any): Observable<any> {
    return this._http.put(this.apiUrl + `${userId}`, updatedData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Aqui empiezan los metodos que no estan en el backend (de utilidad para el frontend)

  getAuthenticatedUserId(): Observable<number> {
    return this.getCurrentUser().pipe(
      map((user: any) => user.id)
    );
  }

  isUserWeb(): boolean {
    const userRole = localStorage.getItem('userRole');
    return userRole === 'USER_WEB';
  }

  setTokenWithExpiration(token: string): void {
    const expirationTime = new Date().getTime() + 10 * 60 * 1000; // 10 minutos desde que ingrese a la app
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (token && this.isTokenExpired()) {
      this.logout();
      return null;
    }
    return token;
  }

  isTokenExpired(): boolean {
    const expiration = localStorage.getItem('tokenExpiration');
    if (expiration) {
      return new Date().getTime() > parseInt(expiration, 10); // Verifica si el tiempo actual es mayor que el tiempo de expiración
    }
    return true; // Si no hay tiempo de expiración almacenado, se considera que el token ha expirado
  }

  removeToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const isLogged = !!token && !this.isTokenExpired();
    return isLogged;
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
        return null;
      }
    }
    return null;
  }

  logout(): void {
    console.log('Logging out...');

    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.userKey);
  }
}