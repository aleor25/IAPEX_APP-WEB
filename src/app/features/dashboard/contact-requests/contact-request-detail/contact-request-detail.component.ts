import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ContactRequestService } from '../../../../core/services/dashboard/contactRequest/contact-request.service';
import { ContactRequestDTO } from '../../../../core/services/contact-request/contact-request.service';

@Component({
  selector: 'app-contact-request-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './contact-request-detail.component.html',
  styleUrls: ['./contact-request-detail.component.css']
})
export class ContactRequestDetailComponent implements OnInit {
  updateMessage: string = '';
  solicitud: ContactRequestDTO | null = null;
  loading: boolean = true;
  error: string | null = null;  
  originalStatus: string = '';
  statusChanged: boolean = false;

  statusOptions = [
    { value: 'NO_ENCONTRADA', label: 'No encontrado' },
    { value: 'NUEVA', label: 'Nueva' },
    { value: 'ENCONTRADA', label: 'Encontrado' },
    { value: 'EN_REVISION', label: 'En revisión' }
  ];

    constructor(
      private route: ActivatedRoute,
      private contactRequestService: ContactRequestService,
      private router: Router
    ) { }
  
    ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.loadSolicitud(+id);
      }
    }
  
    loadSolicitud(id: number) {
      this.loading = true;
      this.contactRequestService.getContactRequestById(id).subscribe(
        (data) => {
          this.solicitud = data;
          if (this.solicitud) {
            this.solicitud.status = this.solicitud.status.toUpperCase();
            this.originalStatus = this.solicitud.status; // Guarda el estado original
          }
          this.loading = false;
          this.statusChanged = false; // Reinicia el indicador de cambio
        },
        (error) => {
          console.error('Error fetching contact request', error);
          this.error = 'Error al cargar los detalles de la solicitud';
          this.loading = false;
        }
      );
    }
  
    getStatusClass(status: string): string {
      switch (status) {
        case 'NO_ENCONTRADA':
          return 'status-no-encontrada';
        case 'NUEVA':
          return 'status-nueva';
        case 'ENCONTRADA':
          return 'status-encontrada';
        case 'EN_REVISION':
          return 'status-en-revision';
        default:
          return '';
      }
    }
  
onStatusChange() {
  if (this.solicitud) {
    this.statusChanged = this.solicitud.status !== this.originalStatus;
  }
}
  
updateStatus() {
  if (this.solicitud && this.solicitud.id && this.statusChanged) {
    const updateRequest = { status: this.solicitud.status };
    this.contactRequestService.updateContactRequestById(this.solicitud.id, updateRequest)
      .subscribe(
        (response) => {
          console.log('Estado actualizado con éxito');
          this.updateMessage = 'Estado actualizado con éxito';
          this.originalStatus = this.solicitud!.status; // Actualiza el estado original
          this.statusChanged = false; // Reinicia el indicador de cambio
          setTimeout(() => this.updateMessage = '', 3000);
          this.router.navigate(['/dashboard/contact-requests']);
        },
        (error) => {
          console.error('Error al actualizar el estado', error);
          this.updateMessage = 'Error al actualizar el estado: ' + error.error.message;
          setTimeout(() => this.updateMessage = '', 3000);
        }
      );
  } else if (!this.statusChanged) {
    this.updateMessage = 'No se han realizado cambios en el estado';
    setTimeout(() => this.updateMessage = '', 3000);
  }
}
  }
  