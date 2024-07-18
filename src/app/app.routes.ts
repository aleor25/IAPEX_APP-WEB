import { Routes } from "@angular/router";
import { AccessRoutes } from "./features/access/access.routes";
import { DashboardRoutes } from "./features/dashboard/dashboard.routes";
import { RegisterPatientsComponent } from "./features/register-patients/register-patients.component";
import { PatientDetailsComponent } from "./features/patient-details/patient-details.component";


export const routes: Routes = [
    { path: '', redirectTo: '/access/login', pathMatch: 'full' },
    { path: 'register-patients', component: RegisterPatientsComponent },  
    { path: 'patient-details', component: PatientDetailsComponent },  
    ...AccessRoutes,
    ...DashboardRoutes,
    { path: '', redirectTo: '/access/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/access/login', pathMatch: 'full' }
];

