import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ContactRequestService } from '../../../../core/services/dashboard/contact-request/contact-request.service';
import { ContactRequest } from '../../../../core/models/contact-request/contact-request.model';
import { FormatDateTimePipe } from '../../../../shared/pipes/format-date-time.pipe';
import { ContactsTableComponent } from '../../../../shared/tables/contacts-table/contacts-table.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-requests',
  standalone: true,
  imports: [CommonModule, FormatDateTimePipe, ContactsTableComponent, FormsModule, RouterLink],
  templateUrl: './contact-requests.component.html',
  styleUrl: './contact-requests.component.css'
})
export class ContactRequestsComponent implements OnInit {
  contactRequests: ContactRequest[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private contactRequestService: ContactRequestService,
    private router: Router
  ) {}

  table: string[] = [];

  ngOnInit(): void {
    this.getAllContactRequests();
  }

  getAllContactRequests(): void {
    this.contactRequestService.getAllContactRequests().subscribe({
      next: (data: ContactRequest[]) => {
        this.contactRequests = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos: ' + err.message;
        this.loading = false;
      }
    });
  }

  refreshList(): void {
    this.getAllContactRequests();
  }
}
