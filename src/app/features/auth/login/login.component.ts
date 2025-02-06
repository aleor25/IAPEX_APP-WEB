import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  
  loginForm: FormGroup;
  errorMessage: string = "";
  isLoading = false;
  failedAttempts = 0;
  maxAttempts = 5;  // Máximo de intentos antes de bloquear

  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      rememberMe: [false]
    });
  }

  login() {
    this.errorMessage = "";

    if (this.failedAttempts >= this.maxAttempts) {
      this.errorMessage = "Demasiados intentos fallidos. Inténtelo más tarde.";
      return;
    }

    // Marcar todos los controles como tocados
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const email = this.loginForm.value.email.trim(); // Eliminar espacios en blanco
      const password = this.loginForm.value.password.trim();

      this.isLoading = true;  // Desactiva el botón
      this._authService.login(email, password)
        .pipe(finalize(() => this.isLoading = false)) // Asegura que isLoading siempre se desactiva
        .subscribe({
          next: () => {
            this.failedAttempts = 0;  // Restablecer intentos fallidos
            this._router.navigate(['/dashboard/general-view']);
          },
          error: (error) => {
            this.failedAttempts++;  // Incrementar intentos fallidos
            this.handleLoginError(error);
          }
        });
    } else {
      this.errorMessage = 'Por favor, complete los campos correctamente';
    }
  }

  private handleLoginError(error: any) {
    let genericError = 'Error desconocido. Por favor, contacta al administrador del sistema.';
    
    const errorMessages: { [key: number]: string } = {
      400: 'Formato de los datos incorrecto.',
      401: 'Email o contraseña incorrectos.',
      404: 'Usuario no registrado.',
      442: 'Correo no autenticado. Revisa tu correo.',
      500: 'Error en el servidor. Intenta más tarde.'
    };

    this.errorMessage = errorMessages[error.status] || genericError;
  }
}
