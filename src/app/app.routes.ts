import { Routes } from "@angular/router";
import { DashboardRoutes } from "./features/dashboard/dashboard.routes";
import { AuthRoutes } from "./features/auth/auth.routes";

export const routes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    ...AuthRoutes,
    ...DashboardRoutes,

    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
];

