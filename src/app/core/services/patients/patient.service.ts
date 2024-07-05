// services/patient.service.ts
import { Injectable } from '@angular/core';
import { Patient } from '../../models/patient.model';


@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private patients: Patient[] = [
        { id: 1, name: 'Juan Perez', age: 30, diagnosis: 'Dolor de cabeza' },
        { id: 2, name: 'María Gómez', age: 25, diagnosis: 'Fiebre alta' },
        { id: 3, name: 'Pedro Sanchez', age: 40, diagnosis: 'Problemas gastrointestinales' },
    ];

    
    getPatients(): Patient[] {
        return this.patients;
    }

    createPatient(patient: Patient): Patient {
        const newPatient: Patient = { ...patient, id: this.patients.length + 1 };
        this.patients.push(newPatient);
        return newPatient;
    }

    updatePatient(patient: Patient): Patient | null {
        const index = this.patients.findIndex(p => p.id === patient.id);
        if (index !== -1) {
            this.patients[index] = patient;
            return patient;
        }
        return null;
    }

    deletePatient(patientId: number): void {
        this.patients = this.patients.filter(patient => patient.id !== patientId);
    }
}
