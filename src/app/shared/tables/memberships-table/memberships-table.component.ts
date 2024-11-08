import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembershipService } from '../../../core/services/membership.service';
import { Router } from '@angular/router';
import { Membership } from '../../../core/models/membership.model';
declare var $: any;

@Component({
  selector: 'app-memberships-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './memberships-table.component.html',
  styleUrl: './memberships-table.component.css'
})
export class MembershipsTableComponent implements OnInit {

  private _membershipsService = inject(MembershipService);
  private _router = inject(Router);

  @Input() table: string[] = [];

  membershipsData: Membership[] = [];

  ngOnInit(): void {
    this.loadMemberships();
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
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

  private loadMemberships(): void {
    this._membershipsService.getAllMemberships().subscribe({
      next: (data) => {
        console.log('Membresías cargadas:', data);
        this.membershipsData = data;
        this.initMembershipsTable();
      },
      error: (err) => console.error('Error al cargar membresías:', err)
    });
  }

  private initMembershipsTable(): void {
    // Destruir la tabla si ya existe
    if ($.fn.DataTable.isDataTable('#membershipsTable')) {
      $('#membershipsTable').DataTable().destroy();
    }

    const table = $('#membershipsTable').DataTable({
      data: this.membershipsData,
      ordering: false,
      scrollX: true,
      columns: [
        {
          data: 'id',
          name: 'id'
        },
        {
          data: 'startDate',
          name: 'startDate',
          render: (data: string) => this.formatDate(data)
        },
        {
          data: 'endDate',
          name: 'endDate',
          render: (data: string) => this.formatDate(data)
        },
        {
          data: 'status',
          name: 'status',
          render: (data: boolean) => {
            return `<span class="badge ${data ? 'bg-success' : 'bg-danger'}">
                      ${data ? 'Activa' : 'Inactiva'}
                    </span>`;
          }
        },
        {
          data: 'institutionName',
          name: 'institutionName'
        },
        {
          data: null,
          name: 'actions',
          orderable: false,
          className: 'text-center',
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
        $('#membershipsTable').on('click', '.view-button', (event: any) => {
          const id = $(event.currentTarget).data('id');
          const membership = this.membershipsData.find(mem => mem.id === id);
          if (membership) {
            console.log('Datos de la membresía:', membership);
            this._router.navigate(['/dashboard/memberships/details', id]);
          }
        });
      }
    });
  }
}