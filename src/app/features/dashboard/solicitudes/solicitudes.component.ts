import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { Request } from '../../../core/models/solicitudes/request.model';
import { RequestService } from '../../../core/services/requests/request.service';


@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [NgFor],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})
export class SolicitudesComponent implements OnInit {

  requestsData: Request[] = []
  displayedRequests: Request[] = []

  private _router = inject(Router);
  private _requestService = inject(RequestService);

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    this.requestsData = this.simulateGetRequests();
    this.displayedRequests = this.requestsData; // Asignar los datos simulados a displayedRequests
  }


  simulateGetRequests(): Request[] {
    return [
      { id: 1, patient: "Pedro Martinez", interested: "Juan Perez", phone: "+52 123 456 7891", date: "2024-06-14", status: "Pendiente" },
      { id: 2, patient: "Carlos Lopez", interested: "Ana Rodriguez", phone: "+52 987 654 3211", date: "2024-06-15", status: "Aprobado" },
      { id: 3, patient: "Daniel Barragán", interested: "Jose Capistrán", phone: "+52 271 500 3124", date: "2024-01-04", status: "En revisión" },
      { id: 4, patient: "Sofia Lopez", interested: "Pedro Hernandez", phone: "+52 987 654 3212", date: "2024-06-16", status: "Aprobado" },
      { id: 5, patient: "Maria Pérez", interested: "Juana López", phone: "+52 271 500 3125", date: "2024-01-07", status: "En revisión" },
      { id: 6, patient: "Juan Martinez", interested: "Ana López", phone: "+52 123 456 7892", date: "2024-06-18", status: "Pendiente" }
    ];
  }


}
