import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ContactRequestService } from '../../core/services/contactRequest/contact-request.service';
import { Router } from '@angular/router';

interface ContactRequest {
  id: number;
  interestedPersonName: string;
  missingPersonName: string;
  patient: number;
  relationship: string;
  phoneNumber: string;
  email: string;
  message: string;
  requestDateTime: string;
  status: 'NO_ENCONTRADA' | 'ENCONTRADA' | 'EN_REVISION'| 'NUEVA';
  attendingUser: string | null;
}

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.css',
  providers: [ContactRequestService]
})
export class RequestDetailsComponent implements OnInit {
  contactRequests: ContactRequest[] = [];

  constructor(
    private contactRequestService: ContactRequestService,
    private router: Router
  ) {}


  ngOnInit() {
    this.loadContactRequests();
  }

  onRowClick(requestId: number) {
    this.router.navigate(['/solicitud', requestId]);
  }

  loadContactRequests() {
    this.contactRequestService.getAllContactRequests().subscribe(
      (data) => {
        this.contactRequests = data;
      },
      (error) => {
        console.error('Error fetching contact requests', error);
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

}

