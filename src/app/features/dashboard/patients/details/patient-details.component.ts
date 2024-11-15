import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../../../core/models/patient.model';
import { PatientService } from '../../../../core/services/patient.service';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-details.component.html',
})
export class PatientDetailsComponent implements OnInit {

  isImagesChanges: boolean = false;
  selectedPatient!: Patient;
  patientForm!: FormGroup;
  errorMessage: string | null = null;
  isFormModified = false;
  tempImages: string[] = []; // Imágenes para mostrar
  selectedImages: number[] = [];
  imageUploadError: { error: string }[] = [];
  allowedFormats = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'image/tiff', 'image/heif'];
  maxSizeInMB = 5;

  private _route = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _patientService = inject(PatientService);
  private _fb = inject(FormBuilder);

  constructor() {
    this.patientForm = this._fb.group({
      name: ['', [Validators.maxLength(50)]],
      lastName: ['', [Validators.maxLength(50)]],
      secondLastName: ['', [Validators.maxLength(50)]],
      gender: ['', Validators.required],
      approximateAge: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(0), Validators.max(150)]],
      skinColor: ['', Validators.required],
      eyeColor: ['', Validators.required],
      hair: ['', Validators.required],
      hairColor: ['', Validators.required],
      complexion: ['', Validators.required],
      approximateHeight: ['', [Validators.required, Validators.min(50), Validators.max(300)]],
      medicalConditions: ['', Validators.maxLength(255)],
      distinctiveFeatures: ['', Validators.maxLength(255)],
      additionalNotes: ['', Validators.maxLength(255)],
      imageFiles: this._fb.array([this._fb.control('')], Validators.required)
    });
  }

  ngOnInit(): void {
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatient(+id);
    }
  }

  loadPatient(id: number): void {
    this._patientService.getPatient(id).subscribe(
      (patient: Patient) => {
        this.selectedPatient = patient;
        this.tempImages = patient.images.map((image) => image.imageUrl); // Cargar URLs de imágenes
        this.initializeForm();
      },
      (error) => {
        console.error('Error loading patient:', error);
      }
    );
  }

  initializeForm(): void {
    if (this.selectedPatient) {
      this.patientForm = this._fb.group({
        name: [this.selectedPatient.name],
        lastName: [this.selectedPatient.lastName],
        secondLastName: [this.selectedPatient.secondLastName],
        gender: [this.selectedPatient.gender],
        approximateAge: [this.selectedPatient.approximateAge],
        skinColor: [this.selectedPatient.skinColor],
        eyeColor: [this.selectedPatient.eyeColor],
        hair: [this.selectedPatient.hair],
        complexion: [this.selectedPatient.complexion],
        approximateHeight: [this.selectedPatient.approximateHeight],
        medicalConditions: [this.selectedPatient.medicalConditions],
        distinctiveFeatures: [this.selectedPatient.distinctiveFeatures],
        additionalNotes: [this.selectedPatient.additionalNotes],
        imageFiles: this._fb.array(this.selectedPatient.images.map((image) => image.imageUrl))
      });

      this.patientForm.valueChanges.subscribe(() => {
        this.isFormModified = this.patientForm.dirty;
      });
    }
  }

  removeImage(index: number): void {
    // Remover imagen de la lista temporal
    this.tempImages.splice(index, 1);
    this.selectedImages = this.selectedImages.filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));
    this.isFormModified = true;

  }

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

    if (totalFiles <= 6) {
      this.imageUploadError = [];
    } else {
      this.imageUploadError.push({
        error: 'No puedes subir más de 6 imágenes en total.'
      });
      input.value = '';
      return;
    }

    newImageFiles.forEach((file) => {
      if (!this.allowedFormats.includes(file.type)) {
        this.imageUploadError.push({
          error: `${file.name} es un ${file.name.split('.').pop()} y solo se permiten JPG, PNG, JPEG, WEBP y HEIF.`
        });
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.imageUploadError.push({
          error: `${file.name} es demasiado grande. El tamaño máximo permitido es ${this.maxSizeInMB} MB.`
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string' && !this.tempImages.includes(reader.result)) {
          this.tempImages.push(reader.result);
          this.isFormModified = true;
        }
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  onFilesDropped(files: FileList): void {
    const maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;
    const newImageFiles = Array.from(files);

    newImageFiles.forEach((file) => {
      if (!this.allowedFormats.includes(file.type)) {
        this.imageUploadError.push({
          error: `${file.name} tiene un formato no permitido. Solo se permiten formatos: JPG, PNG, JPEG, WEBP y HEIF.`,
        });
        return;
      }

      if (file.size > maxSizeInBytes) {
        this.imageUploadError.push({
          error: `${file.name} supera el tamaño máximo permitido (${this.maxSizeInMB} MB).`,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string' && !this.tempImages.includes(reader.result)) {
          this.tempImages.push(reader.result);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('patientImages') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  savePatient(): void {
    if (this.patientForm.valid) {
      if (this.selectedPatient) {
        const formData: FormData = new FormData();
  
        // Añadir los campos del formulario al FormData
        Object.keys(this.patientForm.value).forEach(key => {
          const value = this.patientForm.value[key];
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });
  
        // Manejo de imágenes existentes o nuevas
        const imagePromises: Promise<void>[] = [];
        if (this.tempImages.length > 0) {
          this.tempImages.forEach((image, index) => {
            if (image.startsWith('data:image')) {
              const promise = fetch(image)
                .then(res => res.blob())
                .then(blob => {
                  if (this.allowedFormats.includes(blob.type)) {
                    const extension = this.getExtensionFromMimeType(blob.type);
                    formData.append('imageFile', blob, `image${index}.${extension}`);
                  } else {
                    this.imageUploadError.push({
                      error: `La imagen ${index + 1} tiene un formato no permitido: ${blob.type}.`
                    });
                  }
                });
              imagePromises.push(promise);
            }
          });
        }
  
        Promise.all(imagePromises).then(() => {
          // Aquí aseguramos que las imágenes del paciente se vinculen correctamente
          const updatedPatient = {
            ...this.selectedPatient,
            images: this.tempImages.map((image, index) => ({
              id: this.selectedPatient?.images?.[index]?.id || 0, // ID existente o 0 si es nuevo
              image, // Imagen codificada como base64 o URL
              imageUrl: '', // Dejar vacío si el backend genera las URLs
            })),
          };
  
          // Llamada al servicio para guardar datos
          this._patientService.updatePatient(this.selectedPatient.id, formData).subscribe(
            () => {
              console.log('Paciente actualizado con éxito.');
              this.isFormModified = false; // Restablecer el estado del formulario
              this._route.navigate(['/dashboard/patients']);
            },
            (error) => {
              console.error('Error al actualizar paciente:', error);
              this.errorMessage = 'Error al actualizar los datos del paciente.';
            }
          );
        });
      }
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
      this.patientForm.markAllAsTouched();
    }
  }  

  deletePatient(id: number) {
    if (id) {
      this._patientService.deletePatient(id).subscribe(
        () => {
          console.log('Paciente eliminado con éxito');
          this._route.navigate(['/dashboard/patients'])
        },
        error => {
          console.error('Error al eliminar el paciente:', error);
        }
      );
    } else {
      console.log('ID de paciente no válido');
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

}
