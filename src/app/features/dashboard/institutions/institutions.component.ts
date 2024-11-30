import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableComponent } from '../../../shared/components/table/table.component';
import { InstitutionService } from '../../../core/services/institution.service';
import { Institution } from '../../../core/models/institution.model';

@Component({
  selector: 'app-institutions',
  standalone: true,
  imports: [TableComponent],
  template: `
    <app-table [data]="institutionData" [columns]="columns" [tableId]="'institutionsTable'"
               [onRowAction]="onRowAction">
    </app-table>
  `
})
export class InstitutionsComponent implements OnInit {

  institutionData: Institution[] = [];
  private _institutionService = inject(InstitutionService);
  private _router = inject(Router);

  ngOnInit(): void {
    this._institutionService.getAllInstitutions().subscribe(
      (data) => {
        this.institutionData = data;
        console.log('Datos obtenidos: ', this.institutionData);
      },
      (error) => console.error('Error al obtener los datos: ', error)
    );
  }

  columns = [
    { data: 'id', title: 'ID' },
    { data: 'name', title: 'Nombre' },
    { data: 'type', title: 'Tipo' },
    { data: 'openingHours', title: 'Horarios' },
    { data: 'adress', title: 'Dirección',
      render: (data: any, type: any, row: any) => `${row.state}, ${row.city}, ${row.postalCode}, ${row.neighborhood}, ${row.street}, ${row.number}` },
    { data: 'phoneNumbers', title: 'Teléfonos' },
    { data: 'registrationDateTime', title: 'Fecha de registro', render: (data: any) => this.formatDateTime(data) },
    {
      data: 'active', title: 'Estado',
      render: (data: any) => `<span class="${this.getStatusClass(data)}">${this.formatStatus(data)}</span>`
    },
    {
      data: null, title: 'Más detalles', className: 'text-center align-middle text-nowrap-small',
      render: (data: any) => `
        <button title="Ver detalles" class="btn btn-primary btn-sm see-details-btn" data-id="${data.id}">
          <i class="bi bi-eye fs-5"></i>
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
      false: 'Inactiva',
      true: 'Activa'
    };
    return statusMap[String(status)];
  }

  private getStatusClass(status: boolean): string {
    switch (status) {
      case true:
        return 'badge bg-success';
      case false:
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  onRowAction(id: number): void {
    this._router.navigate(['/dashboard/institutions/details', id]);
  }
}

