import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactRequest } from '../../../../core/models/contact-request/contact-request.model';
import { UpdateContactRequest } from '../../../../core/models/contact-request/update-contact-request.model';
import { ContactRequestService } from '../../../../core/services/contact-request.service';

@Component({
  selector: 'app-contact-request-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contact-request-details.component.html'
})
export class ContactRequestDetailsComponent implements OnInit {
  updateMessage: string = '';
  request!: ContactRequest;
  requestForm!: FormGroup;
  loading: boolean = true;
  error: string | null = null;
  originalStatus: string = '';
  isFormModified = false;

  statusOptions = [
    { value: 'NO_ENCONTRADA', label: 'No encontrado' },
    { value: 'NUEVA', label: 'Nueva' },
    { value: 'ENCONTRADA', label: 'Encontrado' },
    { value: 'EN_REVISION', label: 'En revisión' }
  ];

  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _contactRequestService = inject(ContactRequestService);
  private _fb = inject(FormBuilder);

  ngOnInit() {
    this.initializeForm();
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.loadSolicitud(+id);
    }
  }

  private initializeForm(): void {
    this.requestForm = this._fb.group({
      interestedPersonName: [{value: '', disabled: true}],
      missingPersonName: [{value: '', disabled: true}],
      relationship: [{value: '', disabled: true}],
      phoneNumber: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      requestDateTime: [{value: '', disabled: true}],
      status: ['', Validators.required],
      attendingUser: [{value: '', disabled: true}],
      message: [{value: '', disabled: true}]
    });

    this.requestForm.get('status')?.valueChanges.subscribe(newValue => {
      this.isFormModified = newValue !== this.originalStatus;
    });
  }

  private patchFormValues(request: ContactRequest): void {
    this.requestForm.patchValue({
      interestedPersonName: request.interestedPersonName,
      missingPersonName: request.missingPersonName,
      relationship: request.relationship,
      phoneNumber: request.phoneNumber,
      email: request.email,
      requestDateTime: this.formatDateTime(request.requestDateTime),
      status: request.status,
      attendingUser: request.attendingUser || 'No asignado',
      message: request.message
    });
    this.originalStatus = request.status;
    this.requestForm.markAsPristine();
  }

  loadSolicitud(id: number) {
    this.loading = true;
    this._contactRequestService.getContactRequestById(id).subscribe({
      next: (data) => {
        this.request = data;
        if (this.request) {
          this.request.status = this.request.status.toUpperCase();
          this.patchFormValues(this.request);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching contact request', error);
        this.error = 'Error al cargar los detalles de la solicitud';
        this.loading = false;
      }
    });
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

  updateStatus() {
    if (!this.isFormModified || !this.request?.id) {
      this.updateMessage = 'No se han realizado cambios en el estado';
      setTimeout(() => this.updateMessage = '', 3000);
      return;
    }

    const newStatus = this.requestForm.get('status')?.value;
    const updateRequest: UpdateContactRequest = { status: newStatus };

    this._contactRequestService.updateContactRequestById(this.request.id, updateRequest)
      .subscribe({
        next: () => {
          console.log('Estado actualizado con éxito');
          this.updateMessage = 'Estado actualizado con éxito';
          this.originalStatus = newStatus;
          this.isFormModified = false;
          setTimeout(() => this.updateMessage = '', 3000);
          this._router.navigate(['/dashboard/contact-requests']);
        },
        error: (error) => {
          console.error('Error al actualizar el estado', error);
          this.updateMessage = 'Error al actualizar el estado: ' + error.error.message;
          setTimeout(() => this.updateMessage = '', 3000);
        }
      });
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