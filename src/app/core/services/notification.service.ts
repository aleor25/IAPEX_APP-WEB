import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = "http://localhost:8080/api/v1/notifications";
  private _http = inject(HttpClient);

  // Obtener todas las notificaciones con paginación y filtro opcional
  public getNotifications(page: number = 0, size: number = 5): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this._http.get<any>(this.apiUrl, { params });
  }

  // Obtener una notificación por ID
  public getNotificationById(id: number): Observable<Notification> {
    const apiUrl = `${this.apiUrl}/${id}`;
    return this._http.get<Notification>(apiUrl);
  }

  // Actualizar el estado de una notificación
  public updateNotificationStatus(id: number, attended: boolean): Observable<any> {
    const apiUrl = `${this.apiUrl}/${id}`;
    return this._http.patch(apiUrl, null, { params: { attended } });
  }

  // Eliminar una notificación por ID
  public deleteNotificationById(id: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/${id}`;
    return this._http.delete<any>(apiUrl);
  }
}
