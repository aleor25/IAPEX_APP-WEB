import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'requestsPipe',
  standalone: true
})
export class RequestsPipe implements PipeTransform {
  private statusMap = {
    'Nueva': 'Nuevas',
    'En revisión': 'En revisión',
    'Finalizada': 'Finalizadas'
  } as const;

  transform(value: string): string {
    return this.statusMap[value as keyof typeof this.statusMap] || value;
  }
}