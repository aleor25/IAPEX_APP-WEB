import { Routes } from "@angular/router";
import { AccessRoutes } from "./features/access/access.routes";
import { DashboardRoutes } from "./features/dashboard/dashboard.routes";
import { RegisterPatientsComponent } from "./features/dashboard/patients/register-patients/register-patients.component";
import { ContactRequestsComponent } from "./features/dashboard/contact-requests/section/contact-requests.component";
import { ContactRequestDetailComponent } from "./features/dashboard/contact-requests/contact-request-detail/contact-request-detail.component";
import { PatientsComponent } from "./features/dashboard/patients/section/patients.component";
import { GetPatientDetailComponent } from "./features/dashboard/patients/get-patient-detail/get-patient-detail.component";
import { UpdatePatientDetailComponent } from "./features/dashboard/patients/update-patient-detail/update-patient-detail.component";


export const routes: Routes = [
    { path: '', redirectTo: '/access/login', pathMatch: 'full' },
    ...AccessRoutes,
    ...DashboardRoutes,
    { path: 'register-patients', component: RegisterPatientsComponent },  
    { path: 'contact-requests', component: ContactRequestsComponent },
    { path: 'patients', component: PatientsComponent },
    { path: 'contact-request-detail/:id', component: ContactRequestDetailComponent },
    { path: 'get-patient-detail/:id', component: GetPatientDetailComponent },
    { path: 'update-patient-detail/:id', component: UpdatePatientDetailComponent },
    { path: '', redirectTo: '/access/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/access/login', pathMatch: 'full' }
];

