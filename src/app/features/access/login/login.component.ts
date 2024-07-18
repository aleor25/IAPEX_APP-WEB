import { Component } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, DashboardComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  //variables
  loginError:string="";
  // user: string= '';
  // passwordd: string= '';

<<<<<<< HEAD:src/app/features/access/login/login.component.ts
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
=======
  //constructor
  constructor(private formBuilder:FormBuilder,private router:Router ,private authService: AuthService ){}

  //validacionde del formulario parte cliente
  loginForm=this.formBuilder.group({
    email:['',[Validators.required,Validators.email,Validators.maxLength(76)]],
    password:['',[Validators.required,Validators.minLength(8),Validators.maxLength(24)]],
  })

  //funcion redirecionamiento
login(): void{
   const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    if(email && password){
      this.authService.login(email,password).subscribe({
        next: ()=>this.router.navigate(['/dashdoard']),
        error: (err) => console.error('login failed', err)
      });
    }else{
>>>>>>> 887aef7cb6652d5e4e73bba99eefe9db412c55fd:src/app/features/login/login.component.ts
      this.loginForm.markAllAsTouched();
      alert("Error al ingresar los datos")
    }


    /* if(this.loginForm.valid){
      console.log("llamar al servicio")
      this.router.navigateByUrl('/dashboard');
      // this.loginForm.reset();
    }
    else{
      this.loginForm.markAllAsTouched();
      alert("Error al ingresar los datos")
    } */
  }
  // ng permisions,jwt,intersector
  
    // metodos get
  get email(){
    return this.loginForm.controls['email'];
  }
  get password(){
    return this.loginForm.controls['password'];
  }

  //parte para jwt

}
