import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateTime',
  standalone: true
})
export class FormatDateTimePipe implements PipeTransform {
  transform(dateTime: string | Date): string {
    const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

    // Extraer los componentes de la fecha
    const day = date.toLocaleString('es-ES', { day: 'numeric' });
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.toLocaleString('es-ES', { year: 'numeric' });
    const hour = date.toLocaleString('es-ES', { hour: 'numeric', hour12: true });
    const minute = date.toLocaleString('es-ES', { minute: 'numeric' });

    // Formato final
    return `${day} de ${month} de ${year} a las ${hour}:${minute}`;
  }
}