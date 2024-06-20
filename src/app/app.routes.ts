import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ForgetpassComponent } from './features/forgetpass/forgetpass.component';
import { GeneralViewComponent } from './features/dashboard/general-view/general-view.component';
import { SettingsComponent } from './features/settings/settings.component';
import { DashboardRoutes } from './features/dashboard/dashboard.routes';
import { PacientesRegistradosComponent } from './features/dashboard/pacientes-registrados/pacientes-registrados.component';
import { SolicitudesComponent } from './features/dashboard/solicitudes/solicitudes.component';
import { ResetPasswordComponent } from './features/reset-password/reset-password.component';
import { RestorePassword2Component } from './features/restore-password-2/restore-password-2.component';
import { VerifiedEmailComponent } from './features/verified-email/verified-email.component';
import { RegistrarPacientesComponent } from './features/registrar-pacientes/registrar-pacientes.component';
import { PacienteIndividualComponent } from './features/paciente-individual/paciente-individual.component';
import { CorrectMailVerificationComponent } from './features/correct-mail-verification/correct-mail-verification.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgetpass', component: ForgetpassComponent },
    { path: 'general-view', component: GeneralViewComponent },
    { path: 'pacientes-registrados', component: PacientesRegistradosComponent },

    { path: 'restore-password-2', component: RestorePassword2Component},
    { path: 'correct-mail-verification', component: CorrectMailVerificationComponent},
    { path: 'verified-email', component: VerifiedEmailComponent},

    { path: 'solicitudes', component: SolicitudesComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'restore-password-2', component: RestorePassword2Component },
    { path: 'verified-email', component: VerifiedEmailComponent },
    { path: 'registrar-pacientes', component: RegistrarPacientesComponent },
    { path: 'paciente-individual', component: PacienteIndividualComponent },

    ...DashboardRoutes,
    { path: '**', redirectTo: '/login', pathMatch: 'full' }
];


