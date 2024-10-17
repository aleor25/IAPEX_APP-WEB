  import { Injectable } from '@angular/core';
  import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError, tap, switchMap } from 'rxjs/operators';

  @Injectable({
    providedIn: 'root'
  })
  export class LoginService {

    private apiUrl = 'http://localhost:8080/api/v1/users/web';
    private userKey = 'apiUserData';
    private authTokenKey = 'authToken'; 

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const body = JSON.stringify({ email, password });

      return this.http.post<any>(`${this.apiUrl}/login`, body, { headers })
        .pipe(
          tap(response => {
            if (!response || !response.token) {
              throw new Error('Invalid login response');
            }
            localStorage.setItem(this.authTokenKey, response.token);
          }),
          switchMap(() => this.getCurrentUser()), 
          catchError(this.handleError)
        );
    }

    getCurrentUser(): Observable<any> {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(this.authTokenKey)}`
      });
  
      return this.http.get<any>(`${this.apiUrl}/me`, { headers })
          .pipe(
              tap(user => {
                  localStorage.setItem(this.userKey, JSON.stringify(user));
              }),
              catchError(this.handleError)
          );
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

    private handleError(error: HttpErrorResponse): Observable<never> {
      let errorMessage = 'Ocurrió un error.';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 401:
            errorMessage = 'Correo electrónico o contraseña incorrectos.';
            break;
          case 404:
            errorMessage = 'Servicio no encontrado.';
            break;
          case 500:
            errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
            break;
          default:
            errorMessage = `Código de error: ${error.status}`;
            break;
        }
      }
      console.error('Error:', errorMessage);
      return throwError(errorMessage);
    }

    logout(): void {
      console.log('Logging out...'); 

      localStorage.removeItem(this.authTokenKey);
      localStorage.removeItem(this.userKey); 
    }
  }