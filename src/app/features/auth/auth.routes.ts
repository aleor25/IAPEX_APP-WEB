import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { EmailVerifiedComponent } from "./email-verified/email-verified.component";
import { RegisterComponent } from "./register/register.component";
import { RestorePasswordComponent } from "./restore-password/restore-password.component";

export const AuthRoutes: Routes = [
    {
        path: 'auth',
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'restore-password', component: RestorePasswordComponent },
            { path: 'email-verified', component: EmailVerifiedComponent }
        ]
    }
]