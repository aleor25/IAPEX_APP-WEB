import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactRequest } from '../../../core/models/contact-request/contact-request.model';
import { Router } from '@angular/router';
import { ContactRequestService } from '../../../core/services/dashboard/contact-request/contact-request.service';
declare var $: any;

@Component({
  selector: 'app-contacts-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.css']
})
export class ContactsTableComponent implements OnInit {
  @Input() table: string[] = [];
  contactsData: ContactRequest[] = [];
  private _contactRequestService = inject(ContactRequestService);
  private _router = inject(Router);

  ngOnInit(): void {
    this.loadContactRequests();
  }

  private loadContactRequests(): void {
    this._contactRequestService.getAllContactRequests().subscribe({
      next: (data) => {
        console.log('Datos de solicitudes de contacto recibidos:', data);
        this.contactsData = data;
        this.initContactsTable();
      },
      error: (err) => console.error('Error al obtener los datos: ', err)
    });
  }

  private initContactsTable(): void {
    const table = $('#contactsTable').DataTable({
      ordering: false,
      columnDefs: [
        { "width": "108px", "targets": [3] },
        { "width": "173px", "targets": [5] }
      ],
      scrollX: true,
      data: this.contactsData,
      columns: [
        { data: 'id' },
        { data: 'interestedPersonName' },
        { data: 'missingPersonName' },
        { data: 'relationship' },
        { data: 'phoneNumber' },
        { data: 'email' },
        { data: 'requestDateTime', render: (data: any) => this.formatDateTime(data) },
        {
          data: 'status',
          render: (data: any) => `<span class="${this.getStatusClass(data)}">${this.formatStatus(data)}</span>`
        },
        {
          data: null,
          className: 'text-center align-middle text-nowrap-small',
          render: (data: any) => `
            <div class="d-flex justify-content-center">
              <button class="btn btn-primary btn-sm me-1 view-button" data-id="${data.id}">
                <span class="material-symbols-outlined fs-5">visibility</span>
              </button>
            </div>
          `
        }
      ],
      language: {
        "processing": "Procesando...",
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "emptyTable": "Aún no hay registros.",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "search": "Buscar:",
        "loadingRecords": "Cargando...",
        "paginate": {
          "first": "‹‹",
          "last": "››",
          "next": "›",
          "previous": "‹"
        }
      },
      initComplete: () => {
        $('#contactsTable').on('click', '.view-button', (event: any) => {
          const id = $(event.currentTarget).data('id');
          const contactRequest = this.contactsData.find(contact => contact.id === id);
          if (contactRequest) {
            console.log('Datos de la solicitud de contacto:', contactRequest);
            this._router.navigate(['/contact-request-detail', id]);
          }
        });
      }
    });
  }

  viewDetails(id: number | undefined): void {
    if (id !== undefined) {
      this._router.navigate(['/contact-request-detail', id]);
    }
}
  private initComplete(): void {
    const table = $('#contactsTable').DataTable();
  }

  private formatDateTime(dateTime: string | Date): string {
    const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.getFullYear();
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
        return 'badge bg-warning';
      case 'encontrada':
        return 'badge bg-success';
      case 'en_revision':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
}