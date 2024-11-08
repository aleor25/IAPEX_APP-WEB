import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
    providedIn: 'root'
})

export class PatientService {

    private apiUrl = "http://localhost:8080/api/v1/patients";
    private _http = inject(HttpClient);

    public getAllPatients(): Observable<any> {
        return this._http.get(this.apiUrl);
    }

    // Obtener un paciente por ID
    public getPatient(id: number): Observable<Patient> {
        const apiUrl = `${this.apiUrl}/${id}`;
        return this._http.get<Patient>(apiUrl);
    }

    // Añadir un nuevo paciente
    public addPatient(patient: FormData): Observable<Patient> {
        return this._http.post<Patient>(this.apiUrl, patient);
    }

    public updatePatient(id: number, formData: FormData): Observable<any> {
        return this._http.put(`${this.apiUrl}/${id}`, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }
    // Eliminar un paciente
    public deletePatient(id: number): Observable<void> {
        const apiUrl = `${this.apiUrl}/${id}`;
        return this._http.delete<void>(apiUrl);
    }
    
    public registerPatients(formData: FormData): Observable<any> {
        return this._http.post(this.apiUrl, formData);
    }
}