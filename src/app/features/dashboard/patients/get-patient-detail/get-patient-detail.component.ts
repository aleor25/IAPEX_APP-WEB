import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Patient } from '../../../../core/models/patients/patient.model';
import { PatientService } from '../../../../core/services/dashboard/patients/patient.service';
import { FormatDateTimePipe } from '../../../../shared/pipes/format-date-time.pipe';

@Component({
  selector: 'app-get-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormatDateTimePipe],
  templateUrl: './get-patient-detail.component.html',
  styleUrl: './get-patient-detail.component.css'
})
export class GetPatientDetailComponent implements OnInit {
  selectedPatient: Patient | null = null;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatient(+id);
    }
  }

  /*Carga la informacion de un paciente en base a su ID.*/
  loadPatient(id: number): void {
    this.patientService.getPatient(id).subscribe(
      (patient: Patient) => {
        this.selectedPatient = patient;
      },
      (error) => {
        console.error('Error loading patient:', error);
      }
    );
  }
}