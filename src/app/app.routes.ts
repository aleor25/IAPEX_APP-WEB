import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { ForgetpassComponent } from './features/forgetpass/forgetpass.component';
import { GeneralViewComponent } from './features/dashboard/general-view/general-view.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SettingsComponent } from './features/settings/settings.component';
import { DashboardRoutes } from './features/dashboard/dashboard.routes';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgetpass', component: ForgetpassComponent },
    { path: 'general-view', component: GeneralViewComponent },
    ...DashboardRoutes,
    { path: 'settings', component: SettingsComponent },
    { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

