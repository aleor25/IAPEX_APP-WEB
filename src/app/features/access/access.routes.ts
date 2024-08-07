import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { MailVerificationComponent } from "./mail-verification/mail-verification.component";
import { RegisterComponent } from "./register/register.component";
import { RestorePasswordComponent } from "./restore-password/restore-password.component";
import { VerifiedEmailComponent } from "./verified-email/verified-email.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";


export const AccessRoutes: Routes = [
    {
        path: 'access',
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'login', component: LoginComponent },
            { path: 'mail-verification', component: MailVerificationComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'restore-password', component: RestorePasswordComponent },
            { path: 'verified-email', component: VerifiedEmailComponent },
        ]
    }
]