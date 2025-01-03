import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { PatientService } from '../../../../core/services/patient.service';
import { ToastService } from '../../../../core/services/util/toast.service';
import { DragAndDropComponent } from '../../../../shared/components/drag-and-drop/drag-and-drop.component';

@Component({
  selector: 'app-register-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragAndDropComponent],
  templateUrl: './register-patients.component.html',
})
export class RegisterPatientsComponent {

  patientForm: FormGroup;
  errorMessage: string = '';
  loading = false;
  tempImages: string[] = [];
  imageUploadError: { error: string }[] = [];

  private _router = inject(Router);
  private _patientService = inject(PatientService);
  private _toastService = inject(ToastService);
  private _fb = inject(FormBuilder);

  constructor() {
    this.patientForm = this._fb.group({
      name: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(50)]],
      lastName: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(50)]],
      secondLastName: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(50)]],
      gender: ['', Validators.required],
      approximateAge: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(0), Validators.max(150)]],
      skinColor: ['', Validators.required],
      eyeColor: ['', Validators.required],
      hairLength: ['', Validators.required],
      hairType: ['', Validators.required],
      hairColor: ['', Validators.required],
      customHairColor: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(50)]],
      complexion: ['', Validators.required],
      approximateHeight: ['', [Validators.required, Validators.min(50), Validators.max(300)]],
      medicalConditions: ['', Validators.maxLength(255)],
      distinctiveFeatures: ['', Validators.maxLength(255)],
      imageFiles: this._fb.array([this._fb.control('')], Validators.required)
    });
    // Desactivar inputs si se selecciona Calvo
    this.patientForm.get('hairLength')?.valueChanges.subscribe(value => {
      const hairColorControl = this.patientForm.get('hairColor');
      const hairLengthControl = this.patientForm.get('hairType');

      if (value === 'calvo') {
        hairColorControl?.disable();
        hairColorControl?.setValue('');
        hairLengthControl?.disable();
        hairLengthControl?.setValue('');
      } else {
        hairColorControl?.enable();
        hairLengthControl?.enable();
      }
    });

    this.patientForm.get('hairColor')?.valueChanges.subscribe(value => {
      const customHairColorControl = this.patientForm.get('customHairColor');
      if (value === 'otro') {
        customHairColorControl?.setValidators([Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(50)]);
        customHairColorControl?.enable();
      } else {
        customHairColorControl?.clearValidators();
        customHairColorControl?.disable();
        customHairColorControl?.setValue('');
      }
      customHairColorControl?.updateValueAndValidity();
    });
  }

  getExtensionFromMimeType(mimeType: string): string | null {
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      case 'image/heif':
        return 'heif';
      default:
        return null; // Devuelve null si el formato no es permitido
    }
  }

  updateImages(images: string[]): void {
    this.tempImages = images;
    // Si necesitas realizar más validaciones o lógica, hazlo aquí
  }

  addPatient() {
    this.errorMessage = '';
    this.imageUploadError = [];

    // Marcar todos los controles como tocados
    Object.values(this.patientForm.controls).forEach(control => {
      control.markAsTouched();
    });

    // Validación de imágenes
    if (this.tempImages.length < 3) {
      this.imageUploadError.push({
        error: `Debe subir por lo menos 3 imágenes.`
      });
    }

    if (this.patientForm.valid && this.tempImages.length >= 3) {
      const formData = new FormData();

      // Crear el valor combinado para el campo "hair"
      const hairLength = this.patientForm.get('hairLength')?.value || '';
      const hairType = this.patientForm.get('hairType')?.value || '';
      let hairColor = this.patientForm.get('hairColor')?.value || '';

      // Si el color de cabello es "otro", usar el valor de customHairColor
      if (hairColor === 'otro') {
        hairColor = this.patientForm.get('customHairColor')?.value || '';
      }

      // Construir el campo "hair" dinámicamente, evitando comas innecesarias
      let hair = '';
      if (hairLength) {
        hair = hairLength;
      }
      if (hairType) {
        hair = hair ? `${hair}, ${hairType}` : hairType;
      }
      if (hairColor) {
        hair = hair ? `${hair}, ${hairColor}` : hairColor;
      }

      // Añadir los campos del formulario al FormData
      Object.keys(this.patientForm.value).forEach(key => {
        if (key !== 'imageFiles' && key !== 'customHairColor' && key !== 'hairLength' && key !== 'hairType' && key !== 'hairColor') {
          formData.append(key, this.patientForm.value[key]);
        }
      });

      // Añadir el valor combinado de "hair" al FormData solo si tiene algún valor
      if (hair) {
        formData.append('hair', hair);
      }

      // Subida de imágenes
      const imagePromises: Promise<void>[] = [];

      this.tempImages.forEach((image, index) => {
        if (image.startsWith('data:image')) {
          const promise = fetch(image)
            .then(res => res.blob())
            .then(blob => {
              const extension = this.getExtensionFromMimeType(blob.type);
              formData.append('imageFile', blob, `image${index}.${extension}`);
            });
          imagePromises.push(promise);
        }
      });

      // Asegura que todas las imágenes se hayan procesado antes de enviar el formulario
      from(Promise.all(imagePromises)).pipe(
        tap(() => this.loading = true),
        switchMap(() => this._patientService.addPatient(formData)),
        tap(() => {
          this._toastService.showToast('Paciente registrado',
            'Los datos del paciente se han registrado correctamente.', 'success');
          this.errorMessage = '';
          this._router.navigate(['/dashboard/patients']);
        }),
        catchError(error => {
          console.error('Registro fallido', error);
          this._toastService.showToast('Error', 'Error al registrar los datos del paciente.', 'error');
          this.errorMessage = 'Error al registrar los datos del paciente.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      ).subscribe();
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }
}