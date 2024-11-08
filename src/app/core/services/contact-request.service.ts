import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactRequest } from '../models/contact-request/contact-request.model';
import { UpdateContactRequest } from '../models/contact-request/update-contact-request.model';

@Injectable({
  providedIn: 'root'
})

export class ContactRequestService {

  private apiUrl = "http://localhost:8080/api/v1/contact-requests";
  private _http = inject(HttpClient);

  getAllContactRequests(): Observable<ContactRequest[]> {
    return this._http.get<ContactRequest[]>(this.apiUrl);
  }

  getContactRequestById(id: number): Observable<ContactRequest> {
    return this._http.get<ContactRequest>(`${this.apiUrl}/${id}`);
  }

  getContactRequestsByInstitution(): Observable<ContactRequest[]> {
    // Cambiado para que coincida con el controlador
    return this._http.get<ContactRequest[]>(`${this.apiUrl}/me/institution`);
  }

  createContactRequest(request: ContactRequest): Observable<Response> {
    return this._http.post<Response>(this.apiUrl, request);
  }

  updateContactRequestById(id: number, request: UpdateContactRequest): Observable<Response> {
    return this._http.put<Response>(`${this.apiUrl}/${id}`, request);
  }
}