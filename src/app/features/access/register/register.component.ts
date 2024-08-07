import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../../core/services/access/register/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string | null = null;

  private _registerService = inject(RegisterService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  constructor() {
    this.registerForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      secondLastName: ['', [Validators.maxLength(50)]],
      institution: ['', Validators.required],
      position: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      repeatPassword: ['', Validators.required]
    }, 
    { validators: this.passwordMatcher });
  }

  register(): void {
    if (this.registerForm.valid) {
      const user = this.registerForm.value;

      this._registerService.register(user).subscribe(
        response => {
          console.log('Registro exitoso', response);
          this._router.navigate(['/access/login']);
        },
        error => {
          this.errorMessage = error.error?.message || 'Error al registrar el usuario.';
          console.error('Error de registro:', error);
        }
      );
    } else {
      console.error('Formulario no válido');
    }
  }

  // Valida que las contraseñas coincidan
  private passwordMatcher(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const repeatPassword = formGroup.get('repeatPassword');
    if (password?.value !== repeatPassword?.value) {
      repeatPassword?.setErrors({ passwordMismatch: true });
    } else {
      repeatPassword?.setErrors(null);
    }
    return null;
  }

  get name() { return this.registerForm.get('name'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get secondLastName() { return this.registerForm.get('secondLastName'); }
  get institution() { return this.registerForm.get('institution'); }
  get position() { return this.registerForm.get('position'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get repeatPassword() { return this.registerForm.get('repeatPassword'); }
}
