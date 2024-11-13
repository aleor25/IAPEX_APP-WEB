import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PatientService } from '../../../../core/services/patient.service';

@Component({
  selector: 'app-register-patients',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './register-patients.component.html',
})
export class RegisterPatientsComponent {

  registerPatients: FormGroup;
  errorMessage: string | null = null;
  loading = false;
  isImagesChanges: boolean = false;
  tempImages: string[] = [];
  selectedImages: number[] = [];
  imageUploadError: { error: string }[] = [];

  private _router = inject(Router);
  private _patientService = inject(PatientService);
  private _fb = inject(FormBuilder);

  constructor() {
    this.registerPatients = this._fb.group({
      name: ['', [Validators.maxLength(50)]],
      lastName: ['', [Validators.maxLength(50)]],
      secondLastName: ['', [Validators.maxLength(50)]],
      gender: ['', Validators.required],
      approximateAge: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(0), Validators.max(150)]],
      skinColor: ['', Validators.required],
      eyeColor: ['', Validators.required],
      hair: ['', Validators.required],
      hairColor: ['', Validators.required],
      customHairColor: [{ value: '', disabled: true }, Validators.required],
      hairLength: ['', Validators.required],
      complexion: ['', Validators.required],
      approximateHeight: ['', [Validators.required, Validators.min(50), Validators.max(300)]],
      medicalConditions: ['', Validators.maxLength(255)],
      distinctiveFeatures: ['', Validators.maxLength(255)],
      additionalNotes: ['', Validators.maxLength(255)],
      imageFiles: this._fb.array([this._fb.control('')], Validators.required)
    });
    // Desactivar inputs si se selecciona Calvo
    this.registerPatients.get('hair')?.valueChanges.subscribe(value => {
      const hairColorControl = this.registerPatients.get('hairColor');
      const hairLengthControl = this.registerPatients.get('hairLength');

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


    this.registerPatients.get('hairColor')?.valueChanges.subscribe(value => {
      const customHairColorControl = this.registerPatients.get('customHairColor');
      if (value === 'otro') {
        customHairColorControl?.setValidators([Validators.required, Validators.maxLength(50)]);
        customHairColorControl?.enable();
      } else {
        customHairColorControl?.clearValidators();
        customHairColorControl?.disable();
        customHairColorControl?.setValue(''); // Limpia el campo cuando no es "Otro"
      }
      customHairColorControl?.updateValueAndValidity();
    });

  }

  // Método para arrastrar archivos sobre el área
  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // Método para manejar el drop (soltar) de archivos
  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      this.onFilesDropped(event.dataTransfer.files);
    }
  }

  // Procesa los archivos soltados
  onFilesDropped(files: FileList) {
    const allowedFormats = ['image/jpg', 'image/png', 'image/jpeg', 'image/webp', 'image/heif'];
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

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
      if (!allowedFormats.includes(file.type)) {
        this.imageUploadError.push({
          error: `${file.name} es un ${file.name.split('.').pop()} y solo se permiten JPG, PNG, JPEG, WEBP y HEIF.`
        });
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.imageUploadError.push({
          error: `${file.name} es demasiado grande. El tamaño máximo permitido es ${maxSizeInMB} MB.`
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

  onSubmit(): void {
    this.errorMessage = '';
    this.imageUploadError = [];

    // Marcar todos los controles como tocados
    Object.values(this.registerPatients.controls).forEach(control => {
      control.markAsTouched();
    });

    // Validación de imágenes
    if (this.tempImages.length === 0) {
      this.imageUploadError.push({
        error: `Las imágenes son obligatorias.`
      });
    }

    if (this.registerPatients.valid && this.tempImages.length > 0) {
      const formData = new FormData();

      // Añadir los campos del formulario al FormData
      Object.keys(this.registerPatients.value).forEach(key => {
        if (key !== 'imageFiles' && key !== 'customHairColor') {
          formData.append(key, this.registerPatients.value[key]);
        }
      });

      // Añadir el valor de customHairColor si hairColor es "Otro"
      if (this.registerPatients.get('hairColor')?.value === 'otro') {
        formData.append('hairColor', this.registerPatients.get('customHairColor')?.value || '');
      }

      // Subida de imágenes
      const allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/heif'];
      const imagePromises: Promise<void>[] = [];

      this.tempImages.forEach((image, index) => {
        if (image.startsWith('data:image')) {
          const promise = fetch(image)
            .then(res => res.blob())
            .then(blob => {
              if (allowedFormats.includes(blob.type)) {
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
      Promise.all(imagePromises).then(() => {
        this.loading = true;

        this._patientService.registerPatients(formData).pipe(
          tap(() => {
            this.errorMessage = null;
            this._router.navigate(['/dashboard/patients']);
          }),
          catchError(error => {
            console.error('Registro fallido', error);
            this.errorMessage = 'Error al registrar los datos.';
            return of(null);
          }),
          finalize(() => {
            this.loading = false;
          })
        ).subscribe();
        console.log(formData);
      for (const pair of (formData as any).entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }

  onFilesSelected(event: Event) {
    this.isImagesChanges = true;
    const input = event.target as HTMLInputElement;
    const allowedFormats = ['image/jpg', 'image/png', 'image/jpeg', 'image/webp', 'image/heif'];
    const maxSizeInMB = 4;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

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
      if (!allowedFormats.includes(file.type)) {
        this.imageUploadError.push({
          error: `${file.name} es un ${file.name.split('.').pop()} y solo se permiten JPG, PNG, JPEG, WEBP y HEIF.`
        });
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.imageUploadError.push({
          error: `${file.name} es demasiado grande. El tamaño máximo permitido es ${maxSizeInMB} MB.`
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

  triggerFileInput() {
    const fileInput = document.getElementById('patientImages') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  removeImage(index: number) {
    this.tempImages.splice(index, 1);
    this.selectedImages = this.selectedImages.filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));
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
}