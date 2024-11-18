import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableComponent } from '../../../shared/components/table/table.component';
import { Membership } from '../../../core/models/membership.model';
import { MembershipService } from '../../../core/services/membership.service';

@Component({
  selector: 'app-memberships',
  standalone: true,
  imports: [TableComponent],
  template: `
    <app-table [data]="membershipData" [columns]="columns" [tableId]="'membershipsTable'"
               [onRowAction]="onRowAction">
    </app-table>
  `
})
export class MembershipsComponent implements OnInit {

  membershipData: Membership[] = [];
  private _membershipService = inject(MembershipService);
  private _router = inject(Router);

  ngOnInit(): void {
    this._membershipService.getAllMemberships().subscribe(
      (data) => {
        this.membershipData = data;
        console.log('Datos obtenidos: ', this.membershipData);
      },
      (error) => console.error('Error al obtener los datos: ', error)
    );
  }

  columns = [
    { data: 'id', title: 'ID' },
    { data: 'institutionName', title: 'Institución' },
    { data: 'startDate', title: 'Fecha de inicio', render: (data: any) => this.formatDateTime(data) },
    { data: 'endDate', title: 'Fecha de fin', render: (data: any) => this.formatDateTime(data) },
    {
      data: 'status', title: 'Estado',
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
    this._router.navigate(['/dashboard/memberships/details', id]);
  }
}