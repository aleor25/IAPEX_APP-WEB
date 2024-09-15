import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textDate',
  standalone: true
})
export class TextDatePipe implements PipeTransform {

  private meses: string[] = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  transform(value: string): string {
    if (!value) return '';
    
    // Espera que el formato sea DD/MM/AAAA
    const [dia, mes, anio] = value.split('/').map(Number);

    // Validar si la fecha es válida
    if (!dia || !mes || !anio || mes < 1 || mes > 12) {
      return 'Fecha no válida';
    }

    const nombreMes = this.meses[mes - 1]; // mes - 1 para obtener el nombre correcto del array
    
    return `${dia} de ${nombreMes} del ${anio}`;
  }
  
}
