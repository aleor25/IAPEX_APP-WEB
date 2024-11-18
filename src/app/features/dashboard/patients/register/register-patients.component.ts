import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { PatientService } from '../../../../core/services/patient.service';
import { ToastService } from '../../../../core/services/util/toast.service';

@Component({
  selector: 'app-register-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-patients.component.html',
})
export class RegisterPatientsComponent {

  patientForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;
  isImagesChanges: boolean = false;
  tempImages: string[] = [];
  selectedImages: number[] = [];
  imageUploadError: { error: string }[] = [];
  allowedFormats = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'image/tiff', 'image/heif'];
  maxSizeInMB = 5;

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

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      this.onFilesDropped(event.dataTransfer.files);
    }
  }

  onFilesDropped(files: FileList) {
    const maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;
    const newImageFiles = Array.from(files);
    const totalFiles = this.tempImages.length + newImageFiles.length;

    if (totalFiles <= 6) {
      this.imageUploadError = [];
    } else {
      this.imageUploadError.push({
        error: 'No puedes subir más de 6 imágenes en total.'
      });
      return;
    }

    newImageFiles.forEach((file) => {
      if (!this.allowedFormats.includes(file.type)) {
        this.imageUploadError.push({
          error: `${file.name} es un ${file.name.split('.').pop()} y solo se permiten JPG, PNG, JPEG, WEBP y HEIF.`
        });
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.imageUploadError.push({
          error: `${file.name} es demasiado grande. El tamaño máximo permitido es ${this.maxSizeInMB} MB.`
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string' && !this.tempImages.includes(reader.result)) {
          this.tempImages.push(reader.result);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  onFilesSelected(event: Event) {
    this.isImagesChanges = true;
    const input = event.target as HTMLInputElement;
    const maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;

    if (!input || !input.files) {
      return;
    }

    const files = input.files;
    const newImageFiles = Array.from(files);
    const totalFiles = this.tempImages.length + newImageFiles.length;

    if (totalFiles <= 6) {
      this.imageUploadError = [];
    } else {
      this.imageUploadError.push({
        error: 'No puedes subir más de 6 imágenes en total.'
      });
      input.value = '';
      return;
    }

    newImageFiles.forEach((file) => {
      if (!this.allowedFormats.includes(file.type)) {
        this.imageUploadError.push({
          error: `${file.name} es un ${file.name.split('.').pop()} y solo se permiten JPG, PNG, JPEG, WEBP y HEIF.`
        });
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.imageUploadError.push({
          error: `${file.name} es demasiado grande. El tamaño máximo permitido es ${this.maxSizeInMB} MB.`
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string' && !this.tempImages.includes(reader.result)) {
          this.tempImages.push(reader.result);
        }
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  removeImage(index: number) {
    this.tempImages.splice(index, 1);
    this.selectedImages = this.selectedImages.filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));
  }

  triggerFileInput() {
    const fileInput = document.getElementById('patientImages') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
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
        error: `Debes subir por lo menos 3 imágenes.`
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
              if (this.allowedFormats.includes(blob.type)) {
                const extension = this.getExtensionFromMimeType(blob.type);
                formData.append('imageFile', blob, `image${index}.${extension}`);
              } else {
                this.imageUploadError.push({
                  error: `La imagen ${index + 1} tiene un formato no permitido: ${blob.type}. Solo se permiten JPG, PNG, JPEG, WEBP y HEIF.`
                });
              }
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
          this.errorMessage = null;
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