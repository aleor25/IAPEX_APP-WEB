import { Component, OnInit } from '@angular/core';
import { ContactRequestService } from '../dashboard/contactRequest/contact-request.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-request',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-request.component.html',
  styleUrl: './contact-request.component.css'
})

export class ContactRequestsComponent implements OnInit {
  
  contactRequests: any[] = [];
  newRequest: any = {
    name: '',
    email: '',
    message: '',
    institution: {
      name: ''
    }
  };
  constructor(private contactRequestService: ContactRequestService) { }

  ngOnInit(): void {
    this.getAllContactRequests();
  }

  getAllContactRequests(): void {
    this.contactRequestService.getAllContactRequests().subscribe(
      (requests) => {
        this.contactRequests = requests;
      },
      (error) => {
        console.error('Error al obtener las solicitudes de contacto:', error);
      }
    );
  }

  getContactRequestById(id: number): void {
    this.contactRequestService.getContactRequestById(id).subscribe(
      (request) => {
        console.log('Solicitud de contacto:', request);
      },
      (error) => {
        console.error('Error al obtener la solicitud de contacto:', error);
      }
    );
  }

  getContactRequestsByInstitution(): void {
    this.contactRequestService.getContactRequestsByInstitution().subscribe(
      (requests) => {
        this.contactRequests = requests;
      },
      (error) => {
        console.error('Error al obtener las solicitudes de contacto por institución:', error);
      }
    );
  }

  createContactRequest(request: any): void {
    this.contactRequestService.createContactRequest(request).subscribe(
      (newRequest) => {
        console.log('Solicitud de contacto creada:', newRequest);
        this.contactRequests.push(newRequest);
      },
      (error) => {
        console.error('Error al crear la solicitud de contacto:', error);
      }
    );
  }

  updateContactRequestById(id: number, request: any): void {
    this.contactRequestService.updateContactRequestById(id, request).subscribe(
      (updatedRequest) => {
        console.log('Solicitud de contacto actualizada:', updatedRequest);
        // Actualizar la lista de solicitudes de contacto
        const index = this.contactRequests.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.contactRequests[index] = updatedRequest;
        }
      },
      (error) => {
        console.error('Error al actualizar la solicitud de contacto:', error);
      }
    );
  }
}


