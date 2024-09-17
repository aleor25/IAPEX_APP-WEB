import { Component, inject, Input, OnInit } from '@angular/core';
import { PatientService } from '../../../core/services/patients/patient.service';
import { Patient } from '../../../core/models/patients/patient.model';
declare var $: any;

@Component({
  selector: 'app-patients-table',
  standalone: true,
  imports: [],
  templateUrl: './patients-table.component.html',
  styleUrls: ['./patients-table.component.css'],
})

export class PatientsTableComponent implements OnInit {

  @Input() table: string[] = [];

  patientsData: Patient[] = [];

  private _patientsService = inject(PatientService)

  ngOnInit(): void {
    this._patientsService.getAllPatients().subscribe(
      (data) => {
        console.log('Los datos se han recibido:', data);
        this.patientsData = data;
        this.initPatientsTable();
      },
      (err) => console.error('Error al obtener los datos: ', err)
    )
  }

  private initPatientsTable(): void {
    const table = $('#patientsTable').DataTable({
      ordering: false,
      scrollX: true,
      data: this.patientsData,
      columns: [
        { data: 'id', visible: false },
        {
          data: null,
          render: (data: any) => `${data.name} ${data.lastName} ${data.secondLastName}`,
        },
        { data: 'gender' },
        {
          data: 'approximateAge',
          render: (data: any) => `${data} años`
        },
        { data: 'registrationDateTime', render: (data: any) => this.formatDateTime(data) },
        { data: 'registeringUser' },
        { data: 'active', render: (data: any) => this.status(data) },
        { data: 'distinctiveFeatures' }, 
        { data: 'additionalNotes', className: 'dt-column size-column' },
      ],
      language: {
        "processing": "Procesando...",
        "lengthMenu": "Mostrar _MENU_ registros",
        "zeroRecords": "No se encontraron resultados",
        "emptyTable": "Ningún dato disponible en esta tabla",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "infoPostFix": "",
        "search": "Buscar:",
        "url": "",
        "loadingRecords": "Cargando...",
        "oPaginate": {
          "sFirst": "‹‹",
          "sLast": "››",
          "sNext": "›",
          "sPrevious": "‹"
        },
      },
      initComplete: () => {
        this.initComplete();
      }
    });
  }

  initComplete() {
    const table = $('#patientsTable').DataTable();

    // Crear el botón para restablecer todos los filtros
    const resetButton = document.createElement('button');
    resetButton.className = 'btn btn-sm btn-outline-secondary ms-3 d-flex align-items-center';

    // HTML del botón con clases de Bootstrap para manejar la visibilidad
    resetButton.innerHTML = `
      <span class="d-none d-md-inline me-2">Restablecer filtros</span>
      <i class="bi bi-arrow-clockwise" title="Restablecer filtros"></i>
    `;

    // Encontrar el contenedor de paginación
    const paginationContainer = document.querySelector('.dt-start');

    if (paginationContainer) {
      // Insertar el botón
      paginationContainer.classList.add('d-flex', 'align-items-center');
      paginationContainer.appendChild(resetButton);
    }
  }

  refreshTable(): void {
    this._patientsService.getAllPatients().subscribe(
      (data) => {
        console.log('Datos actualizadas:', data);
        this.patientsData = data;

        const table = $('#patientsTable').DataTable();
        table.clear();
        table.rows.add(this.patientsData);
        table.draw();
      },
      (err) => console.error('Error al actualizar los pacientes', err)
    )
  }

  getRowData(row: any): any {
    const cells = row.getElementsByTagName('td');
    const rowId = row.getAttribute('data-id');

    if (cells.length > 0) {
      const rowData = {
        id: rowId || '',
        name: cells[0]?.innerText || '',
        gender: cells[1]?.innerText || '',
        approximateAge: cells[2]?.innerText || '',
        registrationDateTime: cells[3]?.innerText || '',
        registeringUser: cells[4]?.innerText || '',
        active: cells[5]?.innerText || '',
        distinctiveFeatures: cells[6]?.innerText || '',
        additionalNotes: cells[7]?.innerText || '',
      };
      console.log('Valores de la fila:', rowData);
      return rowData;
    }
    return null;
  }

  formatDateTime(dateTime: string | Date): string {
    const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

    // Extraer los componentes de la fecha
    const day = date.toLocaleString('es-ES', { day: 'numeric' });
    const month = date.toLocaleString('es-ES', { month: 'long' });
    const year = date.toLocaleString('es-ES', { year: 'numeric' });

    // Extraer la hora y los minutos juntos en formato de 12 horas
    const time = date.toLocaleString('es-ES', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    // Formato final
    return `${day} de ${month} de ${year} a las ${time}`;
  }


  status(status: boolean): string {
    return status ? 'No encontrado' : 'Encontrado';
  }
}
