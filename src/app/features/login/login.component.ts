import { Component } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, DashboardComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  registerError:string="";
  registerForm=this.formBuilder.group({
    email:['',[Validators.required,Validators.email,Validators.maxLength(76)]],
    password:['',[Validators.required,Validators.minLength(8),Validators.maxLength(24)]],
  })

  constructor(private formBuilder:FormBuilder,private router:Router){}

  register(){
    if(this.registerForm.valid){
      console.log("llamar al servicio")
      this.router.navigateByUrl('/general-view');
      this.registerForm.reset();
    }
    else{
      this.registerForm.markAllAsTouched();
      alert("Error al ingresar los datos")
    }
  }

    // metodos get
  get email(){
    return this.registerForm.controls['email'];
  }
  get password(){
    return this.registerForm.controls['password'];
  }
}
