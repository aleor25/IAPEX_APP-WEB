import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../core/services/access/login/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string | null = null;

  private _loginService = inject(LoginService);  
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  constructor() {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this._loginService.login(email, password).subscribe(
        response => {
          console.log('Inicio de sesión exitoso', response);
          this._router.navigate(['/dashboard/general-view']);
        },
        error => {
          this.errorMessage = error;  // Muestra el mensaje de error
        }
      );
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
