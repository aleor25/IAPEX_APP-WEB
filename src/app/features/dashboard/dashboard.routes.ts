import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { GeneralViewComponent } from "./general-view/general-view.component";
<<<<<<< HEAD
import { NotificationsComponent } from "./notifications/notifications.component";
import { RegisteredPatientsComponent } from "./registered-patients/registered-patients.component";
import { RequestsComponent } from "./requests/requests.component";
import { SettingsComponent } from "./settings/settings.component";
import { ReceivedRequestsComponent } from "./requests/received-requests/received-requests.component";
import { PatientDetailsComponent } from "./registered-patients/patient-details/patient-details.component";
=======
import { PacientesRegistradosComponent } from "./pacientes-registrados/pacientes-registrados.component";
import { SolicitudesComponent } from "./solicitudes/solicitudes.component";
import { SettingsComponent } from "../settings/settings.component";
>>>>>>> 887aef7cb6652d5e4e73bba99eefe9db412c55fd


export const DashboardRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'general-view', pathMatch: 'full' },
            { path: 'general-view', component: GeneralViewComponent },
<<<<<<< HEAD
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
=======
            { path: 'pacientes-registrados', component: PacientesRegistradosComponent },
            { path: 'solicitudes', component: SolicitudesComponent },
            { path: 'settings', component: SettingsComponent }
>>>>>>> 887aef7cb6652d5e4e73bba99eefe9db412c55fd
        ]
    }
];