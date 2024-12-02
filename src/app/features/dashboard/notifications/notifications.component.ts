import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/notification.model';
import { FormatDateTimePipe } from '../../../shared/pipes/format-date-time.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.component.html',
  imports: [FormatDateTimePipe, RouterLink]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  pageNumber: number = 0;
  totalElements: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  errorMessage: string | null = null;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(page: number = 0, size: number = 5): void {
    this.notificationService.getNotifications(page, size).subscribe({
      next: (response) => {
        console.log(response); // Verifica la respuesta de la API
        this.notifications = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.pageNumber = response.pageNumber;
  
        // Agrega un console log para verificar que los valores estén correctos
        console.log(`Total Elements: ${this.totalElements}, Total Pages: ${this.totalPages}, Current Page: ${this.pageNumber}`);
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las notificaciones.';
        console.error(error);
      }
    });
  }

  // Actualiza el estado de una notificación
  updateNotificationStatus(id: number, attended: boolean): void {
    this.notificationService.updateNotificationStatus(id, attended).subscribe({
      next: () => {
        this.fetchNotifications(this.pageNumber, this.pageSize);
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar la notificación.';
        console.error(error);
      }
    });
  }

  // Paginación
  nextPage(): void {
    if (this.pageNumber < this.totalPages - 1) {
      this.fetchNotifications(this.pageNumber + 1, this.pageSize);
    }
  }

  prevPage(): void {
    if (this.pageNumber > 0) {
      this.fetchNotifications(this.pageNumber - 1, this.pageSize);
    }
  }

  firstPage(): void {
    this.fetchNotifications(0, this.pageSize);
  }

  lastPage(): void {
    this.fetchNotifications(this.totalPages - 1, this.pageSize);
  }

  get startIndex(): number {
    return this.pageNumber * this.pageSize + 1;
  }

  get endIndex(): number {
    const end = this.startIndex + this.notifications.length - 1;
    return end > this.totalElements ? this.totalElements : end;
  }
}