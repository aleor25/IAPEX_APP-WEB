import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { PatientService } from '../../../core/services/patients/patient.service';
import { Patient } from '../../../core/models/patient.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './pacientes-registrados.component.html',
  styleUrls: ['./pacientes-registrados.component.css']
})
export class PacientesRegistradosComponent implements OnInit {

  patientsData: Patient[] = [];
  displayedPatients: Patient[] = [];
  currentPage: number = 1;
  pageSize: number = 8;

  private _router = inject(Router);
  private _patientService = inject(PatientService);

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.patientsData = this.simulateGetPatients();
    this.updateDisplayedPatients();
  }

  simulateGetPatients(): Patient[] {
    return [
      { id: 1, gender: 'Hombre', description: 'Dolor de cabeza', room: '101' },
      { id: 2, gender: 'Mujer', description: 'Fiebre', room: '102' },
      { id: 3, gender: 'Hombre', description: 'Problemas gastrointestinales', room: '103' },
      { id: 4, gender: 'Mujer', description: 'Tos', room: '104' },
      { id: 5, gender: 'Hombre', description: 'Faringitis', room: '105' },
      { id: 6, gender: 'Mujer', description: 'Dolor de espalda', room: '106' },
      { id: 7, gender: 'Hombre', description: 'Fatiga', room: '107' },
      { id: 8, gender: 'Mujer', description: 'Desvanecimiento', room: '108' },
      { id: 9, gender: 'Hombre', description: 'Náusea', room: '109' },
      { id: 10, gender: 'Mujer', description: 'Dolor de articulaciones', room: '110' }
    ];
  }

  updateDisplayedPatients(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedPatients = this.patientsData.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedPatients();
  }
}
