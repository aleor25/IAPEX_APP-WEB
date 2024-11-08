import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Institution } from '../models/institution/institution.model';

@Injectable({
  providedIn: 'root'
})

export class InstitutionService {

  private apiUrl = "http://localhost:8080/api/v1/institutions";
  private _http = inject(HttpClient);

  public getAllInstitutions(): Observable<any> {
    return this._http.get(this.apiUrl);
  }

  // Obtener una institucion por ID
  public getInstitution(id: number): Observable<Institution> {
    const apiUrl = `${this.apiUrl}/${id}`;
    return this._http.get<Institution>(apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener la institución:', error);
        return throwError(() => new Error(error.error?.message || 'Error al obtener la institución'));
      })
    );
  }

  // Añadir una nueva institución
  public addInstitution(institution: FormData): Observable<Institution> {
    return this._http.post<Institution>(this.apiUrl, institution);
  }

  public updateInstitution(id: number, formData: FormData): Observable<any> {
    return this._http.put(`${this.apiUrl}/${id}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // Eliminar una institución
  public deleteInstitution(id: number): Observable<void> {
    const apiUrl = `${this.apiUrl}/${id}`;
    return this._http.delete<void>(apiUrl);
  }

  // Obtener los nombres de todas las instituciones
  public getAllInstitutionNames(): Observable<string[]> {
    const apiUrl = `${this.apiUrl}/institution-names`;
    return this._http.get<string[]>(apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener los nombres de las instituciones:', error);
        return throwError(() => new Error(error.error?.message || 'Error al obtener los nombres de las instituciones'));
      })
    );
  }
}