import { Routes } from "@angular/router";
import { AccessRoutes } from "./features/access/access.routes";
import { DashboardRoutes } from "./features/dashboard/dashboard.routes";
import { RegisterPatientsComponent } from "./features/register-patients/register-patients.component";
import { PatientDetailsComponent } from "./features/patient-details/patient-details.component";
import { ContactRequestsComponent } from "./features/dashboard/contact-requests/section/contact-requests.component";
import { ContactRequestDetailComponent } from "./features/dashboard/contact-requests/contact-request-detail/contact-request-detail.component";


export const routes: Routes = [
    { path: '', redirectTo: '/access/login', pathMatch: 'full' },
    ...AccessRoutes,
    ...DashboardRoutes,
    { path: 'patient-details', component: PatientDetailsComponent },  
    { path: 'register-patients', component: RegisterPatientsComponent },  
    { path: 'contact-requests', component: ContactRequestsComponent },
    { path: 'contact-request-detail/:id', component: ContactRequestDetailComponent },
/*  { path: 'request-details/{id}' }, Path para cargar la interfaz de cada paciente */
    { path: '', redirectTo: '/access/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/access/login', pathMatch: 'full' }
];

