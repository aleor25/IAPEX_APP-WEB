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

export const DashboardRoutes: Routes = [
    {
        path: 'dashboard',
        children: [
            { path: '', redirectTo: 'general-view', pathMatch: 'full' },
            { path: 'general-view', component: GeneralViewComponent },

            { path: 'patients', component: PatientsComponent },
            { path: 'patients/register', component: RegisterPatientsComponent },
            { path: 'patients/details/:id', component: PatientDetailsComponent },

            { path: 'contact-requests', component: ContactRequestsComponent },
            { path: 'contact-requests/details/:id', component: ContactRequestDetailsComponent },

            { path: 'institutions', component: InstitutionsComponent },
            { path: 'institutions/register', component: RegisterInstitutionsComponent },
            { path: 'institutions/details/:id', component: InstitutionDetailsComponent },

            { path: 'memberships', component: MembershipsComponent },
            { path: 'memberships/register', component: RegisterMembershipsComponent },
            { path: 'memberships/details/:id', component: MembershipDetailsComponent },
            
            // { path: 'notifications', component: NotificationsComponent },
        ]
    },
];
