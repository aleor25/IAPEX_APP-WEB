import { Routes } from "@angular/router";
import { AccessRoutes } from "./features/access/access.routes";
import { DashboardRoutes } from "./features/dashboard/dashboard.routes";
import { RegisterPatientsComponent } from "./features/register-patients/register-patients.component";
import { PatientDetailsComponent } from "./features/patient-details/patient-details.component";
import { RequestDetailsComponent } from "./features/request-details/request-details.component";


export const routes: Routes = [
    { path: '', redirectTo: '/access/login', pathMatch: 'full' },
    ...AccessRoutes,
    ...DashboardRoutes,
    { path: 'patient-details', component: PatientDetailsComponent },  
    { path: 'register-patients', component: RegisterPatientsComponent },  
    { path: 'request-details', component: RequestDetailsComponent },
/*  { path: 'request-details/{id}' }, Path para cargar la interfaz de cada paciente */
    { path: '', redirectTo: '/access/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/access/login', pathMatch: 'full' }
];

