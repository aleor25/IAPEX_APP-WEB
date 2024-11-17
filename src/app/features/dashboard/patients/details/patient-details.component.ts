import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../../../core/models/patient.model';
import { PatientService } from '../../../../core/services/patient.service';
import { ToastService } from '../../../../core/services/util/toast.service';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-details.component.html',
})
export class PatientDetailsComponent implements OnInit {

  patientForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;
  isImagesChanges: boolean = false;
  tempImages: string[] = []; // Imágenes para mostrar
  selectedImages: number[] = [];
  imageUploadError: { error: string }[] = [];
  allowedFormats = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'image/tiff', 'image/heif'];
  maxSizeInMB = 5;
  patient!: Patient;
  isFormModified = false;
  readonly allowedHairColors: string[] = ['negro', 'castaño', 'rubio', 'pelirrojo', 'canoso', 'otro'];

  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _patientService = inject(PatientService);
  private _toastService = inject(ToastService);
  private _fb = inject(FormBuilder);

  constructor() {
    this.patientForm = this._fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(50)]],
      secondLastName: ['', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(50)]],
      gender: ['', Validators.required],
      approximateAge: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(0), Validators.max(150)]],
      skinColor: ['', Validators.required],
      eyeColor: ['', Validators.required],
      hairLength: ['', Validators.required],
      hairType: ['', Validators.required],
      hairColor: ['', Validators.required],
      customHairColor: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(50)]],
      complexion: ['', Validators.required],
      approximateHeight: ['', [Validators.required, Validators.min(50), Validators.max(300)]],
      medicalConditions: ['', Validators.maxLength(255)],
      distinctiveFeatures: ['', Validators.maxLength(255)],
      imageFiles: this._fb.array([], Validators.required)
    });
    // Desactivar inputs si se selecciona Calvo
    this.patientForm.get('hairLength')?.valueChanges.subscribe(value => {
      const hairColorControl = this.patientForm.get('hairColor');
      const hairLengthControl = this.patientForm.get('hairType');

      if (value === 'calvo') {
        hairColorControl?.disable();
        hairColorControl?.setValue('');
        hairLengthControl?.disable();
        hairLengthControl?.setValue('');
      } else {
        hairColorControl?.enable();
        hairLengthControl?.enable();
      }
    });

    this.patientForm.get('hairColor')?.valueChanges.subscribe(value => {
      const customHairColorControl = this.patientForm.get('customHairColor');
      if (value === 'otro') {
        customHairColorControl?.setValidators([Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), Validators.maxLength(50)]);
        customHairColorControl?.enable();
      } else {
        customHairColorControl?.clearValidators();
        customHairColorControl?.disable();
        customHairColorControl?.setValue(''); // Limpia el campo cuando no es "Otro"
      }
      customHairColorControl?.updateValueAndValidity();
    });

    this.patientForm.valueChanges.subscribe(() => {
      this.isFormModified = this.patientForm.dirty;
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
        this.patient = patient;

        // Sincronizar las URLs de imágenes con tempImages
        this.tempImages = patient.images.map((image) => image.imageUrl);

        // Separar la cadena de cabello en tipo, color y largo
        const hairParts = patient.hair ? patient.hair.split(',') : [];
        const hairLength = hairParts[0] ? hairParts[0].trim() : '';
        const hairType = hairParts[1] ? hairParts[1].trim() : '';
        const hairColor = hairParts[2] ? hairParts[2].trim() : '';

        // Verificar si el color de cabello está en la lista permitida
        if (!this.allowedHairColors.includes(hairColor.toLowerCase())) {
          // Si no coincide, asignar "otro" en hairColor y activar customHairColor
          this.patientForm.patchValue({
            hairColor: 'otro',
            customHairColor: this.capitalizeFirstLetter(hairColor) // Capitalizar la primera letra
          });
          this.patientForm.get('customHairColor')?.enable();
        } else {
          // Si coincide, simplemente asignar el color normal
          this.patientForm.patchValue({
            hairColor: hairColor,
            customHairColor: '' // Asegurarse de limpiar customHairColor si no es necesario
          });
          this.patientForm.get('customHairColor')?.disable();
        }

        // Usar el formulario para asignar valores excepto imageFiles
        this.patientForm.patchValue({
          name: patient.name,
          lastName: patient.lastName,
          secondLastName: patient.secondLastName,
          gender: patient.gender,
          approximateAge: patient.approximateAge,
          skinColor: patient.skinColor,
          eyeColor: patient.eyeColor,
          hairType: hairType,
          hairLength: hairLength,
          complexion: patient.complexion,
          approximateHeight: patient.approximateHeight,
          medicalConditions: patient.medicalConditions,
          distinctiveFeatures: patient.distinctiveFeatures,
        });

        // Actualizar el FormArray para imageFiles
        const imageFilesArray = this.patientForm.get('imageFiles') as FormArray;
        imageFilesArray.clear(); // Limpiar el FormArray antes de llenarlo

        // Añadir las imágenes al FormArray
        patient.images.forEach((image) => {
          // Asegúrate de que cada imagen URL se añade al FormArray
          imageFilesArray.push(this._fb.control(image.imageUrl));
        });
      }
    );
  }

  // Función para capitalizar la primera letra
  private capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
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

    const imageFilesArray = this.patientForm.get('imageFiles') as FormArray;

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
          imageFilesArray.push(this._fb.control(reader.result)); // Añadir al FormArray
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
    const totalFiles = this.tempImages.length + newImageFiles.length;

    if (totalFiles <= 6) {
      this.imageUploadError = [];
    } else {
      this.imageUploadError.push({
        error: 'No puedes subir más de 6 imágenes en total.'
      });
      return;
    }

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

  updatePatient() {
    this.errorMessage = '';
    this.imageUploadError = [];

    // Marcar todos los controles como tocados
    Object.values(this.patientForm.controls).forEach(control => {
      control.markAsTouched();
    });

    // Validación de imágenes
    if (this.tempImages.length < 3) {
      this.imageUploadError.push({
        error: `Debes subir por lo menos 3 imágenes.`
      });
    }

    if (this.patientForm.valid && this.tempImages.length >= 3 && this.tempImages.length <= 6) {
      const formData = new FormData();

      // Crear el valor combinado para el campo "hair"
      const hairLength = this.patientForm.get('hairLength')?.value || '';
      const hairType = this.patientForm.get('hairType')?.value || '';
      let hairColor = this.patientForm.get('hairColor')?.value || '';

      if (hairColor === 'otro') {
        hairColor = this.patientForm.get('customHairColor')?.value.toLowerCase() || '';
      }

      // Construir el campo "hair" dinámicamente, evitando comas innecesarias
      let hair = '';
      if (hairLength) {
        hair = hairLength;
      }
      if (hairType) {
        hair = hair ? `${hair}, ${hairType}` : hairType;
      }
      if (hairColor) {
        hair = hair ? `${hair}, ${hairColor}` : hairColor;
      }

      // Añadir los campos del formulario al FormData
      Object.keys(this.patientForm.value).forEach(key => {
        if (key !== 'imageFiles' && key !== 'customHairColor' && key !== 'hairLength' && key !== 'hairType' && key !== 'hairColor') {
          formData.append(key, this.patientForm.value[key]);
        }
      });

      // Añadir el valor combinado de "hair" al FormData solo si tiene algún valor
      if (hair) {
        formData.append('hair', hair);
      }

      const imagePromises: Promise<void>[] = [];

      // Si estamos editando un paciente, añadir sus imágenes existentes al FormData
      if (this.patient.images) {
        this.patient.images.forEach((image: { imageUrl: string, image: string }) => {
          if (this.tempImages.includes(image.imageUrl)) {
            // Añadir imágenes existentes
            const promise = fetch(image.imageUrl)
              .then(res => res.blob())
              .then(blob => {
                if (this.allowedFormats.includes(blob.type)) {
                  const extension = this.getExtensionFromMimeType(blob.type);
                  formData.append('imageFile', blob, `${image.image}.${extension}`);
                } else {
                  this.imageUploadError.push({
                    error: `La imagen ${image.image} tiene un formato no permitido: ${blob.type}. Solo se permiten JPG, PNG, JPEG, WEBP y HEIF.`
                  });
                }
              });
            imagePromises.push(promise);
          }
        });
      }

      // Agregar las nuevas imágenes (si las hay)
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
                  error: `La imagen ${index} tiene un formato no permitido: ${blob.type}. Solo se permiten JPG, PNG, JPEG, WEBP y HEIF.`
                });
              }
            });
          imagePromises.push(promise);
        }
      });

      // Esperamos a que todas las imágenes se hayan procesado
      Promise.all(imagePromises).then(() => {
        if (this.patient.id) {
          this._patientService.updatePatient(this.patient.id, formData).subscribe({
            next: () => {
              this._toastService.showToast('Paciente actualizado', 'Los datos del paciente se han actualizado correctamente.', 'success');
              this.isFormModified = false;
              this.errorMessage = null;
            },
            error: (error) => {
              console.error('Error al actualizar paciente:', error);
              this._toastService.showToast('Error al actualizar paciente', 'Ha ocurrido un error al actualizar los datos del paciente.', 'error');
              this.errorMessage = 'Error al actualizar los datos del paciente.';
            }
          });
        } else {
          this._toastService.showToast('Error', 'No se encontró el paciente para actualizar.', 'error');
          this.errorMessage = 'No se encontró el paciente para actualizar.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }

  deletePatient(id: number) {
    this._patientService.deletePatient(id).subscribe(
      () => {
        console.log('Paciente eliminado con éxito');
        this._toastService.showToast('Paciente eliminado',
          'El paciente ha sido eliminado correctamente.',
          'success');
        this._router.navigate(['/dashboard/patients'])
      },
      error => {
        console.error('Error al eliminar el paciente:', error);
        this._toastService.showToast('Error al eliminar paciente',
          'Ha ocurrido un error al eliminar el paciente.',
          'error');
      }
    );
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