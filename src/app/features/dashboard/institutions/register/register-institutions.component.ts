import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FilePondModule } from 'ngx-filepond';
import { InstitutionService } from '../../../../core/services/institution.service';

@Component({
  selector: 'app-register-institutions',
  standalone: true,
  imports: [RouterLink, CommonModule, FilePondModule, ReactiveFormsModule],
  templateUrl: './register-institutions.component.html'
})
export class RegisterInstitutionsComponent {
  @ViewChild('myPond') myPond: any;

  registerInstitutions: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  private _institutionsService = inject(InstitutionService);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  constructor() {
    this.registerInstitutions = this._fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      type: ['', Validators.required],
      direction: this._fb.group({
        state: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', Validators.required],
        neighborhood: ['', Validators.required],
        street: ['', Validators.required],
        number: ['', Validators.required],
      }),
      openingHours: [''],
      emails: [
        '',
        [Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')],
      ],
      phoneNumbers: [''],
      websites: [''],
      registrationDateTime: [new Date()],
      image: [''],
      imageUrl: [''],
      mapUrl: [''],
      verificationKey: [''],
      imageFiles: this._fb.array([]),
    });
  }

  get imageFiles() {
    return this.registerInstitutions.get('imageFiles') as FormArray;
  }

  onSubmit(): void {
    if (this.registerInstitutions.valid) {
      const formData = new FormData();
      const formValue = this.registerInstitutions.value;

      // Agregar campos base
      Object.keys(formValue).forEach((key) => {
        if (key !== 'direction' && key !== 'imageFiles') {
          formData.append(key, formValue[key]);
          console.log(`Agregando ${key}:`, formValue[key]);
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
      console.log('Campos de dirección agregados:', direction);

      // Agregar archivos de imagen
      if (this.imageFiles.length > 0) {
        this.imageFiles.controls.forEach((control, index) => {
          formData.append('imageFile', control.value);
          console.log(`Agregando archivo de imagen ${index + 1}:`, control.value);
        });
      }

      console.log('Datos del formulario siendo enviados:', formData);

      this.loading = true;

      this._institutionsService
        .addInstitution(formData)
        .pipe(
          tap((response) => {
            console.log('Respuesta del servidor:', response);
            this.errorMessage = null;
            this._router.navigate(['/dashboard/institutions']);
          }),
          catchError((error) => {
            console.error('Registro fallido', error);
            this.errorMessage =
              error.error?.message || 'Error al registrar los datos.';
            return of(null);
          }),
          finalize(() => {
            this.loading = false;
            console.log('Envío del formulario finalizado.');
          })
        )
        .subscribe();
    } else {
      this.markFormGroupTouched(this.registerInstitutions);
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      console.log('El formulario no es válido. Marcando todos los controles como tocados.');
    }
  }

  // Método auxiliar para marcar todos los controles como tocados
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      console.log('Marcando control como tocado:', control);

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // FilePond configuration and handlers remain the same
  pondOptions = {
    class: 'my-filepond',
    multiple: true,
    labelIdle:
      'Arrastra y suelta tus archivos o <span class="filepond--label-action">Examinar</span>',
    acceptedFileTypes: 'image/jpeg, image/png',
    required: true,
    allowMultiple: true,
    maxFiles: 1,
    minFiles: 0,
    instantUpload: true,
    credits: false,
  };

  pondHandleInit() {
    console.log('FilePond initialized', this.myPond);
  }

  pondHandleAddFile(event: any) {
    const imageFiles = this.registerInstitutions.get('imageFiles') as FormArray;
    imageFiles.push(this._fb.control(event.file.file));
  }

  pondHandleRemoveFile(event: any) {
    const imageFiles = this.registerInstitutions.get('imageFiles') as FormArray;
    const index = imageFiles.controls.findIndex(
      (control) => control.value === event.file
    );
    if (index !== -1) {
      imageFiles.removeAt(index);
    }
  }

  get imageFilesLength(): number {
    return this.imageFiles.length;
  }
}