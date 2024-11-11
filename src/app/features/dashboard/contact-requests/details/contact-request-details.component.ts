import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContactRequest } from '../../../../core/models/contact-request/contact-request.model';
import { UpdateContactRequest } from '../../../../core/models/contact-request/update-contact-request.model';
import { ContactRequestService } from '../../../../core/services/contact-request.service';

@Component({
  selector: 'app-contact-request-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact-request-details.component.html'
})
export class ContactRequestDetailsComponent implements OnInit {
  updateMessage: string = '';
  request!: ContactRequest;
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

  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _contactRequestService = inject(ContactRequestService);

  ngOnInit() {
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.loadSolicitud(+id);
    }
  }

  loadSolicitud(id: number) {
    this.loading = true;
    this._contactRequestService.getContactRequestById(id).subscribe(
      (data) => {
        this.request = data;
        if (this.request) {
          this.request.status = this.request.status.toUpperCase();
          this.originalStatus = this.request.status;
        }
        this.loading = false;
        this.statusChanged = false;
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
    if (this.request) {
      this.statusChanged = this.request.status !== this.originalStatus;
    }
  }

  updateStatus() {
    if (this.request && this.request.id && this.statusChanged) {
      const updateRequest: UpdateContactRequest = { status: this.request.status };
      this._contactRequestService.updateContactRequestById(this.request.id, updateRequest)
        .subscribe(
          () => {
            console.log('Estado actualizado con éxito');
            this.updateMessage = 'Estado actualizado con éxito';
            this.originalStatus = this.request!.status;
            this.statusChanged = false;
            setTimeout(() => this.updateMessage = '', 3000);
            this._router.navigate(['/dashboard/contact-requests']);
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

  formatDateTime(dateTime: string | Date): string {
    const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }
}