import { Routes } from "@angular/router";
import { GeneralViewComponent } from "./general-view/general-view.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { ContactRequestsComponent } from "./contact-requests/contact-requests.component";
import { InstitutionsComponent } from "./institutions/institutions.component";
import { RegisterInstitutionsComponent } from "./institutions/register/register-institutions.component";
import { MembershipsComponent } from "./memberships/memberships.component";
import { RegisterMembershipsComponent } from "./memberships/register/register-memberships.component";
import { PatientsComponent } from "./patients/patients.component";
import { RegisterPatientsComponent } from "./patients/register/register-patients.component";
import { ContactRequestDetailsComponent } from "./contact-requests/details/contact-request-details.component";
import { InstitutionDetailsComponent } from "./institutions/details/institution-details.component";
import { PatientDetailsComponent } from "./patients/details/patient-details.component";
import { MembershipDetailsComponent } from "./memberships/details/membership-details.component";
import { roleGuard } from "../../core/guards/role.guard";

export const DashboardRoutes: Routes = [
    {
        path: 'dashboard',
        children: [
            { path: '', redirectTo: 'general-view', pathMatch: 'full' },
            { path: 'general-view', component: GeneralViewComponent },

            // Rutas protegidas para pacientes y solicitudes, requerirán el rol USER_WEB
            { path: 'patients', component: PatientsComponent, canActivate: [roleGuard], data: { expectedRoles: ['USER_WEB'] } },
            { path: 'patients/register', component: RegisterPatientsComponent, canActivate: [roleGuard], data: { expectedRoles: ['USER_WEB'] } },
            { path: 'patients/details/:id', component: PatientDetailsComponent, canActivate: [roleGuard], data: { expectedRoles: ['USER_WEB'] } },

            { path: 'contact-requests', component: ContactRequestsComponent, canActivate: [roleGuard], data: { expectedRoles: ['USER_WEB'] } },
            { path: 'contact-requests/details/:id', component: ContactRequestDetailsComponent, canActivate: [roleGuard], data: { expectedRoles: ['USER_WEB'] } },

            // Rutas protegidas para instituciones y membresías, requerirán el rol SUPER_ADMIN
            { path: 'institutions', component: InstitutionsComponent, canActivate: [roleGuard], data: { expectedRoles: ['SUPER_ADMIN'] } },
            { path: 'institutions/register', component: RegisterInstitutionsComponent, canActivate: [roleGuard], data: { expectedRoles: ['SUPER_ADMIN'] } },
            { path: 'institutions/details/:id', component: InstitutionDetailsComponent, canActivate: [roleGuard], data: { expectedRoles: ['SUPER_ADMIN'] } },

            { path: 'memberships', component: MembershipsComponent, canActivate: [roleGuard], data: { expectedRoles: ['SUPER_ADMIN'] } },
            { path: 'memberships/register', component: RegisterMembershipsComponent, canActivate: [roleGuard], data: { expectedRoles: ['SUPER_ADMIN'] } },
            { path: 'memberships/details/:id', component: MembershipDetailsComponent, canActivate: [roleGuard], data: { expectedRoles: ['SUPER_ADMIN'] } },
            
            { path: 'notifications', component: NotificationsComponent, canActivate: [roleGuard], data: { expectedRoles: ['USER_WEB'] } },
        ]
    },
];
