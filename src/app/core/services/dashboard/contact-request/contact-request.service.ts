import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactRequest } from './../../../models/contact-request/contact-request.model';
import { UpdateContactRequest } from './../../../models/contact-request/update-contact-request.model';

@Injectable({
  providedIn: 'root'
})
export class ContactRequestService {
  private URL = "http://localhost:8080/api/v1/contact-requests";

  constructor(private http: HttpClient) { }

  getAllContactRequests(): Observable<ContactRequest[]> {
    return this.http.get<ContactRequest[]>(this.URL);
  }

  getContactRequestById(id: number): Observable<ContactRequest> {
    return this.http.get<ContactRequest>(`${this.URL}/${id}`);
  }

  getContactRequestsByInstitution(): Observable<ContactRequest[]> {
    // Cambiado para que coincida con el controlador
    return this.http.get<ContactRequest[]>(`${this.URL}/me/institution`);
  }

  createContactRequest(request: ContactRequest): Observable<Response> {
    return this.http.post<Response>(this.URL, request);
  }

  updateContactRequestById(id: number, request: UpdateContactRequest): Observable<Response> {
    return this.http.put<Response>(`${this.URL}/${id}`, request);
  }
}
