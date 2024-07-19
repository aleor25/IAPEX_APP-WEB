import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PatientService {

    private URL = "http://localhost:8080/api/v1/patients";

    constructor(private httpClient: HttpClient) { }

    public getAllPatients(): Observable<any> {
        return this.httpClient.get(this.URL);
    }

/* 
    public getPatientById(id: number): Observable<any> {
        return this.httpClient.get(`${this.URL}/${id}`);
    }

    public getAllActivePatients(): Observable<any> {
        return this.httpClient.get(`${this.URL}/active`);
    }

    public getActivePatientById(id: number): Observable<any> {
        return this.httpClient.get(`${this.URL}/${id}/active`);
    }

    public getPatientsByInstitution(): Observable<any> {
        return this.httpClient.get(`${this.URL}/current-user/institution`);
    }

    public registerPatient(patient: FormData): Observable<any> {
        return this.httpClient.post(this.URL, patient, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    public updatePatient(id: number, patient: FormData): Observable<any> {
        return this.httpClient.put(`${this.URL}/${id}`, patient, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
 */

}
