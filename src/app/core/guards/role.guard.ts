import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RoleName } from '../models/role.model';
import { ToastService } from '../services/util/toast.service';
import { error } from 'jquery';

export const roleGuard: CanActivateFn = (route) => {
  const _authService = inject(AuthService);
  const _router = inject(Router);
  const _toastService = inject(ToastService);

  // Obtiene los roles requeridos desde las rutas
  const expectedRoles = route.data['expectedRoles'] as RoleName[]; // Trabaja directamente con RoleName

  // Verifica si el usuario está autenticado
  if (_authService.isAuthenticated()) {
        // Obtiene el rol del usuario desde el localStorage a través del servicio
    const userRole = _authService.getRole() as RoleName;

    // Verifica si el rol del usuario está dentro de los roles requeridos
    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    } else {
    _toastService.showToast('Acceso denegado', 'No tienes el rol requerido para acceder a este contenido.', 'error');
      _router.navigate(['/dashboard/general-view']);
      return false;
    }
  } else {
    _router.navigate(['/auth/login']);
    return false;
  }
};