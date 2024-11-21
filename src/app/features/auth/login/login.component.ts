import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

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

  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this._fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ]],
      rememberMe: [false]
    });
  }

  login() {
    this.errorMessage = "";

    // Marcar todos los controles como tocados
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this._authService.login(email, password).subscribe({
        next: () => this._router.navigate(['/dashboard/general-view']),
        error: (error) => {
          this.handleLoginError(error);
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete los campos correctamente';
    }
  }

  private handleLoginError(error: any) {
    switch (error.status) {
      case 400:
        this.errorMessage = 'Formato de los datos incorrecto. Por favor, revise los datos introducidos.';
        break;
      case 401:
        this.errorMessage = 'Email o contraseña incorrectos. Por favor, intente nuevamente.';
        break;
      case 404:
        this.errorMessage = 'Usuario no registrado. Por favor, registrese.';
        break;
      case 500:
        this.errorMessage = 'Ocurrió un error en el servidor. Por favor, intente nuevamente más tarde.';
        break;
      default:
        this.errorMessage = 'Error desconocido. Por favor, contacta al administrador del sistema.';
    }
  }
}