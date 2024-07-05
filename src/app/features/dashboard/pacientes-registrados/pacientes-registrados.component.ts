import { Component, OnInit } from '@angular/core';
import { Patient } from '../../../core/models/patient.model';
import { PatientService } from '../../../core/services/patients/patient.service';

@Component({
    selector: 'app-patient-list',
    templateUrl: './pacientes-registrados.component.html',
    styleUrls: ['./pacientes-registrados.component.css'] // Asegúrate de crear el archivo CSS correspondiente
})
export class PacientesRegistradosComponent implements OnInit {
    patients: Patient[] = [];

    constructor(private patientService: PatientService) { }

    ngOnInit(): void {
        this.patients = this.patientService.getPatients();
    }

    deletePatient(patientId: number): void {
        this.patientService.deletePatient(patientId);
        this.patients = this.patients.filter(patient => patient.id !== patientId);
    }

    updatePatient(patient: Patient): void {
        const updatedPatient = this.patientService.updatePatient(patient);
        if (updatedPatient) {
            // Actualizar lista de pacientes si se realizó la actualización
            this.patients = this.patients.map(p => p.id === updatedPatient.id ? updatedPatient : p);
        } else {
            console.error('No se encontró el paciente para actualizar');
        }
    }
}
        
