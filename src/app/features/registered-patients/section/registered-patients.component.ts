import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { PatientService } from '../../../../core/services/patients/patient.service';
import { Patient } from '../../../../core/models/patients/patient.model';

@Component({
  selector: 'app-registered-patients',
  templateUrl: './registered-patients.component.html',
  styleUrls: ['./registered-patients.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RegisteredPatientsComponent implements OnInit {
  patients: Patient[] = [];

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.getAllPatients();
  }

  getAllPatients(): void {
    this.patientService.getAllPatients().subscribe((data: Patient[]) => {
      this.patients = data;
    });
  }

  addPatient(patient: Patient): void {
    const formData = this.createFormData(patient);
    this.patientService.addPatient(formData).subscribe(newPatient => {
      this.patients.push(newPatient);
      console.log('Paciente agregado:', newPatient);
    });
  }

  updatePatient(patient: Patient): void {
    const formData = this.createFormData(patient);
    this.patientService.updatePatient(patient.id, formData).subscribe(updatedPatient => {
      const index = this.patients.findIndex(p => p.id === updatedPatient.id);
      if (index !== -1) {
        this.patients[index] = updatedPatient;
      }
      console.log('Paciente actualizado:', updatedPatient);
    });
  }

  deletePatient(id: number): void {
    this.patientService.deletePatient(id).subscribe(() => {
      this.patients = this.patients.filter(patient => patient.id !== id);
      console.log('Paciente eliminado con ID:', id);
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
    formData.append('registeringUserId', patient.registeringUserId.toString());
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

    // La institución se envía como ID
    formData.append('institutionId', patient.institution.id.toString());

    // Adjuntar imágenes
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
}

