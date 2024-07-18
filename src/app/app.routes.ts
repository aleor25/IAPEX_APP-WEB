import { Routes } from "@angular/router";
import { AccessRoutes } from "./features/access/access.routes";
import { DashboardRoutes } from "./features/dashboard/dashboard.routes";


export const routes: Routes = [
    { path: '', redirectTo: 'access/login', pathMatch: 'full' },
    ...AccessRoutes,
    ...DashboardRoutes,
];


