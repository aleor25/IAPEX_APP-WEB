import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { GeneralViewComponent } from "./general-view/general-view.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { SettingsComponent } from "./settings/settings.component";
import { InstitutionDetailComponent } from "./institutions-managment/institution-detail/institution-detail.component";
import { PatientsComponent } from "./patients-managment/patients/patients.component";
import { InstitutionsComponent } from "./institutions-managment/institutions/institutions.component";
import { RegisterInstitutionsComponent } from "./institutions-managment/register-institutions/register-institutions.component";
import { MembershipDetailComponent } from "./memberships-managment/membership-detail/membership-detail.component";
import { MembershipsComponent } from "./memberships-managment/memberships/memberships.component";
import { RegisterMembershipsComponent } from "./memberships-managment/register-memberships/register-memberships.component";
import { GetPatientDetailComponent } from "./patients-managment/get-patient-detail/get-patient-detail.component";
import { UpdatePatientDetailComponent } from "./patients-managment/update-patient-detail/update-patient-detail.component";
import { RegisterPatientsComponent } from "./patients-managment/register-patients/register-patients.component";
import { ContactRequestDetailComponent } from "./requests-managment/contact-request-detail/contact-request-detail.component";
import { ContactRequestsComponent } from "./requests-managment/contact-requests/contact-requests.component";
import { RegisteredPatientsComponent } from "./patients-managment/registered-patients/registered-patients.component";


export const DashboardRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'general-view', pathMatch: 'full' },
            { path: 'general-view', component: GeneralViewComponent, },
            { path: 'institutions-managment',
                children: [
                    { path: 'institution-detail', component: InstitutionDetailComponent },
                    { path: 'institutions', component: InstitutionsComponent },
                    { path: 'register-institutions', component: RegisterInstitutionsComponent }
                ]
            },
            { path: 'memberships-managment',
                children: [
                    { path: 'membership-detail', component: MembershipDetailComponent },
                    { path: 'memberships', component: MembershipsComponent },
                    { path: 'register-memberships', component: RegisterMembershipsComponent }
                ]
            },
            { path: 'notifications', component: NotificationsComponent },
            { path: 'patients-managment',
                children: [
                    { path: 'get-patient-detail', component: GetPatientDetailComponent },
                    { path: 'patients', component: PatientsComponent },
                    { path: 'register-patients', component: RegisterPatientsComponent },
                    { path: 'registered-patients', component: RegisteredPatientsComponent },
                    { path: 'update-patient-detail', component: UpdatePatientDetailComponent }
                ]
            },
            { path: 'requests-managment',
                children: [
                    { path: 'contact-request-detail', component: ContactRequestDetailComponent },
                    { path: 'contact-requests', component: ContactRequestsComponent }
                ]
            },
            { path: 'settings', component: SettingsComponent },
        ]
    }
];
