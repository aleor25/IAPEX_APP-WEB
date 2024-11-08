import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Membership } from '../models/membership.model';

@Injectable({
  providedIn: 'root'
})

export class MembershipService {

  private apiUrl = "http://localhost:8080/api/v1/memberships";
  private _http = inject(HttpClient);

  public getAllMemberships(): Observable<Membership[]> {
    return this._http.get<Membership[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener las membresías:', error);
        return throwError(() => new Error(error.error?.message || 'Error al obtener las membresías'));
      })
    );
  }

  public getMembership(id: number): Observable<Membership> {
    const apiUrl = `${this.apiUrl}/${id}`;
    return this._http.get<Membership>(apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener la membresía:', error);
        return throwError(() => new Error(error.error?.message || 'Error al obtener la membresía'));
      })
    );
  }

  public addMembership(membership: Membership): Observable<Membership> {
    return this._http.post<Membership>(this.apiUrl, membership).pipe(
      catchError(error => {
        console.error('Error al añadir la membresía:', error);
        return throwError(() => new Error(error.error?.message || 'Error al añadir la membresía'));
      })
    );
  }

  public updateMembership(id: number, membership: Membership): Observable<Membership> {
    const apiUrl = `${this.apiUrl}/${id}`;
    return this._http.put<Membership>(apiUrl, membership).pipe(
      catchError(error => {
        console.error('Error al actualizar la membresía:', error);
        return throwError(() => new Error(error.error?.message || 'Error al actualizar la membresía'));
      })
    );
  }

  public deleteMembership(id: number): Observable<void> {
    const apiUrl = `${this.apiUrl}/${id}`;
    return this._http.delete<void>(apiUrl).pipe(
      catchError(error => {
        console.error('Error al eliminar la membresía:', error);
        return throwError(() => new Error(error.error?.message || 'Error al eliminar la membresía'));
      })
    );
  }
}