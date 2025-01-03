import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.css'
})
export class DragAndDropComponent {

  @Input() label: string = 'Imágenes';
  @Input() maxImages: number = 6;
  @Input() imageUploadError: { error: string }[] = [];
  @Output() imagesUploaded = new EventEmitter<string[]>();
  @Input() uploadInstructions: string[] = [
    'Debe subir entre 3 y 6 imágenes.',
    'Formatos admitidos: JPG, JPEG, PNG, BMP, WEBP, TIFF, HEIF.',
    'El tamaño máximo por imagen es de 5 MB.',
    'Usa imágenes claras del rostro y desde diferentes ángulos.',
    'Resolución máxima permitida: 4080x4080 píxeles.',
  ];
  
  allowedFormats: string[] = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'image/tiff', 'image/heif'];
  maxSizeInMB: number = 5;
  isImagesChanges: boolean = false;
  selectedImages: number[] = [];
  tempImages: string[] = [];

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files) {
      this.onFilesDropped(event.dataTransfer.files);
    }
  }

  validateImageCount(totalFiles: number): boolean {
    if (totalFiles > this.maxImages) {
      this.imageUploadError.push({
        error: `No puedes subir más de ${this.maxImages} imágenes.`,
      });
      return false;
    }

    return true;
  }

  onFilesDropped(files: FileList) {
    const maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;
    const newImageFiles = Array.from(files);
    const totalFiles = this.tempImages.length + newImageFiles.length;

    if (!this.validateImageCount(totalFiles)) {
      return;
    }

    newImageFiles.forEach((file) => {
      if (!this.allowedFormats.includes(file.type)) {
        this.imageUploadError.push({
          error: `${file.name} no tiene un formato válido. Los formatos permitidos son: ${this.allowedFormats.join(', ')}.`,
        });
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.imageUploadError.push({
          error: `${file.name} es demasiado grande. El tamaño máximo permitido es ${this.maxSizeInMB} MB.`,
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

  onFilesSelected(event: Event) {
    this.isImagesChanges = true;
    const input = event.target as HTMLInputElement;
    const maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;

    if (!input || !input.files) {
      return;
    }

    const files = input.files;
    const newImageFiles = Array.from(files);
    const totalFiles = this.tempImages.length + newImageFiles.length;

    if (!this.validateImageCount(totalFiles)) {
      input.value = '';
      return;
    }

    newImageFiles.forEach((file) => {
      if (!this.allowedFormats.includes(file.type)) {
        this.imageUploadError.push({
          error: `${file.name} no tiene un formato válido. Los formatos permitidos son: ${this.allowedFormats.join(', ')}.`,
        });
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.imageUploadError.push({
          error: `${file.name} es demasiado grande. El tamaño máximo permitido es ${this.maxSizeInMB} MB.`,
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

    input.value = '';
  }

  removeImage(index: number) {
    this.tempImages.splice(index, 1);

    // Emitir las imágenes actualizadas
    this.imagesUploaded.emit(this.tempImages);

    this.selectedImages = this.selectedImages.filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));
  }

  triggerFileInput() {
    const fileInput = document.getElementById('patientImages') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}