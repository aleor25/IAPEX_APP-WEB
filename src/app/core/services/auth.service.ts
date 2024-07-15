import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
<<<<<<< HEAD
  registrarPacientes(value: any): Observable<any> { //se agrega el :Observable<any> para los tipos de datos que se recibirán ya que no se especifica el tipo de dato
    throw new Error('Method not implemented.');
  }
=======
>>>>>>> 9cbee8e933660994bcc9ecee7b1ef24c7704b5b2
  private LOGIN_URL = 'http://localhost:4200/api/v1/auth/login';
  private tokenKey = 'authToken';

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.LOGIN_URL, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
        } else {
          this.localLogin(email, password);
        }
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    } else {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return this.localIsAuthenticated();
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  private localLogin(email: string, password: string): void {
    const savedFormData = localStorage.getItem('registerFormData');
    if (savedFormData) {
      const parsedFormData = JSON.parse(savedFormData);
      if (parsedFormData.email === email && parsedFormData.password === password) {
        localStorage.setItem('isAuthenticated', 'true');
      }
    }
  }

  private localIsAuthenticated(): boolean {
    const savedFormData = localStorage.getItem('registerFormData');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return !!savedFormData && isAuthenticated === 'true';
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login']);
  }
}
