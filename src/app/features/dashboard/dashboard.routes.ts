import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { GeneralViewComponent } from "./general-view/general-view.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { SettingsComponent } from "./settings/settings.component";
import { ContactRequestsComponent } from "./contact-requests/section/contact-requests.component";
import { PatientsComponent } from "./patients/section/patients.component";
import { InstitutionsComponent } from "./institutions/section/institutions.component";
import { MembershipsComponent } from "./memberships/section/memberships.component";


export const DashboardRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'general-view', pathMatch: 'full' },
            { path: 'general-view', component: GeneralViewComponent },
            { path: 'notifications', component: NotificationsComponent },
            { path: 'patients', component: PatientsComponent }, 
            { path: 'settings', component: SettingsComponent },
            { path: 'contact-requests', component: ContactRequestsComponent },
            { path: 'institutions', component: InstitutionsComponent },
            { path: 'memberships', component: MembershipsComponent }


        ]
    }
];
