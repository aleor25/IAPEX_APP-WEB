import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Patient } from '../../../../core/models/patients/patient.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { PatientService } from '../../../../core/services/dashboard/patients/patient.service';
import { PatientsTableComponent } from '../../../../shared/tables/patients-table/patients-table.component';
@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule, CommonModule, PatientsTableComponent],
  templateUrl: './patients.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  loading: boolean = true;
  error: string | null = null;
  patientIdToDelete: number | null = null;

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  table: string[] = [];

  ngOnInit(): void {
    this.getAllPatients();
  }

  refreshList(): void {
    this.loading = true;
    this.error = null;
    this.getAllPatients();
  }

  getAllPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data: Patient[]) => {
        this.patients = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos: ' + err.message;
        this.loading = false;
      }
    });
  }

  addPatient(patient: Patient): void {
    const formData = this.createFormData(patient);
    this.patientService.addPatient(formData).subscribe({
      next: (newPatient) => {
        this.patients.push(newPatient);
        console.log('Paciente agregado:', newPatient);
      },
      error: (err) => {
        console.error('Error al agregar paciente:', err);
        this.error = 'Error al agregar paciente: ' + err.message;
      }
    });
  }  
  
  private createFormData(patient: Patient): FormData {
    const formData = new FormData();
    formData.append('name', patient.name);
    formData.append('lastName', patient.lastName);
    formData.append('secondLastName', patient.secondLastName);
    formData.append('gender', patient.gender);
    formData.append('approximateAge', patient.approximateAge.toString());
    formData.append('registrationDateTime', patient.registrationDateTime);
    formData.append('active', patient.active.toString());
    formData.append('skinColor', patient.skinColor);
    formData.append('hair', patient.hair);
    formData.append('complexion', patient.complexion);
    formData.append('eyeColor', patient.eyeColor);
    formData.append('approximateHeight', patient.approximateHeight.toString());

    if (patient.medicalConditions) {
      formData.append('medicalConditions', patient.medicalConditions);
    }
    if (patient.distinctiveFeatures) {
      formData.append('distinctiveFeatures', patient.distinctiveFeatures);
    }

    formData.append('institutionId', patient.institution.toString());

    patient.images.forEach((image, index) => {
      formData.append(`images[${index}].id`, image.id.toString());
      formData.append(`images[${index}].image`, image.image);
      formData.append(`images[${index}].imageUrl`, image.imageUrl);
    });

    if (patient.additionalNotes) {
      formData.append('additionalNotes', patient.additionalNotes);
    }

    return formData;
  }

  /** Editar un paciente cuando se proporciona su id.*/
  updatePatient(patient: any, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/update-patient-detail', patient.id], { queryParams: { edit: 'true' } });
  }

  /** Muestra la informacion detallada de un paciente cuando se proporciona su id.*/
  viewDetails(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/get-patient-detail', id]);
    }
  }

  /** Confrimar la eliminacion de un paciente.*/
  confirmDelete(): void {
    if (this.patientIdToDelete !== null) {
      this.deletePatient(this.patientIdToDelete);
      this.patientIdToDelete = null;
    }
  }

  /* Abre el modal para confirmar la eliminacion de un paciente.*/
  openDeleteModal(patientId: number, event: Event): void {
    event.stopPropagation();
    this.patientIdToDelete = patientId;
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  /**Eliminar un paciente.*/
  deletePatient(id: number): void {
    this.patientService.deletePatient(id).subscribe({
      next: () => {
        this.patients = this.patients.filter(patient => patient.id !== id);
        console.log('Paciente eliminado con ID:', id);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al eliminar paciente:', err);
        this.error = 'Error al eliminar paciente: ' + err.message;
      }
    });
  }

  /*Cierra el modal de confirmacion de eliminacion de paciente.*/
  closeModal(): void {
    const modalElement = document.getElementById('deleteConfirmationModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  /*Formatea la descripcion de un paciente en una oracion*/
  formatDescription(patient: Patient): string {
    return `${patient.gender}
    , de aproximadamente ${patient.approximateAge} 
    años, con piel ${patient.skinColor.toLowerCase()}
    , cabello ${patient.hair.toLowerCase()}
    , complexión ${patient.complexion.toLowerCase()}
    , ojos ${patient.eyeColor.toLowerCase()}
    , y una altura aproximada de ${patient.approximateHeight} cm.`;
  }
}

