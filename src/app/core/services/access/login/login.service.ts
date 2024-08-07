import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private apiUrl = 'http://localhost:8080/api/v1/userWeb';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ email, password });

    return this.http.post<any>(`${this.apiUrl}/login`, body, { headers })
      .pipe(
        tap(response => {
          localStorage.setItem('user', JSON.stringify(response.user));
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error.';
    
    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Errores del lado del servidor
      switch (error.status) {
        case 401:
          errorMessage = 'La contraseña y el correo no existe, por favor, crea un usuario.';
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
