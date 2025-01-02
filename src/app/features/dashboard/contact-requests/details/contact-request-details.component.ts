import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactRequest } from '../../../../core/models/contact-request.model';
import { ContactRequestService } from '../../../../core/services/contact-request.service';
import { ToastService } from '../../../../core/services/util/toast.service';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-contact-request-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ModalComponent],
  templateUrl: './contact-request-details.component.html'
})
export class ContactRequestDetailsComponent implements OnInit {
  contactRequest!: ContactRequest;
  contactRequestForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = "";
  isFormModified = false;
  @ViewChild(ModalComponent) updateModal!: ModalComponent;

  statusOptions = [
    { value: 'NO_ENCONTRADO', label: 'No encontrado' },
    { value: 'NUEVA', label: 'Nueva' },
    { value: 'ENCONTRADO', label: 'Encontrado' },
    { value: 'EN_REVISION', label: 'En revisión' }
  ];

  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private _toastService = inject(ToastService);
  private _contactRequestService = inject(ContactRequestService);
  private _fb = inject(FormBuilder);

  constructor() {
    this.contactRequestForm = this._fb.group({
      interestedPersonName: [{ value: '', disabled: true }],
      missingPersonName: [{ value: '', disabled: true }],
      relationship: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      requestDateTime: [{ value: '', disabled: true }],
      status: ['', Validators.required],
      attendingUser: [{ value: '', disabled: true }],
      message: [{ value: '', disabled: true }]
    });

    this.contactRequestForm.valueChanges.subscribe(() => {
      this.isFormModified = this.contactRequestForm.dirty;
    });
  }

  ngOnInit() {
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.loadContactRequest(+id);
    }
  }

  loadContactRequest(id: number) {
    this._contactRequestService.getContactRequestById(id).subscribe({
      next: (data) => {
        this.contactRequest = data;
        console.log('Contact request', this.contactRequest);

        if (this.contactRequest.status === 'ENCONTRADO' || this.contactRequest.status === 'NO_ENCONTRADO') {
          this.contactRequestForm.get('status')?.disable();
        }

        if (this.contactRequest) {
          this.contactRequest.status = this.contactRequest.status.toUpperCase();
          this.contactRequestForm.patchValue({
            interestedPersonName: this.contactRequest.interestedPersonName,
            missingPersonName: this.contactRequest.missingPersonName,
            relationship: this.contactRequest.relationship,
            phoneNumber: this.contactRequest.phoneNumber,
            email: this.contactRequest.email,
            requestDateTime: this.formatDateTime(this.contactRequest.requestDateTime),
            status: this.contactRequest.status,
            attendingUser: this.contactRequest.attendingUser || 'No asignado',
            message: this.contactRequest.message
          });
        }
      },
      error: (error) => {
        console.error('Error fetching contact request', error);
        this.errorMessage = 'Error al cargar los detalles de la solicitud';
        this.loading = false;
      }
    });
  }

  updateStatus() {
    this.errorMessage = '';

    // Marcar todos los controles como tocados
    Object.values(this.contactRequestForm.controls).forEach(control => {
      control.markAsTouched();
    });

    if (this.contactRequestForm.valid) {
      const newStatus = this.contactRequestForm.get('status')?.value;
      const updateRequest: any = { status: newStatus };

      if (this.contactRequest.id) {
        this._contactRequestService.updateContactRequestById(this.contactRequest.id, updateRequest)
          .subscribe({
            next: () => {
              this.errorMessage = '';
              this._toastService.showToast('Solicitud de contacto actualizada', 'Los datos de la solicitud de contacto se han actualizado correctamente', 'success');
              this.isFormModified = false;
            },
            error: (error) => {
              console.error('Error al actualizar el estado', error);
            }
          });
      }
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
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
      hour12: true
    });
  }

  openUpdateModal(): void {
    this.updateModal.open();
  }

  seePatientDetails(id: number): void {
    this._router.navigate(['/dashboard/patients/details', id]);
  }
}
