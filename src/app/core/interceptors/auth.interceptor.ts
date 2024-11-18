import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ToastService } from '../services/util/toast.service';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _router = inject(Router);
  const _toastService = inject(ToastService);
  const _authService = inject(AuthService);
  const token = _authService.getAuthToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse): Observable<never> => {
      console.error('Error detectado por el interceptor:', error);

      // Utiliza el mensaje del backend si existe, de lo contrario usa un mensaje por defecto
      const getErrorMessage = (defaultMessage: string) => {
        return error.error?.message || defaultMessage;
      };

      switch (error.status) {
        case 400:
          _toastService.showToast(
            'Solicitud incorrecta',
            getErrorMessage('Verifique su solicitud.')
          );
          break;
        case 401:
          localStorage.removeItem('auth_user');
          sessionStorage.removeItem('auth_user');
          _toastService.showToast(
            'Acceso denegado',
            getErrorMessage('Inicie sesión nuevamente.'),
            'error',
            [
              {
                label: 'Ir al inicio de sesión',
                onClick: () => _router.navigate(['/auth/login']),
              },
            ]
          );
          break;
        case 403:
          _toastService.showToast(
            'Acceso prohibido',
            getErrorMessage('No tiene permiso para realizar esta acción.')
          );
          break;
        case 404:
          _toastService.showToast(
            'Recurso no encontrado',
            getErrorMessage('El recurso que busca no existe.')
          );
          break;
        case 408:
          _toastService.showToast(
            'Tiempo de espera agotado',
            getErrorMessage('Intente nuevamente más tarde.')
          );
          break;
        case 409:
          _toastService.showToast(
            'Conflicto',
            getErrorMessage('Ya existe un recurso con la misma información.')
          );
          break;
        case 413:
          _toastService.showToast(
            'Archivo demasiado grande',
            getErrorMessage('El archivo que intenta subir es demasiado grande. Reduzca el tamaño e intente nuevamente.')
          );
          break;
        case 415:
          _toastService.showToast(
            'Tipo de archivo no permitido',
            getErrorMessage('El archivo que intenta subir no es permitido. Utilice un archivo con un formato válido.')
          );
          break;
        case 422:
          _toastService.showToast(
            'Datos incorrectos',
            getErrorMessage('Verifique los datos ingresados.')
          );
          break;
        case 429:
          _toastService.showToast(
            'Demasiadas solicitudes',
            getErrorMessage('Espere un momento antes de realizar otra solicitud.')
          );
          break;
        case 500:
          _toastService.showToast(
            'Error interno del servidor',
            getErrorMessage('Intente nuevamente más tarde o comuníquese con el administrador.')
          );
          break;
        case 503:
          _toastService.showToast(
            'Servicio no disponible',
            getErrorMessage('El servicio está temporalmente fuera de línea. Intente más tarde.')
          );
          break;
        default:
          _toastService.showToast(
            'Error inesperado',
            getErrorMessage('Intente nuevamente o comuníquese con el administrador.')
          );
          break;
      }

      return throwError(() => error);
    })
  );
};
