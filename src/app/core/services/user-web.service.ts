import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UserWebDTO } from '../models/users/UserWebDTO';

@Injectable({
  providedIn: 'root'
})
export class UserWebService {

  private apiUrl = 'http://localhost:8080/api/v1/userWeb';

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.apiUrl}/myAccount`, { headers })
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