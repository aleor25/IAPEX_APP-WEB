import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NgFor],
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent {
  notificaciones = new Array(10); // Array con 5 elementos
}
