import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ForgotPasswordService } from '../../../core/services/access/forgot-password/forgot-password.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  
  passwordResetForm: FormGroup;
  private _router = inject(Router);

  constructor(private fb: FormBuilder, private forgotPasswordService: ForgotPasswordService) {
    this.passwordResetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.passwordResetForm.valid) {
      const email = this.passwordResetForm.get('email')?.value;
      this.forgotPasswordService.sendVerificationCode(email).subscribe(
        response => {
          console.log('Código de verificación enviado', response);
          localStorage.setItem('email', email);
          this._router.navigate(['/access/verified-email']);
        },
        error => {
          console.error('Error al enviar el código de verificación', error);
        }
      );
    }
  }
}
