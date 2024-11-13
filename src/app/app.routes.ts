import { Routes } from "@angular/router";
import { DashboardRoutes } from "./features/dashboard/dashboard.routes";
import { AuthRoutes } from "./features/auth/auth.routes";
import { authGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    ...AuthRoutes,
    ...DashboardRoutes.map(route => ({ ...route, canActivate: [authGuard] })),

    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
];