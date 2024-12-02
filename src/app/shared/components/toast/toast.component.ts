import { Component } from '@angular/core';
import { Toast, ToastService } from '../../../core/services/util/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor(private _toastService: ToastService) {
    this._toastService.getToasts().subscribe((toast) => {
      this.toasts.push(toast);

      setTimeout(() => {
        this.removeToast(toast);
      }, 6000);
    });
  }

  removeToast(toast: Toast): void {
    this.toasts = this.toasts.filter((t) => t !== toast);
    this._toastService.removeToast(toast);
  }

  handleAction(toast: Toast, actionIndex: number): void {
    const action = toast.actions ? toast.actions[actionIndex] : null;
    if (action) {
      action.onClick();
      this.removeToast(toast);
    }
  }
}