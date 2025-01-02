import { Component, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  standalone: true
})
export class ModalComponent {
  @Input() title: string = '¿Está seguro de que desea volver?';
  @Input() message: string = 'Si vuelve sin guardar, perderá los cambios realizados.';
  @Output() confirmed = new EventEmitter<void>();

  private modalInstance: bootstrap.Modal | null = null;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const modalElement = this.el.nativeElement.querySelector('.modal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  open(): void {
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  close(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  confirm(): void {
    this.confirmed.emit();
    this.close();
  }
}
