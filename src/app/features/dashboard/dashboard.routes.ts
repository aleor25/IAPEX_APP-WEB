import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { GeneralViewComponent } from "./general-view/general-view.component";
import { PacientesRegistradosComponent } from "./pacientes-registrados/pacientes-registrados.component";
import { SolicitudesComponent } from "./solicitudes/solicitudes.component";
import { SettingsComponent } from "./settings/settings.component";


export const DashboardRoutes: Routes = [
    
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'general-view', pathMatch: 'full' },
            { path: 'general-view', component: GeneralViewComponent },
            { path: 'pacientes-registrados', component: PacientesRegistradosComponent },
            { path: 'solicitudes', component: SolicitudesComponent },
            { path: 'settings', component: SettingsComponent }
        ]
    }
    
];