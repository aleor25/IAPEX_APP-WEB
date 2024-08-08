import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

//se importan los servicios de http para la utilizacion de token 
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { authInterceptor } from './core/interceptors/auth.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Proveedor para enrutamiento con las rutas correctas
    provideClientHydration(), // Proveedor para hidratación del cliente
    provideHttpClient(withInterceptors ([authInterceptor]))
  ],
};