import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../core/services/access/login/login.service';
import { UserWebService } from '../../../core/services/user-web.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  submitted = false;
  loginError = false;
  
  private _loginService = inject(LoginService);  
  private _router = inject(Router);
  private _formBuilder = inject(FormBuilder);

  constructor
  (    
    private userWebService: UserWebService,
  ) 
  {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]]
    });
  }

  //login(): void {
    //if (this.loginForm.valid) {
  //    const { email, password } = this.loginForm.value;
//
  //    this._loginService.login(email, password).subscribe(
    //    response => {
      //    console.log('Inicio de sesión exitoso', response);
        //  this._router.navigate(['/dashboard/general-view']);
        //},
        //error => {
          //this.errorMessage = error;  // Muestra el mensaje de error
        //}
      //);
    //}
  //}

  
  login() {
    console.log('Iniciando el proceso de inicio de sesión...');
    this.submitted = true;
    this.loginError = false;
  
    if (this.loginForm.valid) {
      console.log('El formulario de inicio de sesión es válido');
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
  
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
  
      if (email && password) {
        console.log('Email y contraseña presentes, intentando iniciar sesión...');
        this.userWebService.login(email, password).subscribe(
          response => {
            if (response.token) {
              console.log('Token recibido, estableciendo token y navegando al dashboard...');
              this.userWebService.setTokenWithExpiration(response.token);
              const role = response.authorities && response.authorities.length > 0 
                ? response.authorities[0].authority 
                : 'USER';
              localStorage.setItem('userRole', role);
              this._router.navigate(['/dashboard/general-view']);
            } else {
              console.log('No se recibió token, mostrando error de autenticación');
              this.errorMessage = 'Error de autenticación';
            }
          },
          (error: HttpErrorResponse) => {
            console.error('Error de login:', error);
            this.loginError = true;
            this.errorMessage = error.error?.message || 'Error del servidor. Por favor, intente nuevamente más tarde.';
          }
        );
      } else {
        console.log('Email o contraseña faltantes');
      }
    } else {
      console.log('El formulario de inicio de sesión no es válido');
    }
  }
  

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}

