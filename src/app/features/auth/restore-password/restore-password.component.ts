import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { MustMatch } from '../../../shared/validators/password.validator';

@Component({
  selector: 'app-restore-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './restore-password.component.html'
})
export class RestorePasswordComponent implements OnInit {

  restorePasswordForm: FormGroup;
  errorMessage: string = "";

  private _fb = inject(FormBuilder);
  private _userService = inject(UserService);
  private _router = inject(Router);

  constructor() {
    this.restorePasswordForm = this._fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      repeatPassword: ['', [Validators.required]]
    },
    {
      validators: MustMatch('password', 'repeatPassword')
    });
}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const verificationCode = urlParams.get('code');
    if (verificationCode) {
      localStorage.setItem('verificationCode', verificationCode);
    }
  }

  restorePassword() {
    this.errorMessage = "";

    Object.values(this.restorePasswordForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.restorePasswordForm.valid) {
      const { newPassword } = this.restorePasswordForm.value;
      const verificationCode = localStorage.getItem('verificationCode');

      if (verificationCode === null) {
        console.error('Código de verificación no encontrado en el almacenamiento local');
        this.errorMessage = 'Código de verificación no encontrado. Por favor, solicita un nuevo enlace para restablecer la contraseña';
        return;
      }

      const request = {
        verificationCode,
        newPassword
      };

      console.log('Solicitud para cambiar la contraseña:', request);

      this._userService.resetPassword(request).subscribe(
        response => {
          console.log('Contraseña actualizada correctamente', response);
          this._router.navigate(['/auth/login']);
        },
        error => {
          console.error('Error al restablecer la contraseña', error);
          this.errorMessage = error.error?.message || 'Error al restablecer la contraseña.';
        }
      );
    } else {
      this.errorMessage = 'Por favor, complete los campos correctamente.';
    }
  }
}
