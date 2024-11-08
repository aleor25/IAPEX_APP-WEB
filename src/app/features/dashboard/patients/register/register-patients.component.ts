import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { PatientService } from '../../../../core/services/patient.service';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

@Component({
  selector: 'app-register-patients',
  standalone: true,
  imports: [RouterLink, CommonModule, FilePondModule, ReactiveFormsModule],
  templateUrl: './register-patients.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterPatientsComponent {

  @ViewChild('myPond') myPond: any;

  registerPatients: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  labelIdle = "Arrastre y suelte sus archivos o <span class='filepond--label-action'> Examin|ar </span>";
  maxFiles = 4;
  minFiles = 2;

  private _router = inject(Router);
  private _patientService = inject(PatientService);
  private _fb = inject(FormBuilder);

  constructor() {
    this.registerPatients = this._fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      secondLastName: ['', [Validators.required, Validators.maxLength(50)]],
      gender: ['', Validators.required],
      approximateAge: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(0), Validators.max(150)]],
      skinColor: ['', Validators.required],
      eyeColor: ['', Validators.required],
      hair: ['', Validators.required],
      hairColor: ['', Validators.required],
      hairLength: ['', Validators.required],
      complexion: ['', Validators.required],
      approximateHeight: ['', [Validators.required, Validators.min(50), Validators.max(300)]],
      medicalConditions: ['', Validators.maxLength(255)],
      distinctiveFeatures: ['', Validators.maxLength(255)],
      additionalNotes: ['', Validators.maxLength(255)],
      imageFiles: this._fb.array([this._fb.control('')], Validators.required)
    });
  }

  onSubmit(): void {
    if (this.registerPatients.valid) {
      const formData = new FormData();

      // Añadir los campos del formulario al FormData
      Object.keys(this.registerPatients.value).forEach(key => {
        if (key !== 'imageFiles') {
          formData.append(key, this.registerPatients.value[key]);
        }
      });

      // Añadir los archivos de imagen
      const imageFiles = this.registerPatients.get('imageFiles') as FormArray;
      imageFiles.controls.forEach((control, index) => {
        formData.append('imageFile', control.value);
      });

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
    } else {
      this.registerPatients.markAllAsTouched();
    }
  }

  pondOptions = {
    class: 'my-filepond',
    multiple: true,
    labelIdle: 'Arrastra y suelta tus archivos o <span class="filepond--label-action">Examinar</span>',
    acceptedFileTypes: 'image/jpeg, image/png',
    status: 0,
    required: true,
    allowDrop: true,
    allowBrowse: true,
    allowPaste: true,
    allowMultiple: true,
    maxFiles: 4,
    minFiles: 2,
    instantUpload: true,
    dropOnElement: true,
    labelFileLoading: 'Cargando...',
    labelFileLoadError: 'Error de carga',
    labelFileProcessing: 'Procesando...',
    labelFileProcessingComplete: 'Procesamiento completado',
    labelFileProcessingAborted: 'Carga abortada',
    labelFileProcessingError: 'Error en la carga',
    labelFileRemoveError: 'Error al eliminar',
    labelTapToCancel: 'Toca para cancelar',
    labelTapToRetry: 'Toca para reintentar',
    labelTapToUndo: 'Toca para deshacer',
    credits: false
  };

  pondHandleInit() {
    console.log('Se ha inicializado FilePond', this.myPond);
  }

  pondHandleAddFile(event: any) {
    console.log('Se ha agregado un archivo', event);
    const imageFiles = this.registerPatients.get('imageFiles') as FormArray;
    imageFiles.push(this._fb.control(event.file.file));
  }

  pondHandleRemoveFile(event: any) {
    const imageFiles = this.registerPatients.get('imageFiles') as FormArray;
    const index = imageFiles.controls.findIndex(control => control.value === event.file);
    if (index !== -1) {
      imageFiles.removeAt(index);
    }
  }

  get imageFilesLength(): number {
    return (this.registerPatients.get('imageFiles') as FormArray).length;
  }
}