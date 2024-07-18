import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class PatientService {

    private URL = "http://localhost:8080/auth";

    constructor(private httpClient: HttpClient) { }

    public login(credentials: any): Observable<any> {
        return this.httpClient.post(this.URL + "/login", credentials);
    }

    public register(newUser: any): Observable<any> {
        return this.httpClient.post(this.URL + "/nuevo", newUser);
    }


    public actualizarUsuario(id: number, user: any): Observable<any> {
        return this.httpClient.put(`${this.URL}/usuarios/${id}`, user);
    }

    public borrarUsuario(id: number): Observable<any> {
        return this.httpClient.delete(`${this.URL}/usuarios/${id}`);
    }

    public listarUsuarios(): Observable<any> {
        return this.httpClient.get(`${this.URL}/usuarios`);
    }

    public obtenerUsuarioPorId(id: number): Observable<any> {
        return this.httpClient.get(`${this.URL}/usuarios/${id}`);
    }

}




