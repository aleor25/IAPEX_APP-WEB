import { Routes } from "@angular/router";
import { AccessRoutes } from "./features/access/access.routes";
import { DashboardRoutes } from "./features/dashboard/dashboard.routes";
import { RegisterPatientsComponent } from "./features/dashboard/patients/register-patients/register-patients.component";
import { ContactRequestsComponent } from "./features/dashboard/contact-requests/section/contact-requests.component";
import { ContactRequestDetailComponent } from "./features/dashboard/contact-requests/contact-request-detail/contact-request-detail.component";
import { PatientsComponent } from "./features/dashboard/patients/section/patients.component";
import { GetPatientDetailComponent } from "./features/dashboard/patients/get-patient-detail/get-patient-detail.component";
import { UpdatePatientDetailComponent } from "./features/dashboard/patients/update-patient-detail/update-patient-detail.component";
import { InstitutionsComponent } from "./features/dashboard/institutions/section/institutions.component";
import { InstitutionDetailComponent } from "./features/dashboard/institutions/institution-detail/institution-detail.component";
import { RegisterInstitutionsComponent } from "./features/dashboard/institutions/register-institutions/register-institutions.component";
import { MembershipDetailComponent } from "./features/dashboard/memberships/membership-detail/membership-detail.component";
import { RegisterMembershipsComponent } from "./features/dashboard/memberships/register-memberships/register-memberships.component";
import { MembershipsComponent } from "./features/dashboard/memberships/section/memberships.component";


export const routes: Routes = [
    { path: '', redirectTo: '/access/login', pathMatch: 'full' },
    ...AccessRoutes,
    ...DashboardRoutes,
    { path: 'register-patients', component: RegisterPatientsComponent },
    { path: 'register-institutions', component: RegisterInstitutionsComponent },
    { path: 'register-memberships', component: RegisterMembershipsComponent },        
    { path: 'contact-requests', component: ContactRequestsComponent },
    { path: 'patients', component: PatientsComponent },
    { path: 'institutions', component: InstitutionsComponent },
    { path: 'memberships', component: MembershipsComponent },
    { path: 'contact-request-detail/:id', component: ContactRequestDetailComponent },
    { path: 'membership-detail/:id', component: MembershipDetailComponent },
    { path: 'get-patient-detail/:id', component: GetPatientDetailComponent },
    { path: 'institution-detail/:id', component: InstitutionDetailComponent },
    { path: 'update-patient-detail/:id', component: UpdatePatientDetailComponent },
    { path: '', redirectTo: '/access/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/access/login', pathMatch: 'full' }
];

