import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { PatientService } from '../../../core/services/patient.service';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [ModalComponent, QRCodeComponent],
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.css'
})
export class DragAndDropComponent implements OnInit {

  private _patientService = inject(PatientService);

  @Input() label: string = 'Imágenes*';
  @Input() maxImages: number = 6;
  @Input() imageUploadError: { error: string }[] = [];
  @Input() tempImages: string[] = [];
  @Output() imagesUploaded = new EventEmitter<string[]>();
  @Input() showQRCode: boolean = false;
  @Input() uploadInstructions: string[] = [
    'Debe subir entre 3 y 6 imágenes.',
    'Formatos admitidos: JPG, JPEG, PNG, BMP, WEBP, TIFF, HEIF.',
    'El tamaño máximo por imagen es de 5 MB.',
    'Usa imágenes claras del rostro y desde diferentes ángulos.',
    'Resolución máxima permitida: 4080x4080 píxeles.',
  ];

  qrCodeUrl: string = '';
  allowedFormats: string[] = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'image/tiff', 'image/heif'];
  maxSizeInMB: number = 5;
  maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;
  private indexToDelete: number | null = null;
  private token: string = '';

  @ViewChild(ModalComponent) deleteModal!: ModalComponent;

  ngOnInit(): void {
    if (this.showQRCode) {
      this._patientService.getUploadImagesUrl().subscribe({
        next: (response) => {
          this.qrCodeUrl = response.message;
          console.log('URL de subida de imágenes:', this.qrCodeUrl);

          // Extraer el token de la URL
          const tokenMatch = this.qrCodeUrl.match(/[\?&]token=([^&#]*)/);
          if (tokenMatch) {
            this.token = tokenMatch[1];
          }
        },
        error: (err) => {
          console.error('Error al obtener la URL de subida de imágenes:', err);
        },
      });
    }
  }

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
        return null; // Devuelve null si el formato no es permitido
    }
  }

  getTempImagesByToken(): void {
    if (this.token) {
      this._patientService.getTemporaryImagesByToken(this.token).subscribe({
        next: (images: string[]) => {
          // Crear una lista de promesas para procesar las imágenes
          const imagePromises: Promise<void>[] = [];

          // Recorrer las imágenes temporales y convertir cada URL en un File
          images.forEach((imageUrl, index) => {
            const promise = fetch(imageUrl)
              .then((response) => response.blob())  // Convertir la URL en un Blob
              .then((blob) => {
                const extension = this.getExtensionFromMimeType(blob.type);  // Obtener la extensión del archivo
                const filename = `image${index}.${extension}`;  // Crear un nombre para la imagen

                // Crear un objeto File a partir del Blob
                const file = new File([blob], filename, { type: blob.type });

                // Añadir la imagen convertida al array de imágenes temporales
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === 'string') {
                    this.tempImages.push(reader.result);
                  }
                };
                reader.readAsDataURL(file);

                // Emitir las imágenes para actualizar el componente padre
                this.imagesUploaded.emit(this.tempImages);
              })
              .catch((error) => {
                console.error('Error al procesar la imagen:', error);
              });

            imagePromises.push(promise);
          });

          // Esperamos a que todas las imágenes se hayan procesado
          Promise.all(imagePromises).then(() => {
            console.log('Todas las imágenes han sido procesadas y convertidas.');
            console.log('Imágenes temporales:', this.tempImages);
          });
        },
        error: (err) => {
          console.error('Error al obtener las imágenes temporales:', err);
        },
      });
    }
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      this.processFiles(event.dataTransfer.files);
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      this.processFiles(input.files);
      input.value = '';
    }
  }

  processFiles(files: FileList): void {
    const newImageFiles = Array.from(files);
    const totalFiles = this.tempImages.length + newImageFiles.length;

    if (totalFiles > this.maxImages) {
      this.imageUploadError.push({
        error: `No puedes subir más de ${this.maxImages} imágenes.`,
      });
      return;
    }

    newImageFiles.forEach((file) => {
      if (!this.allowedFormats.includes(file.type)) {
        this.imageUploadError.push({
          error: `${file.name} no tiene un formato válido.`,
        });
        return;
      }

      if (file.size > this.maxSizeInBytes) {
        this.imageUploadError.push({
          error: `${file.name} excede el peso permitido.`,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string' && !this.tempImages.includes(reader.result)) {
          this.tempImages.push(reader.result);
          // Emitir las imágenes actualizadas
          this.imagesUploaded.emit(this.tempImages);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  openDeleteModal(index: number): void {
    this.deleteModal.open();
    this.indexToDelete = index;
  }

  removeImage() {
    if (this.indexToDelete !== null) {
      this.tempImages.splice(this.indexToDelete, 1);
      this.imagesUploaded.emit(this.tempImages);
      this.indexToDelete = null;
      console.log('tempImages:', this.tempImages);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('images') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}