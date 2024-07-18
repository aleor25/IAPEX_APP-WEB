import { Component } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../dashboard/dashboard.component';
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
