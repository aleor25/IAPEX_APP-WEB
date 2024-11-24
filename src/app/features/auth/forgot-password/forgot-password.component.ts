import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  passwordResetForm: FormGroup;
  errorMessage: string = "";

  private _userService = inject(UserService);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  constructor() {
    this.passwordResetForm = this._fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]]
    });
  }

  sendCode() {
    this.errorMessage = "";

    Object.values(this.passwordResetForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.passwordResetForm.valid) {
      const email = this.passwordResetForm.get('email')?.value;
      this._userService.requestPasswordReset(email).subscribe(
        response => {
          console.log('Solicitud de restablecimiento de contraseña enviada', response);
          localStorage.setItem('email', email);
          this._router.navigate(['/auth/login']);
        },
        error => {
          console.error('Error al enviar la solicitud de restablecimiento de contraseña', error);
          this.errorMessage = error.error?.message || 'Error al enviar la solicitud de restablecimiento de contraseña.';
        }
      );
    } else {
      this.errorMessage = 'Por favor, completa el campo correctamente';
    }
  }
}