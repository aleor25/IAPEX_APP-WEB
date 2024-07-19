import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContactRequestService } from '../../core/services/contactRequest/contact-request.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-request-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './contact-request-detail.component.html',
  styleUrls: ['./contact-request-detail.component.css']
})
export class ContactRequestDetailComponent implements OnInit {
  solicitud: any;
  updateMessage: string = '';
  

  constructor(
    private route: ActivatedRoute,
    private contactRequestService: ContactRequestService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSolicitud(+id);
    }
  }

  loadSolicitud(id: number) {
    this.contactRequestService.getContactRequestById(id).subscribe(
      (data) => {
        this.solicitud = data;
      },
      (error) => {
        console.error('Error fetching contact request', error);
      }
    );
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'NO_ENCONTRADA':
        return 'goldenrod';
      case 'NUEVA':
        return 'green';  
      case 'ENCONTRADA':
        return 'green';
      case 'EN_REVISION':
        return 'rgb(245, 68, 45)';
      default:
        return 'black';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'NO_ENCONTRADA':
        return 'No encontrada';
      case 'NUEVA':
        return 'Nueva';  
      case 'ENCONTRADA':
        return 'Encontrada';
      case 'EN_REVISION':
        return 'En revisión';
      default:
        return status;
    }
  }

  onStatusChange() {
    this.updateStatus();
}

updateStatus() {
  if (this.solicitud && this.solicitud.id) {
      const updateRequest = { status: this.solicitud.status.toUpperCase() };
      this.contactRequestService.updateContactRequestById(this.solicitud.id, updateRequest)
          .subscribe(
              (response) => {
                  console.log('Estado actualizado con éxito');
                  this.updateMessage = 'Estado actualizado con éxito';
                  setTimeout(() => this.updateMessage = '', 3000);
              },
              (error) => {
                  console.error('Error al actualizar el estado', error);
                  this.updateMessage = 'Error al actualizar el estado: ' + error.error.message;
                  setTimeout(() => this.updateMessage = '', 3000);
              }
          );
  }
}
}


