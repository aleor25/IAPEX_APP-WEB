import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

// se crean las validaciones del formulario
export class RegisterComponent {
  registerError:string="";
  registerForm=this.formBuilder.group({
    nombre:['',[Validators.required,Validators.maxLength(97)]],
    primerApellido:['',[Validators.required,Validators.maxLength(40)]],
    segundoApellido:['',[Validators.maxLength(40)]],
    numeroTelefono:['',[Validators.required,Validators.maxLength(15)]],
    institucionSalud:[''],
    cargo:[''],
    email:['',[Validators.required,Validators.email,Validators.maxLength(76)]],
    password:['',[Validators.required,Validators.minLength(8),Validators.maxLength(24)]],
    repitPassword:['',[Validators.required,Validators.minLength(8),Validators.maxLength(24)]],
  }, {Validators: this.passwordMatchValidator})

  // constructor de RegisterComponent

  constructor(private formBuilder:FormBuilder,private router:Router){}

/*   metodo validar que la contraseña sea la misma,
  en el campo contraseña y que sea la misma que en el campo repetir contraseña */

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('contraseña');
      const confirmPassword = control.get('repetirContraseña');
      
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordMismatch: true };

      }
      return null;
    };
  }
<<<<<<< HEAD:src/app/features/access/register/register.component.ts

  register() {
    if (this.registerForm.valid) {
      console.log("Datos guardados localmente");
      this.saveFormData();
      this.router.navigateByUrl('/access/login');
=======
  
  // metodo para saber si es valido el formulario
  register(){
    if(this.registerForm.valid){
      console.log("llamar al servicio")
      this.router.navigateByUrl('/login');
>>>>>>> 887aef7cb6652d5e4e73bba99eefe9db412c55fd:src/app/features/register/register.component.ts
      this.registerForm.reset();
    }
    else{
      this.registerForm.markAllAsTouched();
      alert("Error al ingresar los datos")
    }
  }
  // metodos get
  get nombre(){
    return this.registerForm.controls['nombre'];
  }
  get primerApellido(){
    return this.registerForm.controls['primerApellido'];
  }
  get segundoApellido(){
    return this.registerForm.controls['segundoApellido'];
  }
  get numeroTelefono(){
    return this.registerForm.controls['numeroTelefono'];
  }
  get institucionSalud(){
    return this.registerForm.controls['institucionSalud'];
  }
  get cargo(){
    return this.registerForm.controls['cargo'];
  }
  get email(){
    return this.registerForm.controls['email'];
  }
  get password(){
    return this.registerForm.controls['password'];
  }
  get repitPassword(){
    return this.registerForm.controls['repitPassword'];
  }
}


