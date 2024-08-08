import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../../models/patients/patient.model';

@Injectable({
    providedIn: 'root'
})
export class PatientService {

    private URL = "http://localhost:8080/api/v1/patients";

    constructor(private httpClient: HttpClient) { }

    public getAllPatients(): Observable<any> {
        return this.httpClient.get(this.URL);
    }

    // Obtener un paciente por ID
    public getPatient(id: number): Observable<Patient> {
        const url = `${this.URL}/${id}`;
        return this.httpClient.get<Patient>(url);
    }

    // Añadir un nuevo paciente
    public addPatient(patient: FormData): Observable<Patient> {
        return this.httpClient.post<Patient>(this.URL, patient);
    }


    // Actualizar un paciente existente
    public updatePatient(id: number, patient: FormData): Observable<Patient> {
        const url = `${this.URL}/${id}`;
        return this.httpClient.put<Patient>(url, patient);
    }

    // Eliminar un paciente
    public deletePatient(id: number): Observable<void> {
        const url = `${this.URL}/${id}`;
        return this.httpClient.delete<void>(url);
    }

}
