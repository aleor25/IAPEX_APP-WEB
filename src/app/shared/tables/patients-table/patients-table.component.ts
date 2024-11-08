import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from '../../../core/models/patient.model';
import { PatientService } from '../../../core/services/patient.service';
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
  private _router = inject(Router);

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
      ordering: true,
      columnDefs: [
        { "width": "150px", "targets": [1] },
        { "width": "108px", "targets": [3] },
        { "width": "173px", "targets": [4] },
        { "width": "173px", "targets": [5] },
        { "width": "94px", "targets": [6] },
        { "width": "350px", "targets": [7] },
        { "width": "95px", "targets": [8] }
      ],
      scrollX: true,
      data: this.patientsData,
      columns: [
        { data: 'id' },
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
        {
          data: null,
          render: (data: any) => `El paciente tiene la piel de color ${data.skinColor}, con cabello ${data.hair} y una complexión ${data.complexion}. 
                        Sus ojos son de color ${data.eyeColor}, y su estatura aproximada es de ${data.approximateHeight} cm.`
        },
        {
          data: null,
          className: 'text-center align-middle text-nowrap-small',
          render: (data: any) => `
            <div class="d-flex justify-content-center">
              <button class="btn btn-primary btn-sm me-1 edit-button" data-id="${data.id}">
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

    $('#patientsTable tbody').on('click', '.edit-button', (event: any) => {
      const patientId = $(event.currentTarget).data('id');
      this.openEditPatientModal(patientId);
    });

    $('#patientsTable tbody').on('click', '.delete-button', (event: any) => {
      const patientId = $(event.currentTarget).data('id');
      this.confirmDeletePatient(patientId);
    });
  }

  openEditPatientModal(patientId: number): void {
    this._router.navigate(['/dashboard/patients/details', patientId]);
  }

  confirmDeletePatient(patientId: number): void {
    console.log('Borrar paciente con ID:', patientId);
  }

  initComplete() {
    const table = $('#patientsTable').DataTable();
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


  status(status: boolean): string {
    return status ? 'No encontrado' : 'Encontrado';
  }
}