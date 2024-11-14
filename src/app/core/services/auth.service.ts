import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, AuthUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_user';
  private readonly TOKEN_DURATION = 10 * 60 * 1000; // 10 minutes
  private apiUrl = 'http://localhost:8080/api/v1/users/web';
  
  private _http = inject(HttpClient);
  private _router = inject(Router);

  login(email: string, password: string): Observable<AuthResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ email, password });

    return this._http.post<AuthResponse>(`${this.apiUrl}/login`, body, { headers })
      .pipe(
        tap(response => {
          if (!response?.token) {
            throw new Error('Invalid login response');
          }
          
          const authUser: AuthUser = {
            token: response.token,
            role: response.authorities?.[0]?.authority || 'USER_WEB',
            expiresAt: new Date().getTime() + this.TOKEN_DURATION
          };
          
          this.setAuthUser(authUser);
        })
      );
  }

  getAuthUser(): AuthUser | null {
    const userData = localStorage.getItem(this.AUTH_KEY);
    if (!userData) return null;
    
    try {
      const authUser: AuthUser = JSON.parse(userData);
      if (this.isTokenExpired(authUser.expiresAt)) {
        this.logout();
        return null;
      }
      return authUser;
    } catch (e) {
      console.error('Error parsing auth user data', e);
      return null;
    }
  }

  getAuthToken(): string | null {
    const authUser = this.getAuthUser();
    return authUser?.token || null;
  }

  private setAuthUser(authUser: AuthUser): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(authUser));
  }

  private isTokenExpired(expiresAt: number): boolean {
    return new Date().getTime() > expiresAt;
  }

  isLoggedIn(): boolean {
    const authUser = this.getAuthUser();
    return !!authUser && !this.isTokenExpired(authUser.expiresAt);
  }

  hasRole(role: string): boolean {
    const authUser = this.getAuthUser();
    return authUser?.role === role;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
    return !!token;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this._router.navigate(['/auth/login']);
  }
}