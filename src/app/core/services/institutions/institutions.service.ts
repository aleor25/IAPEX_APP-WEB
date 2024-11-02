import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Institution } from '../../models/institutions/institution.model';


@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {

  private URL = "http://localhost:8080/api/v1/institutions";

  constructor(private httpClient: HttpClient) { }

  public getAllInstitutions(): Observable<any> {
    return this.httpClient.get(this.URL);
  }

  // Obtener una institucion por ID
  public getInstitution(id: number): Observable<Institution> {
    const url = `${this.URL}/getInstitutionById/${id}`;
    return this.httpClient.get<Institution>(url).pipe(
      catchError(error => {
        console.error('Error al obtener la institución:', error);
        return throwError(() => new Error(error.error?.message || 'Error al obtener la institución'));
      })
    );
  }

  // Añadir una nueva institución
  public addInstitution(institution: FormData): Observable<Institution> {
    return this.httpClient.post<Institution>(this.URL, institution);
  }

  public updateInstitution(id: number, formData: FormData): Observable<any> {
    return this.httpClient.put(`${this.URL}/${id}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // Eliminar una institución
  public deleteInstitution(id: number): Observable<void> {
    const url = `${this.URL}/${id}`;
    return this.httpClient.delete<void>(url);
  }

  // Obtener los nombres de todas las instituciones
  public getAllInstitutionNames(): Observable<string[]> {
    const url = `${this.URL}/institution-names`;
    return this.httpClient.get<string[]>(url).pipe(
      catchError(error => {
        console.error('Error al obtener los nombres de las instituciones:', error);
        return throwError(() => new Error(error.error?.message || 'Error al obtener los nombres de las instituciones'));
      })
    );
  }
}
