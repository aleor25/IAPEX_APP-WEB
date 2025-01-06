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

    // Método para obtener imágenes temporales por token
    public getTemporaryImagesByToken(token: string): Observable<string[]> {
        const apiUrl = `${this.apiUrl}/images/temp/${token}`;
        return this._http.get<string[]>(apiUrl);
    }

    // Método para obtener la URL de carga de imágenes
    public getUploadImagesUrl(): Observable<{ message: string }> {
        const apiUrl = `${this.apiUrl}/upload-images-url`;
        return this._http.get<{ message: string }>(apiUrl);
    }

    // Método para subir imágenes temporales
    public uploadTemporaryImages(formData: FormData): Observable<any> {
        const apiUrl = `${this.apiUrl}/upload-temp-images`;
        return this._http.post(apiUrl, formData);
    }

    public updatePatient(id: number, formData: FormData): Observable<any> {
        return this._http.put(`${this.apiUrl}/${id}`, formData);
    }

    // Eliminar un paciente
    public deletePatient(id: number): Observable<void> {
        const apiUrl = `${this.apiUrl}/${id}`;
        return this._http.delete<void>(apiUrl);
    }

    public addPatient(formData: FormData): Observable<any> {
        return this._http.post(this.apiUrl, formData);
    }
}