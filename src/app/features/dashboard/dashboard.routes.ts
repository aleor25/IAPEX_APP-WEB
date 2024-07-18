import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { GeneralViewComponent } from "./general-view/general-view.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { RegisteredPatientsComponent } from "./registered-patients/registered-patients.component";
import { RequestsComponent } from "./requests/requests.component";
import { SettingsComponent } from "./settings/settings.component";
import { ReceivedRequestsComponent } from "./requests/received-requests/received-requests.component";
import { PatientDetailsComponent } from "./registered-patients/patient-details/patient-details.component";


export const DashboardRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'general-view', pathMatch: 'full' },
            { path: 'general-view', component: GeneralViewComponent },
            { path: 'notifications', component: NotificationsComponent },
            {
                path: 'registered-patients',
                component: RegisteredPatientsComponent,
                children: [
                    { path: '', redirectTo: 'registered-patients', pathMatch: 'full' },
                    { path: 'patient-details', component: PatientDetailsComponent },
                ]
            }, 
            {
                path: 'requests',
                component: RequestsComponent,
                children: [
                    { path: '', redirectTo: 'requests', pathMatch: 'full' },
                    { path: 'received-requests', component: ReceivedRequestsComponent },
                ]
            }, 
            { path: 'settings', component: SettingsComponent },
        ]
    }
];