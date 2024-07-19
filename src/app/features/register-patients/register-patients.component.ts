import { Component } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register-patients',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register-patients.component.html',
  styleUrl: './register-patients.component.css'
})
export class RegisterPatientsComponent {
  registerPatients: FormGroup;
  errorMessage: string | null = null;
  loading = false;

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
      estatura: ['', [Validators.required, Validators.min(1), Validators.max(300), Validators.maxLength(3)]],
      peso: ['', [Validators.required, Validators.min(1), Validators.max(700), Validators.maxLength(3)]],
      complexion: ['', Validators.required],
      postura: ['', Validators.required],
      rasgos: ['', [Validators.required, Validators.maxLength(255)]],
      condiciones: ['', [Validators.required, Validators.maxLength(255)]],
      //se añaden validaciones para campos de longitud
      nss:['',[Validators.maxLength(11)]],
      nombre:['',[Validators.maxLength(50)]]
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
}