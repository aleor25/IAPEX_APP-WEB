import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.css'
})
export class DragAndDropComponent {

  @Input() label: string = 'Imágenes*';
  @Input() maxImages: number = 6;
  @Input() imageUploadError: { error: string }[] = [];
  @Input() tempImages: string[] = [];
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
  maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;
  private indexToDelete: number | null = null;

  @ViewChild(ModalComponent) deleteModal!: ModalComponent;

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
  
  private processFiles(files: FileList): void {
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
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('images') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}