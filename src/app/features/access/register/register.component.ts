import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerError: string = "";
  registerForm = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(97)]],
    primerApellido: ['', [Validators.required, Validators.maxLength(40)]],
    segundoApellido: ['', [Validators.maxLength(40)]],
    numeroTelefono: ['', [Validators.required, Validators.maxLength(15)]],
    institucionSalud: [''],
    cargo: [''],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(76)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]],
    repeatPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(24)]],
  }, { validators: this.passwordMatchValidator });

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.loadFormData();
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password');
      const confirmPassword = control.get('repeatPassword');
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  register() {
    if (this.registerForm.valid) {
      console.log("Datos guardados localmente");
      this.saveFormData();
      this.router.navigateByUrl('/access/login');
      this.registerForm.reset();
    } else {
      this.registerForm.markAllAsTouched();
      alert("Error al ingresar los datos");
    }
  }

  saveFormData() {
    const formData = this.registerForm.value;
    localStorage.setItem('registerFormData', JSON.stringify(formData));
    console.log('Datos guardados en localStorage:', formData);
  }

  loadFormData() {
    const savedFormData = localStorage.getItem('registerFormData');
    if (savedFormData) {
      this.registerForm.setValue(JSON.parse(savedFormData));
    }
  }

  // Getters
  get nombre() {
    return this.registerForm.controls['nombre'];
  }
  get primerApellido() {
    return this.registerForm.controls['primerApellido'];
  }
  get segundoApellido() {
    return this.registerForm.controls['segundoApellido'];
  }
  get numeroTelefono() {
    return this.registerForm.controls['numeroTelefono'];
  }
  get institucionSalud() {
    return this.registerForm.controls['institucionSalud'];
  }
  get cargo() {
    return this.registerForm.controls['cargo'];
  }
  get email() {
    return this.registerForm.controls['email'];
  }
  get password() {
    return this.registerForm.controls['password'];
  }
  get repeatPassword() {
    return this.registerForm.controls['repeatPassword'];
  }
}
