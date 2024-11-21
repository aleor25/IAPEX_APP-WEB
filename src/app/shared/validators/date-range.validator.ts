import { AbstractControl, ValidatorFn } from "@angular/forms";

// Función de validación personalizada para el rango de fechas
export function dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const form = control.parent;
      if (form) {
        const startDate = form.get('startDate')?.value;
        const endDate = control.value;
  
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
  
          // Comparar fechas sin tener en cuenta la hora
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
  
          // Devolver error si la fecha de finalización no es posterior a la fecha de inicio
          return end <= start ? { 'invalidDateRange': true } : null;
        }
      }
      return null;
    };
  }