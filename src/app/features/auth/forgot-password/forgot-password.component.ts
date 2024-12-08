import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/util/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  passwordResetForm: FormGroup;
  errorMessage: string = "";
  isLoading: boolean = false;

  private _userService = inject(UserService);
  private _toastService = inject(ToastService)
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  constructor() {
    this.passwordResetForm = this._fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]]
    });
  }

  sendRestoreLink() {
    this.errorMessage = "";
    this.isLoading = true;  // Indicador de carga

    // Marcar los controles como tocados para mostrar los errores de validación
    Object.values(this.passwordResetForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.passwordResetForm.valid) {
      const email = this.passwordResetForm.get('email')?.value;

      this._userService.requestPasswordReset(email).subscribe(
        response => {
          console.log('Solicitud de restablecimiento de contraseña enviada', response);
          localStorage.setItem('email', email);

          // Mostrar un mensaje de éxito y redirigir
          this._toastService.showToast(
            'Solicitud enviada con éxito',
            'Por favor, revisa tu correo electrónico y sigue los pasos establecidos.',
            'success'
          );
          this._router.navigate(['/auth/login']);
        },
        error => {
          console.error('Error al enviar la solicitud de restablecimiento de contraseña', error);

          this.errorMessage = error.error?.message ||
          'Error al enviar la solicitud de restablecimiento de contraseña.';

          // Mostrar un mensaje de error si falla el envío
          this._toastService.showToast(
            'Error en el envío de la solicitud',
            'Hubo un problema al enviar la solicitud, por favor intenta de nuevo más tarde.',
            'error'
          );
        },
        () => {
          this.isLoading = false;  // Desactivar el indicador de carga
        }
      );
    } else {
      this.errorMessage = 'Por favor, complete el campo correctamente.';
      this.isLoading = false;  // Desactivar el indicador de carga si la validación falla
    }
  }
}