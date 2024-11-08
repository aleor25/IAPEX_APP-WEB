import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  passwordResetForm: FormGroup;
  private _userService = inject(UserService);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  constructor() {
    this.passwordResetForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.passwordResetForm.valid) {
      const email = this.passwordResetForm.get('email')?.value;
      this._userService.requestPasswordReset(email).subscribe(
        response => {
          console.log('Solicitud de restablecimiento de contraseña enviada', response);
          localStorage.setItem('email', email);
          alert('Se ha enviado un correo electrónico a la dirección de correo proporcionada. Por favor, sigue las instrucciones en el correo para restablecer tu contraseña.');
          this._router.navigate(['/access/login']);
        },
        error => {
          console.error('Error al enviar la solicitud de restablecimiento de contraseña', error);
          alert('No se ha podido enviar la solicitud de restablecimiento de contraseña. Por favor, asegúrate de que el correo esté vinculado a una cuenta existente');
        }
      );
    }
  }
}