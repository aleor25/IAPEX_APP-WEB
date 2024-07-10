// services/patient.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Patient {
    id: number;
    gender: string;
    description: string;
    room: string;
}

@Injectable({
    providedIn: 'root'
})


export class PatientService {
    
    
}