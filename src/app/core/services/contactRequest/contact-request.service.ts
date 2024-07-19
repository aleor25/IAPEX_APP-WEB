import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

  export class ContactRequestService {
  private apiUrl = 'http://localhost:8080/api/v1/contact-requests';

  constructor(private http: HttpClient) { }

  // Obtiene todas las solicitudes de contacto
  getAllContactRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtiene una solicitud de contacto por ID
  getContactRequestById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Obtiene las solicitudes de contacto por la institución del usuario autenticado
  getContactRequestsByInstitution(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/current-user/institution`);
  }

  // Crea una solicitud de contacto
  createContactRequest(request: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }

  // Actualiza una solicitud de contacto por ID
  updateContactRequestById(id: number, request: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, request);
  }

}

