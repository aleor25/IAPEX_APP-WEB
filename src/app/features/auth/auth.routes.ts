import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { EmailVerificationComponent } from "./email-verification/email-verification.component";
import { RegisterComponent } from "./register/register.component";
import { RestorePasswordComponent } from "./restore-password/restore-password.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";


export const AuthRoutes: Routes = [
    {
        path: 'auth',
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'login', component: LoginComponent },
            { path: 'email-verification', component: EmailVerificationComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'restore-password', component: RestorePasswordComponent },
            { path: 'verify-email', component: VerifyEmailComponent },
        ]
    }
]