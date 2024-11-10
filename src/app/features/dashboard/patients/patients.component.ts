import { Component, inject, OnInit } from '@angular/core';
// import { PatientsTableComponent } from '../../../shared/tables/patients-table/patients-table.component';
import { Patient } from '../../../core/models/patient.model';
import { PatientService } from '../../../core/services/patient.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [TableComponent],
  template: `
    <app-table [data]="patientsData" [columns]="columns" [tableId]="'patientsTable'"
               [onRowAction]="onRowAction">
    </app-table>
  `
})
export class PatientsComponent implements OnInit {

  patientsData: Patient[] = [];
  private _patientsService = inject(PatientService);
  private _router = inject(Router);

  ngOnInit(): void {
    this._patientsService.getAllPatients().subscribe(
      (data) => {
        this.patientsData = data;
        console.log('Datos obtenidos: ', this.patientsData);
      },
      (error) => console.error('Error al obtener los datos: ', error)
    );
  }

  columns = [
    { data: 'id', title: 'ID' },
    { data: 'name', title: 'Nombre completo', render: (data: any, type: any, row: any) => `${row.name} ${row.lastName} ${row.secondLastName}` },
    { data: 'gender', title: 'Género', render: (data: any) => data.charAt(0).toUpperCase() + data.slice(1) },
    { data: 'approximateAge', title: 'Edad aproximada', render: (data: any) => `${data} años` },
    { data: 'registrationDateTime', title: 'Fecha de registro', render: (data: any) => this.formatDateTime(data) },
    { data: 'registeringUser', title: 'Registrado por' },
    { data: null, title: 'Descripción', render: (data: any) => `Paciente con piel ${data.skinColor}, cabello ${data.hair}, complexión ${data.complexion}, ojos color ${data.eyeColor} y estatura aproximada de ${data.approximateHeight} cm.` },
    { data: 'active', title: 'Estado',
      render: (data: any) => `<span class="${this.getStatusClass(data)}">${this.formatStatus(data)}</span>`
    },
    {
      data: null, title: 'Más detalles', className: 'text-center align-middle text-nowrap-small',
      render: (data: any) => `
        <button title="Ver detalles" class="btn btn-primary btn-sm see-details-btn" data-id="${data.id}">
          <span class="material-symbols-outlined fs-5">visibility</span>
        </button>
      `
    }
  ];

  formatDateTime(dateTime: string | Date): string {
    const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

    const day = date.toLocaleString('es-ES', { day: 'numeric' });
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.toLocaleString('es-ES', { year: 'numeric' });

    const time = date.toLocaleString('es-ES', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    return `${day} de ${month} de ${year} a las ${time}`;
  }

  private formatStatus(status: boolean): string {
    const statusMap: { [key: string]: string } = {
      false: 'Encontrado',
      true: 'No encontrado'
    };
    return statusMap[String(status)];
  }

  private getStatusClass(status: boolean): string {
    switch (status) {
      case false:
        return 'badge bg-success';
      case true:
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  onRowAction(id: number): void {
    this._router.navigate(['/dashboard/patients/details', id]);
  }
}