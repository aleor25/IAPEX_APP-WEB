import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { ContactRequest } from '../models/contact-request/contact-request.model';
import { UpdateContactRequest } from '../models/contact-request/update-contact-request.model';

@Injectable({
  providedIn: 'root',
})
export class ContactRequestService {
  private apiUrl = 'http://localhost:8080/api/v1/contact-requests';
  private _http = inject(HttpClient);

  // Subject para notificar actualizaciones
  private updateNotifier = new Subject<void>();

  // Observable para suscribirse a los cambios
  public onUpdateNotifier$ = this.updateNotifier.asObservable();

  public notifyUpdate() {
    this.updateNotifier.next(); // Emitir evento
  }

  public getAllContactRequests(): Observable<ContactRequest[]> {
    return this._http.get<ContactRequest[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener las solicitude:', error);
        return throwError(
          () =>
            new Error(error.error?.message || 'Error al obtener las solicitude')
        );
      })
    );
  }
  getContactRequestById(id: number): Observable<ContactRequest> {
    return this._http.get<ContactRequest>(`${this.apiUrl}/${id}`);
  }

  getContactRequestsByInstitution(): Observable<ContactRequest[]> {
    return this._http.get<ContactRequest[]>(`${this.apiUrl}/me/institution`);
  }

  createContactRequest(request: ContactRequest): Observable<Response> {
    return this._http.post<Response>(this.apiUrl, request);
  }

  public updateContactRequestById(
    id: number,
    request: UpdateContactRequest
  ): Observable<UpdateContactRequest> {
    const apiUrl = `${this.apiUrl}/${id}`;
    return this._http.put<UpdateContactRequest>(apiUrl, request).pipe(
      catchError((error) => {
        console.error('Error al actualizar la membresía:', error);
        return throwError(
          () =>
            new Error(
              error.error?.message || 'Error al actualizar la membresía'
            )
        );
      })
    );
  }
}
