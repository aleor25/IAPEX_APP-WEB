import { Component, inject, OnInit } from '@angular/core';
import { ContactRequestService } from '../../../core/services/contact-request.service';
import { ContactRequest } from '../../../core/models/contact-request/contact-request.model';
import { Router } from '@angular/router';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-contact-requests',
  standalone: true,
  imports: [TableComponent],
  template: `
    <app-table [data]="contactRequestsData" [columns]="columns" [tableId]="'contactRequestsTable'"
               [onRowAction]="onRowAction">
    </app-table>
  `
})
export class ContactRequestsComponent implements OnInit {

  contactRequestsData: ContactRequest[] = [];
  private _contactRequestService = inject(ContactRequestService);
  private _router = inject(Router);

  ngOnInit(): void {
    this._contactRequestService.getAllContactRequests().subscribe(
      (data) => {
        this.contactRequestsData = data;
        console.log('Datos obtenidos: ', this.contactRequestsData);
      },
      (error) => console.error('Error al obtener los datos: ', error)
    );
  }

  columns = [
    { data: 'id', title: 'ID' },
    { data: 'interestedPersonName', title: 'Nombre de la persona interesada' },
    { data: 'missingPersonName', title: 'Nombre de la persona desaparecida' },
    { data: 'relationship', title: 'Parentesco' },
    { data: 'phoneNumber', title: 'Número de teléfono' },
    { data: 'email', title: 'Correo electrónico' },
    { data: 'requestDateTime', title: 'Fecha de solicitud', render: (data: any) => this.formatDateTime(data) },
    { data: 'status', title: 'Estado',
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

  private formatStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'nueva': 'Nueva',
      'no_encontrada': 'No encontrada',
      'encontrada': 'Encontrada',
      'en_revision': 'En revisión'
    };
    return statusMap[status.toLowerCase()] || status;
  }

  private getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'nueva':
        return 'badge bg-primary';
      case 'no_encontrada':
        return 'badge bg-danger';
      case 'encontrada':
        return 'badge bg-success';
      case 'en_revision':
        return 'badge bg-warning';
      default:
        return 'badge bg-secondary';
    }
  }

  onRowAction(id: number): void {
    this._router.navigate(['/dashboard/contact-requests/details', id]);
  }
}