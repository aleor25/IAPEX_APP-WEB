import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterPatientsServiceService {
  private baseUrl = 'http://localhost:8080/api/v1/patients';

  constructor(private http: HttpClient) { }

  registerPatients(patientData: any): Observable<any> {
    const formData = new FormData();

    // Añade los datos del paciente al FormData
    Object.keys(patientData).forEach(key => {
      if (key !== 'imageFiles') {
        formData.append(key, patientData[key]);
      }
    });

    // Añade los archivos al FormData
    const files = patientData.imageFiles;
    files.forEach((file: File) => {
      formData.append('imageFiles', file);
    });

    // Realiza la solicitud POST
    return this.http.post<any>(`${this.baseUrl}/register`, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      }),
      reportProgress: true,
      observe: 'events'
    });
  }
}
