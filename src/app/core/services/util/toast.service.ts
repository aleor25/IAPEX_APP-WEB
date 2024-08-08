import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
    title: string;
    message: string;
    actions?: Array<{ label: string; onClick: () => void }>;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastSubject = new Subject<Toast>();

    getToasts() {
        return this.toastSubject.asObservable();
    }

    showToast(
        title: string,
        message: string,
        actions?: Array<{ label: string; onClick: () => void }>
    ): void {
        this.toastSubject.next({ title, message, actions });
    }
}