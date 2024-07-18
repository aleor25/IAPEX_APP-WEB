import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginError: string = "";
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(76)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]],
  });

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

  login() {
    if (this.loginForm.valid) {
      const savedFormData = localStorage.getItem('registerFormData');
      if (savedFormData) {
        const parsedFormData = JSON.parse(savedFormData);
        if (
          parsedFormData.email === this.loginForm.value.email &&
          parsedFormData.password === this.loginForm.value.password
        ) {
          console.log("Inicio de sesión exitoso");
          this.authService.login(parsedFormData.email, parsedFormData.password).subscribe({
            next: () => this.router.navigate(['/dashboard/general-view']),
            error: (err) => console.error('login failed', err)
          });
          this.loginForm.reset();
        } else {
          this.loginError = "Correo electrónico o contraseña incorrectos";
        }
      } else {
        this.loginError = "No hay usuarios registrados";
      }
    } else {
      this.loginForm.markAllAsTouched();
      alert("Error al ingresar los datos");
    }
  }

  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }
}
