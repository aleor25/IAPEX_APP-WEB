import { Component, inject } from '@angular/core';
import { DragAndDropComponent } from '../../../shared/components/drag-and-drop/drag-and-drop.component';
import { PatientService } from '../../../core/services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../core/services/util/toast.service';

@Component({
  selector: 'app-upload-images',
  standalone: true,
  imports: [DragAndDropComponent],
  templateUrl: './upload-images.component.html'
})
export class UploadImagesComponent {

  token: string = '';
  tempImages: string[] = [];
  imageUploadError: { error: string }[] = [];

  private _patientService = inject(PatientService);
  private _toastService = inject(ToastService);
  private _route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.token = this._route.snapshot.queryParamMap.get('token') || '';
    console.log('Token:', this.token);
  }

  updateImages(images: string[]): void {
    this.tempImages = images;
    // Actualiza las imágenes en el servicio
  }

  // Subir imágenes temporales al servidor
  uploadTemporaryImages(): void {
    if (!this.token) {
      this._toastService.showToast('Token invalido', 'No se ha proporcionado un token válido.', 'error');
      return;
    }

    if (this.tempImages.length === 0) {
      this._toastService.showToast('No hay imágenes', 'No se han seleccionado imágenes para subir.', 'error');
      return;
    }

    // Convertir las imágenes base64 a blobs para enviarlas al backend
    const formData = new FormData();
    formData.append('token', this.token);

    const imagePromises = this.tempImages.map((image, index) => {
      return fetch(image)
        .then(response => response.blob())
        .then(blob => {
          const extension = this.getExtensionFromMimeType(blob.type);
          formData.append('images', blob, `image${index}.${extension}`);
        });
    });

    // Procesar las imágenes y enviarlas al servidor
    Promise.all(imagePromises)
      .then(() => {
        this._patientService.uploadTemporaryImages(formData)
          .subscribe({
            next: () => {
              this._toastService.showToast('Imágenes subidas', 'Las imágenes se han subido correctamente.', 'success');
              this.tempImages = [];
            },
            error: (err: any) => {
              console.error('Error al subir las imágenes: ', err);
              this._toastService.showToast('Error al subir imágenes', 'Hubo un problema al subir las imágenes.', 'error');
            }
          });
      })
      .catch(err => {
        console.error('Error al procesar las imágenes: ', err);
        this._toastService.showToast('Error al procesar imágenes', 'Hubo un problema al procesar las imágenes.', 'error');
      });
  }

  // Obtener la extensión de archivo a partir del tipo MIME
  getExtensionFromMimeType(mimeType: string): string | null {
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/webp':
        return 'webp';
      case 'image/heif':
        return 'heif';
      default:
        return null;
    }
  }

}