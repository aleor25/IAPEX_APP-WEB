import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html'
})

export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;

  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  constructor() {
    this.loginForm = this._formBuilder.group({
      email: ['', [
        Validators.required, 
        Validators.email, 
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(16)
      ]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this._authService.login(email, password).subscribe({
        next: () => this._router.navigate(['/dashboard/general-view']),
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error de autenticación';
        }
      });
    }
  }

  // Getters para facilitar el acceso en el template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}