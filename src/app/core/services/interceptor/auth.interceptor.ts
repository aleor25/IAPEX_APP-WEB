import { HttpInterceptorFn, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserWebService } from '../user-web.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userWebService = inject(UserWebService);
  const router = inject(Router);
  const token = userWebService.getToken();

  if (token && shouldAddAuthorizationHeader(req)) {
    if (userWebService.isTokenExpired()) {
      //console.log('Interceptor: El token ha expirado, cerrando sesión');
      userWebService.logout();
      return throwError(() => new Error('Token expired'));
    }

    const clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });

    //console.log('Interceptor: Agregando encabezado de autorización con token');
    
    return next(clonedReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          //console.log('Interceptor: Solicitud HTTP exitosa');
        }
      }),
      catchError(error => {
        //console.error('Interceptor: Error en la solicitud HTTP:', error);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            //console.log('Interceptor: Error de no autorizado, cerrando sesión');
            userWebService.removeToken(); // Remover el token
            userWebService.logout();
            router.navigate(['/auth']);
          }
        }
        return throwError(() => error);
      })
    );
  } else {
    //console.log('Interceptor: Saltando autorización para esta solicitud');
    return next(req);
  }
};

function shouldAddAuthorizationHeader(req: HttpRequest<any>): boolean {
  return true;
}