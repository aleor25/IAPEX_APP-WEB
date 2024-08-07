import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserWebDTO } from '../models/users/UserWebDTO';

@Injectable({
  providedIn: 'root'
})
export class UserWebService {

  constructor(private http: HttpClient) {}

 
}
