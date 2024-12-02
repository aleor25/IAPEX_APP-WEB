import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateTime',
  standalone: true
})
export class FormatDateTimePipe implements PipeTransform {

  transform(value: Date | string | number): string {
    if (!value) return '';

    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };

    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }
}