import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models/notification.model';
import { FormatDateTimePipe } from '../../../shared/pipes/format-date-time.pipe';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/util/toast.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.component.html',
  imports: [FormatDateTimePipe, RouterLink, ModalComponent]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  pageNumber: number = 0;
  totalElements: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  errorMessage: string = "";
  private indexToDelete: number | null = null;
  @ViewChild(ModalComponent) updateModal!: ModalComponent;

  private _notificationService = inject(NotificationService);
  private _toastService = inject(ToastService);

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(page: number = 0, size: number = 5): void {
    this._notificationService.getNotifications(page, size).subscribe({
      next: (response) => {
        console.log(response);
        this.notifications = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.pageNumber = response.pageNumber;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las notificaciones.';
        this._toastService.showToast('Error al cargar las notificaciones',
          'Ha ocurrido un error al cargas las notificaciones.',
          'error');
        console.error(error);
      }
    });
  }

  // Actualiza el estado de una notificación
  markNotificationAsAttended(): void {
    console.log("Marking notification as attended: " + this.indexToDelete);
    if (this.indexToDelete !== null) {
      this._notificationService.updateNotificationStatus(this.indexToDelete).subscribe({
        next: () => {
          this.loadNotifications(this.pageNumber, this.pageSize);
          this._toastService.showToast('Notificación atendida',
            'La notificación ha sido atendida correctamente.',
            'success');
            this.indexToDelete = null;
        },
        error: (error) => {
          this.errorMessage = 'Error al actualizar la notificación.';
          console.error(error);
        }
      });
    }
  }

  // Paginación
  nextPage(): void {
    if (this.pageNumber < this.totalPages - 1) {
      this.loadNotifications(this.pageNumber + 1, this.pageSize);
    }
  }

  prevPage(): void {
    if (this.pageNumber > 0) {
      this.loadNotifications(this.pageNumber - 1, this.pageSize);
    }
  }

  firstPage(): void {
    this.loadNotifications(0, this.pageSize);
  }

  lastPage(): void {
    this.loadNotifications(this.totalPages - 1, this.pageSize);
  }

  get startIndex(): number {
    return this.pageNumber * this.pageSize + 1;
  }

  get endIndex(): number {
    const end = this.startIndex + this.notifications.length - 1;
    return end > this.totalElements ? this.totalElements : end;
  }

  openUpdateModal(index: number): void {
    this.updateModal.open();
    this.indexToDelete = index;
  }
}