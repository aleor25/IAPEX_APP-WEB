import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactRequestService {
  private URL = "http://localhost:8080/api/v1/contact-requests";

  constructor(private http: HttpClient) { }

  getAllContactRequests(): Observable<ContactRequestDTO[]> {
    return this.http.get<ContactRequestDTO[]>(this.URL);
  }

  getContactRequestById(id: number): Observable<ContactRequestDTO> {
    return this.http.get<ContactRequestDTO>(`${this.URL}/${id}`);
  }

  getContactRequestsByInstitution(): Observable<ContactRequestDTO[]> {
    return this.http.get<ContactRequestDTO[]>(`${this.URL}/current-user/institution`);
  }

  createContactRequest(request: ContactRequestDTO): Observable<Response> {
    return this.http.post<Response>(this.URL, request);
  }

  updateContactRequestById(id: number, request: UpdateContactRequestDTO): Observable<Response> {
    return this.http.put<Response>(`${this.URL}/${id}`, request);
  }
}

  export interface ContactRequestDTO {
    id?: number;
    interestedPersonName: string;
    attendingUser?: string;
    missingPersonName: string;
    patient: number;
    phoneNumber: string;
    email: string;
    relationship: string;
    requestDateTime: Date;
    message: string;
    status: string;
  }
  
  export interface UpdateContactRequestDTO {
    status?: string;
    attendingUser?: string;
  }
  
  export interface Response {
    message: string;
  }
