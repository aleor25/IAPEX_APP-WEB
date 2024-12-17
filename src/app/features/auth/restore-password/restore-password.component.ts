import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/util/toast.service';
import { MustMatch } from '../../../shared/validators/password.validator';

@Component({
  selector: 'app-restore-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './restore-password.component.html'
})
export class RestorePasswordComponent {

  restorePasswordForm: FormGroup;
  passwordResetForm: FormGroup;
  errorMessage: string = "";
  isLoading: boolean = false;
  isEmailSent: boolean = false;
  urlParams = new URLSearchParams(window.location.search);
  verificationCode = this.urlParams.get('code');
  isForgotPassword: boolean = false;
  isRestorePassword: boolean = false;
  isPasswordRestored: boolean = false;
  title: string = '';
  message: string = '';
  icon: string = '';

  private _userService = inject(UserService);
  private _fb = inject(FormBuilder);

  constructor() {
    this.passwordResetForm = this._fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]]
    });

    this.restorePasswordForm = this._fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      repeatPassword: ['', [Validators.required]]
    },
      {
        validators: MustMatch('newPassword', 'repeatPassword')
      });
  }

  ngOnInit(): void {
    if (this.verificationCode) {
      this.isForgotPassword = false;
      this.isRestorePassword = true;
      this.title = 'Restablezca su contraseña';
      this.message = '      Ingrese su nueva contraseña y repitala. Posteriormente, haga clic en el botón para restablecer su contraseña.';
      this.icon = 'bi bi-shield-lock text-primary';
      localStorage.setItem('verificationCode', this.verificationCode);
    } else {
      this.isForgotPassword = true;
      this.isRestorePassword = false;
      this.restorePasswordForm.disable();
      this.title = '¿Olvidó su contraseña?';
      this.message = 'Ingrese su correo electrónico para recibir instrucciones y continuar con el restablecimiento de su contraseña.';
      this.icon = 'bi bi-shield-exclamation text-primary';
    }
  }

  requestPasswordReset() {
    this.errorMessage = "";
    this.isLoading = true;  // Indicador de carga

    // Marcar los controles como tocados para mostrar los errores de validación
    Object.values(this.passwordResetForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.passwordResetForm.valid) {
      const email = this.passwordResetForm.get('email')?.value;

      this._userService.requestPasswordReset(email).subscribe(
        () => {
          this.isEmailSent = true;
          this.isForgotPassword = false;
          this.isRestorePassword = false;
          this.title = 'Solicitud enviada';
          this.message = 'Hemos enviado un correo electrónico a la dirección proporcionada. Por favor, sigue las instrucciones para restablecer tu contraseña.';
          this.icon = 'bi bi-envelope-open text-primary';

          localStorage.setItem('email', email);
        },
        error => {
          this.errorMessage = error.error?.message ||
            'Error al enviar la solicitud de restablecimiento de contraseña.';
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
    } else {
      this.errorMessage = 'Por favor, complete el campo correctamente.';
      this.isLoading = false;
    }
  }

  restorePassword() {
    this.errorMessage = "";

    Object.values(this.restorePasswordForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.restorePasswordForm.valid) {
      const { newPassword } = this.restorePasswordForm.value;

      const request = {
        verificationCode: this.verificationCode || '',
        newPassword
      };

      this._userService.resetPassword(request).subscribe(
        () => {
          this.isRestorePassword = false;
          this.isPasswordRestored = true;
          this.title = 'Contraseña restablecida';
          this.message = 'Tu contraseña ha sido restablecida correctamente. Haz clic en el botón para iniciar sesión.';
          this.icon = 'bi bi-shield-check text-primary';
        },
        error => {
          this.errorMessage = error.error?.message || 'Error al restablecer la contraseña.';
          this.isRestorePassword = true;
        }
      );
    } else {
      this.errorMessage = 'Por favor, complete los campos correctamente.';
    }
  }
}