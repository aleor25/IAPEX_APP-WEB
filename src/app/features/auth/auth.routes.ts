import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { EmailVerificationComponent } from "./email-verification/email-verification.component";
import { RegisterComponent } from "./register/register.component";
import { RestorePasswordComponent } from "./restore-password/restore-password.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";


export const AuthRoutes: Routes = [
    {
        path: 'auth',
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'restore-password', component: RestorePasswordComponent },
            { path: 'email-verification', component: EmailVerificationComponent }
        ]
    }
]