/* import { Component, OnInit } from '@angular/core';
import { Patient } from '../../../../../core/models/patients/patient.model';
import { PatientService } from '../../../../../core/services/patients/patient.service';
import { Router } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {

  patientsData: Patient[] = [];

  ngOnInit(): void {
    this.loadPatients();
  }

  constructor(private patientService: PatientService, private Route: Router) { }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe(
      (response) => {
        this.patientsData = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }


  private initDataTable(): void {
    const table = $('#patients').DataTable({
      ordering: false,
      scrollX: true,
      data: this.patientsData,
      columns: [
        { data: 'name' },
        { data: 'lastName' },
        { data: 'secondLastName' },
        { data: 'gender' },
        { data: 'approximateAge' },
        { data: 'registrationDateTime' },
        { data: 'registeringUser' },
        { data: 'active' },
        { data: 'skinColor' },
        { data: 'hair' }, ,
        { data: 'complexion' },
        { data: 'eyeColor' },
        { data: 'approximateHeight' },
        { data: 'medicalConditions' },
        { data: 'distinctiveFeatures' },
        { data: 'institution' },
        { data: 'images' },
        { data: 'additionalNotes' },
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
        "loadingRecords": "Cargando..."
      },
      rowCallback: function (row: any, data: { _id: any; }) {
        $(row).attr('data-id', data._id);
      },
      initComplete: () => {
        this.initComplete();
      }
    });

    if (this.isUploadsAndUpdates || this.isRequests) {
      this.getColumnValues();

      table.on('click', 'tbody tr', (e: { currentTarget: { classList: any; }; }) => {
        let classList = e.currentTarget.classList;
        if (classList.contains('selected')) {
          classList.remove('selected');
          console.log('Deseleccionado');
          this.rowSelected.emit(null);
        } else {
          table.rows('.selected').nodes().each((row: { classList: { remove: (arg0: string) => any; }; }) => row.classList.remove('selected'));
          classList.add('selected');
          console.log('Seleccionado');

          if (this.isUploadsAndUpdates || this.isRequests) {
            const rowData = this.getRowData(e.currentTarget);
            this.rowSelected.emit(rowData);
          }
        }
      });
    }

    if (this.isGeneralView || this.isRequests) {
      // Lógica para actualizar los selects de la tabla con los datos de la tarifa
      this.selectRateData();
    }
  }


}
 */