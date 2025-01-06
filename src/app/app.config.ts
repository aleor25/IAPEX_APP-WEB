import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

//se importan los servicios de http para la utilizacion de token 
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { QRCodeComponent } from 'angularx-qrcode';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Proveedor para enrutamiento con las rutas correctas
    provideClientHydration(), // Proveedor para hidratación del cliente
    provideHttpClient(withInterceptors ([authInterceptor] )),
    QRCodeComponent
  ],
};
