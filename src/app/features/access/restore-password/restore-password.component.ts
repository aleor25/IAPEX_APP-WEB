import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RestorePasswordService } from '../../../core/services/access/restore-password/restore-password.service';

@Component({
  selector: 'app-restore-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.css']
})
export class RestorePasswordComponent implements OnInit {

  restorePasswordForm!: FormGroup; // Uso del operador !

  constructor(
    private fb: FormBuilder,
    private restorePasswordService: RestorePasswordService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.restorePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });

    // Recuperar el código de verificación desde la URL y almacenarlo en el almacenamiento local
    const urlParams = new URLSearchParams(window.location.search);
    const verificationCode = urlParams.get('code');
    if (verificationCode) {
      localStorage.setItem('verificationCode', verificationCode);
    }
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const { newPassword, confirmPassword } = form.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.restorePasswordForm.valid) {
      const { newPassword, confirmPassword } = this.restorePasswordForm.value;
      const verificationCode = localStorage.getItem('verificationCode');
      
      if (verificationCode === null) {
        console.error('Código de verificación no encontrado en el almacenamiento local');
        alert('Código de verificación no encontrado. Por favor, inténtalo de nuevo.');
        return;
      }

      const request = {
        verificationCode,
        newPassword
      };

      console.log('Solicitud para cambiar la contraseña:', request);

      this.restorePasswordService.resetPassword(request).subscribe(
        response => {
          console.log('Contraseña actualizada correctamente', response);
          alert('Contraseña actualizada correctamente.');
          this.router.navigate(['/access/login']);
        },
        error => {
          console.error('Error al restablecer la contraseña', error);
          alert('Error al restablecer la contraseña. Por favor, inténtalo de nuevo.');
        }
      );
    } else {
      console.warn('El formulario no es válido. Verifica los campos y vuelve a intentar.');
      alert('El formulario no es válido, ambos campos deben coincidir. Verifica los campos y vuelve a intentar.');
      console.log('Estado del formulario:', this.restorePasswordForm.value);
      console.log('Errores del formulario:', this.restorePasswordForm.errors);
    }
  }
}
