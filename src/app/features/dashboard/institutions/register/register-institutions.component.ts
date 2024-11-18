import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InstitutionService } from '../../../../core/services/institution.service';
import { ToastService } from '../../../../core/services/util/toast.service';

@Component({
  selector: 'app-register-institutions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-institutions.component.html'
})
export class RegisterInstitutionsComponent {
  @ViewChild('myPond') myPond: any;

  institutionForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;
  isImagesChanges: boolean = false;
  tempImages: string[] = [];
  selectedImages: number[] = [];
  imageUploadError: { error: string }[] = [];
  allowedFormats = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'image/tiff', 'image/heif'];
  maxSizeInMB = 5;

  private _router = inject(Router);
  private _institutionsService = inject(InstitutionService);
  private _toastService = inject(ToastService);
  private _fb = inject(FormBuilder);

  constructor() {
    this.institutionForm = this._fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      type: ['', Validators.required],
      otherType: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50)]],
      direction: this._fb.group({
        state: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', Validators.required],
        neighborhood: ['', Validators.required],
        street: ['', Validators.required],
        number: ['', Validators.required],
      }),
      openingHours: ['', Validators.required],
      emails: [
        '',
        [Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')],
      ],
      phoneNumbers: ['', [Validators.maxLength(10), Validators.minLength(10)]],
      websites: [''],
      registrationDateTime: [new Date()],
      mapUrl: [''],
      verificationKey: ['', Validators.required],
      imageFiles: this._fb.array([]),
    });
    // Lógica para mostrar otro input si se selecciona "otro"
    this.institutionForm.get('type')?.valueChanges.subscribe(value => {
      const otherType = this.institutionForm.get('otherType');
      if (value === 'otro') {
        otherType?.setValidators([Validators.required, Validators.maxLength(50)]);
        otherType?.enable();
      } else {
        otherType?.clearValidators();
        otherType?.disable();
        otherType?.setValue('');
      }
      otherType?.updateValueAndValidity();
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

    if (totalFiles <= 1) {
      this.imageUploadError = [];
    } else {
      this.imageUploadError.push({
        error: 'No puedes subir más de 1 imagen en total.'
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

    if (totalFiles <= 1) {
      this.imageUploadError = [];
    } else {
      this.imageUploadError.push({
        error: 'No puedes subir más de 1 imagen.'
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
    const fileInput = document.getElementById('institutionImage') as HTMLInputElement;
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

  addInstitution() {
    this.errorMessage = '';
    this.imageUploadError = [];

    // Marcar todos los controles como tocados, incluyendo los controles del formulario de dirección
    Object.values(this.institutionForm.controls).forEach(control => {
      if (control instanceof FormGroup) {
        // Si el control es un FormGroup (como el grupo de dirección), marca sus controles también
        Object.values(control.controls).forEach(subControl => subControl.markAsTouched());
      } else {
        control.markAsTouched();
      }
    });

    // Validación de imágenes
    if (this.tempImages.length < 1) {
      this.imageUploadError.push({
        error: `Debes subir al menos 1 imagen.`
      });
    }

    if (this.institutionForm.valid && this.tempImages.length === 1) {
      const formData = new FormData();
      const formValue = this.institutionForm.value;

      let type = this.institutionForm.get('type')?.value || '';

      // Si el color de cabello es "otro", usar el valor de customHairColor
      if (type === 'otro') {
        type = this.institutionForm.get('otherType')?.value || '';
      }

      // Añadir los campos del formulario al FormData
      Object.keys(this.institutionForm.value).forEach(key => {
        if (key !== 'imageFiles' && key !== 'otherType') {
          formData.append(key, this.institutionForm.value[key]);
        }
      });

      // Agregar campos de dirección correctamente
      const direction = formValue.direction;
      formData.append('state', direction.state);
      formData.append('city', direction.city);
      formData.append('postalCode', direction.postalCode);
      formData.append('neighborhood', direction.neighborhood);
      formData.append('street', direction.street);
      formData.append('number', direction.number);

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
        switchMap(() => this._institutionsService.addInstitution(formData)),
        tap(() => {
          this._toastService.showToast('Institución registrado',
            'Los datos de la institución se han registrado correctamente.', 'success');
          this.errorMessage = null;
          this._router.navigate(['/dashboard/patients']);
        }),
        catchError(error => {
          console.error('Registro fallido', error);
          this._toastService.showToast('Error', 'Error al registrar los datos de la institución.', 'error');
          this.errorMessage = 'Error al registrar los datos de la institución.';
          return of(null);
        }),
        finalize(() => this.loading = false)
      ).subscribe();
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }
}