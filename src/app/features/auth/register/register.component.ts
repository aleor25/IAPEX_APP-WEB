import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { MustMatch } from '../../../shared/validators/password.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})

export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string = "";

  private _userService = inject(UserService);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  constructor() {
    this.registerForm = this._fb.group({
      name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      secondLastName: ['', [Validators.maxLength(50), Validators.pattern(/^[a-zA-Z\s]*$/)]],
      institution: ['', Validators.required],
      position: ['', [Validators.required, Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      repeatPassword: ['', Validators.required]
    },
      {
        validators: MustMatch('password', 'repeatPassword')
      });
  }

  register(): void {
    this.errorMessage = "";

    Object.values(this.registerForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.registerForm.valid) {
      const user = this.registerForm.value;

      this._userService.registerUser(user).subscribe(
        response => {
          console.log('Registro exitoso', response);
          this._router.navigate(['/auth/login']);
        },
        error => {
          this.errorMessage = error.error?.message || 'Error al registrar el usuario.';
          this.handleRegisterError(error);
        }
      );
    } else {
      this.errorMessage = 'Por favor, complete los campos correctamente.';
    }
  }

  private handleRegisterError(error: any) {
    if (error.error && error.error.mensaje) {
      const errorMessage = error.error.mensaje;
      if (errorMessage.includes('Clave de verificación incorrecta')) {
        this.errorMessage = 'La clave de verificación proporcionada es incorrecta. Por favor, verifique e intente nuevamente.';
      } else if (errorMessage.includes('Ya existe un usuario registrado con este correo')) {
        this.errorMessage = 'Ya existe un usuario registrado con ese correo. Por favor, inicie sesión.';
      }
    } else {
      switch (error.status) {
        case 400:
          this.errorMessage = 'Formato de los datos incorrecto. Por favor, revise los datos introducidos.';
          break;
        case 404:
          this.errorMessage = 'El rol especificado no se encontró. Por favor, verifique el rol y vuelva a intentarlo.';
          break;
        case 500:
          this.errorMessage = 'Ocurrió un error en el servidor. Por favor, intente nuevamente más tarde.';
          break;
        default:
          this.errorMessage = 'Error desconocido. Por favor, contacta al administrador del sistema.';
      }
    }
  }
}