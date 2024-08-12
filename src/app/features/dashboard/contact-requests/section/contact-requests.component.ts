import { Component } from '@angular/core';
import { ContactRequestDTO, ContactRequestService } from '../../../../core/services/contact-request/contact-request.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-requests.component.html',
  styleUrl: './contact-requests.component.css'
})
export class ContactRequestsComponent {
  contactRequests: ContactRequestDTO[] = [];
  loading: boolean = true;
  error: string | null = null;

  
  constructor(
    private contactRequestService: ContactRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContactRequests();
  }

  loadContactRequests(): void {
    this.loading = true;
    this.contactRequestService.getAllContactRequests().subscribe({
      next: (requests) => {
        this.contactRequests = requests;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las solicitudes de contacto';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  // Método para refrescar la lista de solicitudes
  refreshList(): void {
    this.loadContactRequests();
  }

  formatStatus(status: string): string {
    // Mapeo de estados sin guiones bajos a versiones legibles
    const statusMap: { [key: string]: string } = {
      'nueva': 'Nueva',
      'no_encontrada': 'No encontrada',
      'encontrada': 'Encontrada',
      'en_revision': 'En revisión'
    };
    return statusMap[status.toLowerCase()] || status;
  }
  
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'nueva':
        return 'badge bg-primary';
      case 'no_encontrada':
        return 'badge bg-warning';
      case 'encontrada':
        return 'badge bg-success';
      case 'en_revision':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }


  viewDetails(id: number | undefined): void {
    this.router.navigate(['/contact-request-detail', id]);
  }
}

