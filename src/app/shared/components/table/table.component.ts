import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit, OnChanges {

  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() tableId: string = '';
  @Input() onRowAction?: (id: number) => void;

  loading: boolean = true;
  error: string | null = null;
  
  private _router = inject(Router);
  private tableInstance: any;

  ngOnInit(): void {
    if (this.data.length > 0) {
      this.loading = false;
      this.initTable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.loading = false;
      this.reloadData();
    }
  }

  private initTable(): void {
    try {
      this.tableInstance = $(`#${this.tableId}`).DataTable({
        ordering: false,
        data: this.data,
        columns: this.columns,
        language: {
          "processing": "Procesando...",
          "lengthMenu": "Mostrar _MENU_ registros",
          "zeroRecords": "No se encontraron resultados",
          "emptyTable": "Aún no hay registros.",
          "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
          "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
          "infoFiltered": "(filtrado de un total de _MAX_ registros)",
          "search": "Buscar:",
          "loadingRecords": "Cargando..."
        }
      });

      $(`#${this.tableId} tbody`).on('click', '.see-details-btn', (event: any) => {
        const itemId = $(event.currentTarget).data('id');
        if (this.onRowAction) {
          this.onRowAction(itemId);
        }
      });
    } catch (err) {
      this.error = 'Hubo un problema al cargar la tabla.';
      this.loading = false;
      console.error('Error al inicializar DataTable:', err);
    }
  }

  private reloadData(): void {
    if (this.tableInstance) {
      this.tableInstance.clear().rows.add(this.data).draw();
    } else {
      this.initTable();
    }
  }
}
