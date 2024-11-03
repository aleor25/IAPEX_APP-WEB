import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Membership } from '../../models/memberships/membership.model';

@Injectable({
  providedIn: 'root'
})
export class MembershipsService {

  private URL = "http://localhost:8080/api/v1/memberships";

  constructor(private httpClient: HttpClient) { }

  public getAllMemberships(): Observable<Membership[]> {
    return this.httpClient.get<Membership[]>(this.URL).pipe(
      catchError(error => {
        console.error('Error al obtener las membresías:', error);
        return throwError(() => new Error(error.error?.message || 'Error al obtener las membresías'));
      })
    );
  }

  public getMembership(id: number): Observable<Membership> {
    const url = `${this.URL}/${id}`;
    return this.httpClient.get<Membership>(url).pipe(
      catchError(error => {
        console.error('Error al obtener la membresía:', error);
        return throwError(() => new Error(error.error?.message || 'Error al obtener la membresía'));
      })
    );
  }

  public addMembership(membership: Membership): Observable<Membership> {
    return this.httpClient.post<Membership>(this.URL, membership).pipe(
      catchError(error => {
        console.error('Error al añadir la membresía:', error);
        return throwError(() => new Error(error.error?.message || 'Error al añadir la membresía'));
      })
    );
  }

  public updateMembership(id: number, membership: Membership): Observable<Membership> {
    const url = `${this.URL}/${id}`;
    return this.httpClient.put<Membership>(url, membership).pipe(
      catchError(error => {
        console.error('Error al actualizar la membresía:', error);
        return throwError(() => new Error(error.error?.message || 'Error al actualizar la membresía'));
      })
    );
  }

  public deleteMembership(id: number): Observable<void> {
    const url = `${this.URL}/${id}`;
    return this.httpClient.delete<void>(url).pipe(
      catchError(error => {
        console.error('Error al eliminar la membresía:', error);
        return throwError(() => new Error(error.error?.message || 'Error al eliminar la membresía'));
      })
    );
  }
}
