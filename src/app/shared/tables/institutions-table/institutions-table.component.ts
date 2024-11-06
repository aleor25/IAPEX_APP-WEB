import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstitutionsService } from '../../../core/services/institutions/institutions.service';
import { Router } from '@angular/router';
import { Institution } from '../../../core/models/institutions/institution.model';
declare var $: any;

@Component({
  selector: 'app-institutions-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './institutions-table.component.html',
  styleUrl: './institutions-table.component.css'
})
export class InstitutionsTableComponent implements OnInit {
  private _institutionsService = inject(InstitutionsService);
  private _router = inject(Router);
  @Input() table: string[] = [];

  institutionsData: Institution[] = [];
  hasAdminRole = false;
  
  ngOnInit(): void {
    this.checkUserRole();
    this.loadInstitutions();
  }

  private checkUserRole(): void {
    // Implementar lógica para verificar si el usuario es SUPER_ADMIN
    // this.hasAdminRole = this._authService.hasRole('SUPER_ADMIN');
  }

  private loadInstitutions(): void {
    this._institutionsService.getAllInstitutions().subscribe({
      next: (data) => {
        console.log('Instituciones cargadas:', data);
        this.institutionsData = data;
        this.initInstitutionsTable();
      },
      error: (err) => console.error('Error al cargar instituciones:', err)
    });
  }

  private initInstitutionsTable(): void {
    // Destruir la tabla si ya existe
    if ($.fn.DataTable.isDataTable('#institutionsTable')) {
      $('#institutionsTable').DataTable().destroy();
    }

    const table = $('#institutionsTable').DataTable({
      data: this.institutionsData,
      ordering: false,
      scrollX: true,
      columns: [
        { 
          data: 'id',
          name: 'id'
        },
        { 
          data: 'name',
          name: 'name'
        },
        { 
          data: 'type',
          name: 'type'
        },
        { 
          data: 'phoneNumbers',
          name: 'phoneNumbers'
        },
        { 
          data: 'emails',
          name: 'emails'
        },
        { 
          data: 'active',
          name: 'active',
          render: (data: boolean) => {
            return `<span class="badge ${data ? 'bg-success' : 'bg-danger'}">
                      ${data ? 'Activa' : 'Inactiva'}
                    </span>`;
          }
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
        $('#institutionsTable').on('click', '.view-button', (event: any) => {
          const id = $(event.currentTarget).data('id');
          const institution = this.institutionsData.find(inst => inst.id === id);
          if (institution) {
            console.log('Datos de la institución:', institution);
            this._router.navigate(['/institution-detail', id]);
          }
        });
      }
    });
  }
}