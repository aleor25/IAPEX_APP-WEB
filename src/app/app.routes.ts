import { Routes } from "@angular/router";
import { AccessRoutes } from "./features/access/access.routes";
import { DashboardRoutes } from "./features/dashboard/dashboard.routes";
import { GetPatientDetailComponent } from "./features/dashboard/patients-managment/get-patient-detail/get-patient-detail.component";
import { ContactRequestDetailComponent } from "./features/dashboard/requests-managment/contact-request-detail/contact-request-detail.component";
import { InstitutionDetailComponent } from "./features/dashboard/institutions-managment/institution-detail/institution-detail.component";
import { RegisterInstitutionsComponent } from "./features/dashboard/institutions-managment/register-institutions/register-institutions.component";
import { MembershipDetailComponent } from "./features/dashboard/memberships-managment/membership-detail/membership-detail.component";
import { RegisterMembershipsComponent } from "./features/dashboard/memberships-managment/register-memberships/register-memberships.component";

export const routes: Routes = [
    { path: '', redirectTo: '/access/login', pathMatch: 'full' },
    ...AccessRoutes,
    ...DashboardRoutes,

    { path: 'get-patient-detail/:id', component: GetPatientDetailComponent },
    { path: 'contact-request-detail/:id', component: ContactRequestDetailComponent },

    { path: 'institution-detail/:id', component: InstitutionDetailComponent },
    { path: 'register-institutions', component: RegisterInstitutionsComponent },    

    { path: 'membership-detail/:id', component: MembershipDetailComponent },
    { path: 'register-memberships', component: RegisterMembershipsComponent },    


    { path: '', redirectTo: '/access/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/access/login', pathMatch: 'full' }
];

