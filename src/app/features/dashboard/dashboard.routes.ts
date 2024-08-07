import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { GeneralViewComponent } from "./general-view/general-view.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { RegisteredPatientsComponent } from "./registered-patients/section/registered-patients.component";
import { SettingsComponent } from "./settings/settings.component";
import { RequestsComponent } from "./requests/requests.component";
import { ContactRequestDetailComponent } from "./contact-request-detail/contact-request-detail.component";


export const DashboardRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'general-view', pathMatch: 'full' },
            { path: 'general-view', component: GeneralViewComponent },
            { path: 'notifications', component: NotificationsComponent },
            { path: 'registered-patients', component: RegisteredPatientsComponent }, 
            { path: 'requests', component: RequestsComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'contact-request-detail', component: ContactRequestDetailComponent },

        ]
    }
];