import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class UserWebService {
  private apiUrl = 'http://localhost:8080/api/v1/users/web';

  constructor(private httpClient: HttpClient, private router: Router) {}

  getAuthenticatedUserId(): Observable<number> {
    return this.getCurrentUser().pipe(
      map((user: any) => user.id) // Aquí se asume que el ID del usuario viene en la propiedad 'id'
    );
  }  

  public updateUserWeb(userId: number, updatedData: any): Observable<any> {
    return this.httpClient.put(this.apiUrl + `${userId}`, updatedData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  

  login(email: string, password: string): Observable<any> {
    const loginUsuario = { email, password };
    return this.httpClient.post<any>(`${this.apiUrl}/login`, loginUsuario).pipe(
      tap(response => {
        console.log('Respuesta de login:', response);
        if (response && response.token) {
          this.setTokenWithExpiration(response.token);
          const role = response.authorities && response.authorities.length > 0 
            ? response.authorities[0].authority 
            : 'USER';
          localStorage.setItem('userRole', role);
        }
      })
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

  public isTokenExpired(): boolean {
    const expiration = localStorage.getItem('tokenExpiration');
    if (expiration) {
      return new Date().getTime() > parseInt(expiration, 10); // Verifica si el tiempo actual es mayor que el tiempo de expiración
    }
    return true; // Si no hay tiempo de expiración almacenado, se considera que el token ha expirado
  }

  logout(): void {
    this.removeToken();
    localStorage.removeItem('userRole');
    this.router.navigate(['/access/login']);
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

  getCurrentUser(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get<any>(this.apiUrl + '/me', { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'No autorizado.';
          break;
        case 404:
          errorMessage = 'Servicio no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
          break;
      }
    }
    
    console.error('Error:', errorMessage);
    return throwError(errorMessage);
  }
}