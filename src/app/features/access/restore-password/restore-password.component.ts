import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-restore-password',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.css']
})
export class RestorePasswordComponent {

  restorePassword: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.restorePassword = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]]
    }, { validators: this.passwordMatchValidator });
  }
  //metodo para validar que las dos contraseñas ingresadas sean iguales 
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
  }

  onSubmit(): void {
    if (this.restorePassword.invalid) {
      this.restorePassword.markAllAsTouched();
      this.errorMessage = 'Por favor, llene todos los campos correctamente.';
      return;
    }

    this.loading = true;
    this.authService.restorePassword(this.restorePassword.value).pipe(
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