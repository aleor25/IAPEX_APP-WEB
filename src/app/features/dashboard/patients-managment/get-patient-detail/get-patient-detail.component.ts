import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../../../core/models/patients/patient.model';
import { FormatDateTimePipe } from '../../../../shared/pipes/format-date-time.pipe';
import { PatientService } from '../../../../core/services/patients/patient.service';

@Component({
  selector: 'app-get-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormatDateTimePipe, ReactiveFormsModule],
  templateUrl: './get-patient-detail.component.html',
  styleUrl: './get-patient-detail.component.css'
})
export class GetPatientDetailComponent implements OnInit {
  selectedPatient: Patient | null = null;
  patientForm!: FormGroup;
  isFormModified = false;

  private _route = inject(Router)

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private fb: FormBuilder,
  ) {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      secondLastName: [''],
      gender: ['', Validators.required],
      approximateAge: ['', [Validators.required, Validators.min(0)]],
      skinColor: [''],
      hair: [''],
      complexion: [''],
      eyeColor: [''],
      approximateHeight: ['', Validators.min(0)],
      medicalConditions: [''],
      distinctiveFeatures: [''],
      institution: ['', Validators.required],
      additionalNotes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatient(+id);
    }
  }

  loadPatient(id: number): void {
    this.patientService.getPatient(id).subscribe(
      (patient: Patient) => {
        this.selectedPatient = patient;
        this.initializeForm(); 
      },
      (error) => {
        console.error('Error loading patient:', error);
      }
    );
  }

  initializeForm(): void {
    if (this.selectedPatient) {
      this.patientForm = this.fb.group({
        name: [this.selectedPatient.name],
        lastName: [this.selectedPatient.lastName],
        secondLastName: [this.selectedPatient.secondLastName],
        gender: [this.selectedPatient.gender],
        approximateAge: [this.selectedPatient.approximateAge],
        skinColor: [this.selectedPatient.skinColor],
        eyeColor: [this.selectedPatient.eyeColor],
        hair: [this.selectedPatient.hair],
        hairColor: [this.selectedPatient.hair],
        complexion: [this.selectedPatient.complexion],
        approximateHeight: [this.selectedPatient.approximateHeight],
        medicalConditions: [this.selectedPatient.medicalConditions],
        distinctiveFeatures: [this.selectedPatient.distinctiveFeatures],
        additionalNotes: [this.selectedPatient.additionalNotes],
      });

      this.patientForm.valueChanges.subscribe(() => {
        this.isFormModified = this.patientForm.dirty;
      });
    }
  }

  savePatient() {
    if (this.patientForm.valid) {
        if (this.selectedPatient) { 
            const formData: FormData = new FormData();

            formData.append('name', this.patientForm.value.name);
            formData.append('lastName', this.patientForm.value.lastName);
            formData.append('secondLastName', this.patientForm.value.secondLastName);
            formData.append('gender', this.patientForm.value.gender);
            formData.append('approximateAge', this.patientForm.value.approximateAge.toString());
            formData.append('skinColor', this.patientForm.value.skinColor);
            formData.append('hair', this.patientForm.value.hair);
            formData.append('complexion', this.patientForm.value.complexion);
            formData.append('eyeColor', this.patientForm.value.eyeColor);
            formData.append('approximateHeight', this.patientForm.value.approximateHeight.toString());
            formData.append('medicalConditions', this.patientForm.value.medicalConditions);
            formData.append('distinctiveFeatures', this.patientForm.value.distinctiveFeatures);
            formData.append('institution', this.patientForm.value.institution);
            formData.append('additionalNotes', this.patientForm.value.additionalNotes);

            this.patientService.updatePatient(this.selectedPatient.id, formData)
                .subscribe(
                    response => {
                        console.log('Paciente actualizado con éxito', response);
                        this._route.navigate(['/dashboard/patients'])
                      },
                    error => {
                        console.error('Error al actualizar el paciente', error);
                    }
                );
        } else {
            console.error('No se pudo encontrar el paciente seleccionado');
        }
    } else {
        console.log('El formulario es inválido');
    }
}

deletePatient(id: number) {
  if (id) {  
      this.patientService.deletePatient(id).subscribe(
          () => {
              console.log('Paciente eliminado con éxito');
              this._route.navigate(['/dashboard/patients'])
            },
          error => {
              console.error('Error al eliminar el paciente:', error);
          }
      );
  } else {
      console.log('ID de paciente no válido');
  }
}
}

