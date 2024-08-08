import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterPatientsService {

   private URL = "http://localhost:8080/api/v1/patients";

  constructor(private httpClient: HttpClient) { }

  registerPatients(formData: FormData): Observable<any> {
    return this.httpClient.post(this.URL, formData);
  }
  
}
