import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { GeneralViewComponent } from "./general-view/general-view.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { SettingsComponent } from "./settings/settings.component";
import { PatientsComponent } from "./patients-managment/patients/patients.component";
import { InstitutionsComponent } from "./institutions-managment/institutions/institutions.component";
import { RegisterInstitutionsComponent } from "./institutions-managment/register-institutions/register-institutions.component";
import { MembershipDetailComponent } from "./memberships-managment/membership-detail/membership-detail.component";
import { MembershipsComponent } from "./memberships-managment/memberships/memberships.component";
import { RegisterMembershipsComponent } from "./memberships-managment/register-memberships/register-memberships.component";
import { RegisterPatientsComponent } from "./patients-managment/register-patients/register-patients.component";
import { ContactRequestsComponent } from "./requests-managment/contact-requests/contact-requests.component";


export const DashboardRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'general-view', pathMatch: 'full' },
            { path: 'general-view', component: GeneralViewComponent, },
            { path: 'patients',
                component: PatientsComponent,
                children: [
                        { path: 'register-patients', component: RegisterPatientsComponent },
                      ]},
                ]
            },
            { path: 'requests-managment',
                children: [
                    { path: 'contact-requests', component: ContactRequestsComponent }
                ]
            },
            { path: 'institutions-managment',
                children: [
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
            { path: 'settings', component: SettingsComponent },
        ];
