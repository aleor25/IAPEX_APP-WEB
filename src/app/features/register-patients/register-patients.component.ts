import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

@Component({
  selector: 'app-register-patients',
  standalone: true,
  imports: [RouterLink, CommonModule, FilePondModule, ReactiveFormsModule],
  templateUrl: './register-patients.component.html',
  styleUrls: ['./register-patients.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterPatientsComponent {
  registerPatients: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  labelIdle = "Arrastre y suelte sus archivos o <span class='filepond--label-action'> Examin|ar </span>";
  maxFiles = 12;
  minFiles = 8;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerPatients = this.formBuilder.group({
      colorCabello: ['', Validators.required],
      tipoCabello: ['', Validators.required],
      colorPiel: ['', Validators.required],
      colorOjos: ['', Validators.required],
      sexo: ['', Validators.required],
      estatura: ['', [Validators.required, Validators.min(1)]],
      peso: ['', [Validators.required, Validators.min(1), Validators.max(700), Validators.maxLength(3)]],
      complexion: ['', Validators.required],
      postura: ['', Validators.required],
      rasgos: ['', [Validators.required, Validators.maxLength(150)]],
      condiciones: ['', [Validators.required, Validators.maxLength(150)]],
      nss: ['', [Validators.maxLength(11)]],
      nombre: ['', [Validators.maxLength(50)]],
      imageFiles: [[]]
    });
  }

  onSubmit(): void {
    if (this.registerPatients.invalid) {
      this.registerPatients.markAllAsTouched();
      this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
      return;
    }
    this.loading = true;


    this.authService.registerPatients(this.registerPatients.value).pipe(

      tap(() => {
        this.errorMessage = null;
        this.router.navigate(['/dashboard']);
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
  }

  onAddFile(event: any) {
    const file = event.file;
    const imageFilesControl = this.registerPatients.get('imageFiles') as FormArray;
    imageFilesControl.push(this.formBuilder.control(file));
  }

  get imageFilesControl() {
    return this.registerPatients.get('imageFiles') as FormArray;
  }
}