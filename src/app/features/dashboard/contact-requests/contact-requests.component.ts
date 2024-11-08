import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactRequestService } from '../../../core/services/contact-request.service';
import { ContactRequest } from '../../../core/models/contact-request/contact-request.model';
import { FormatDateTimePipe } from '../../../shared/pipes/format-date-time.pipe';
import { ContactsTableComponent } from '../../../shared/tables/contacts-table/contacts-table.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact-requests',
  standalone: true,
  imports: [CommonModule, FormatDateTimePipe, ContactsTableComponent, FormsModule, RouterLink],
  templateUrl: './contact-requests.component.html'
})
export class ContactRequestsComponent implements OnInit {
  contactRequests: ContactRequest[] = [];
  loading: boolean = true;
  error: string | null = null;

  private _router = inject(Router);
  private _contactRequestService = inject(ContactRequestService);

  table: string[] = [];

  ngOnInit(): void {
    this.getAllContactRequests();
  }

  getAllContactRequests(): void {
    this._contactRequestService.getAllContactRequests().subscribe({
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