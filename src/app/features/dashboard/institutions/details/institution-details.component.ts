import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Institution } from '../../../../core/models/institution.model';
import { InstitutionService } from '../../../../core/services/institution.service';
import { ToastService } from '../../../../core/services/util/toast.service';

@Component({
  selector: 'app-institution-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './institution-details.component.html'
})
export class InstitutionDetailsComponent {

  institutionForm: FormGroup;
  isFormModified = false;
  errorMessage: string = '';
  loading = false;
  isImagesChanges: boolean = false;
  tempImages: string[] = [];
  selectedImages: number[] = [];
  imageUploadError: { error: string }[] = [];
  allowedFormats = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp', 'image/webp', 'image/tiff', 'image/heif'];
  maxSizeInMB = 5;
  institution!: Institution;
  readonly institutionTypes: string[] = [
    'hospital general',
    'centro salud',
    'centro atencion primaria',
    'centro atencion urgencias',
    'hospital pediatrico',
    'hospital geriatrico',
    'centro rehabilitacion',
    'centro salud mental',
    'otro'
  ];

  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _institutionService = inject(InstitutionService);
  private _toastService = inject(ToastService);
  private _fb = inject(FormBuilder);

  constructor() {
    this.institutionForm = this._fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      type: ['', Validators.required],
      otherType: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(50)]],
      verificationKey: ['', [Validators.required, Validators.maxLength(25)]],
      direction: this._fb.group({
        state: ['', Validators.required],
        city: ['', [Validators.required, Validators.maxLength(25)]],
        postalCode: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(5), Validators.minLength(5)]],
        neighborhood: ['', [Validators.required, Validators.maxLength(25)]],
        street: ['', [Validators.required, Validators.maxLength(25)]],
        number: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(5)]],
      }),
      openingHours: ['', [Validators.required, Validators.maxLength(100)],],
      phoneNumbers: this._fb.array([
        this._fb.control('', [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$')
        ])
      ]),
      emails: this._fb.array([
        this._fb.control('', [
          Validators.maxLength(50),
          Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
        ])
      ]),
      imageFiles: this._fb.array([], Validators.required)
    });
    // Lógica para mostrar otro input si se selecciona "otro"
    this.institutionForm.get('type')?.valueChanges.subscribe(value => {
      const otherType = this.institutionForm.get('otherType');
      if (value === 'otro') {
        otherType?.setValidators([Validators.required, Validators.maxLength(50)]);
        otherType?.enable();
      } else {
        otherType?.clearValidators();
        otherType?.disable();
        otherType?.setValue('');
      }
      otherType?.updateValueAndValidity();
    });

    this.institutionForm.valueChanges.subscribe(() => {
      this.isFormModified = this.institutionForm.dirty;
    });
  }

  ngOnInit(): void {
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.loadInstitution(+id);
    }
  }

  loadInstitution(id: number): void {
    this._institutionService.getInstitution(id).subscribe(
      (institution: Institution) => {
        this.institution = institution;

        this.tempImages = institution.imageUrl ? [institution.imageUrl] : [];

        const phoneNumbers = institution.phoneNumbers ? institution.phoneNumbers.split(',') : [];
        const emails = institution.emails ? institution.emails.split(',') : [];

        if (!this.institutionTypes.includes(institution.type.toLowerCase())) {
          this.institutionForm.patchValue({
            type: 'otro',
            otherType: this.capitalizeFirstLetter(institution.type)
          });
          this.institutionForm.get('otherType')?.enable();
        } else {
          this.institutionForm.patchValue({
            type: institution.type,
            otherType: ''
          });
          this.institutionForm.get('otherType')?.disable();
        }

        this.institutionForm.patchValue({
          name: institution.name,
          direction: {
            state: institution.direction.state,
            city: institution.direction.city,
            postalCode: institution.direction.postalCode,
            neighborhood: institution.direction.neighborhood,
            street: institution.direction.street,
            number: institution.direction.number,
          },
          openingHours: institution.openingHours,
          verificationKey: institution.verificationKey,
        });

        // Actualizar números de teléfono
        const phoneNumbersArray = this.getFormArray('phoneNumbers');
        phoneNumbers.forEach((phone, index) => {
          if (index === 0 && phoneNumbersArray.length > 0) {
            // Si hay un campo existente, asignar el primer valor
            phoneNumbersArray.at(0).setValue(phone.trim());
          } else {
            // Agregar nuevos campos para valores adicionales
            this.addOrRemoveField('phoneNumbers');
            phoneNumbersArray.at(phoneNumbersArray.length - 1).setValue(phone.trim());
          }
        });

        // Actualizar correos electrónicos
        const emailsArray = this.getFormArray('emails');
        emails.forEach((email, index) => {
          if (index === 0 && emailsArray.length > 0) {
            emailsArray.at(0).setValue(email.trim());
          } else {
            this.addOrRemoveField('emails');
            emailsArray.at(emailsArray.length - 1).setValue(email.trim());
          }
        });

        const imageFilesArray = this.institutionForm.get('imageFiles') as FormArray;
        imageFilesArray.clear();

        if (institution.imageUrl) {
          imageFilesArray.push(this._fb.control(institution.imageUrl));
        }
      }
    );
  }

  private formatFormArrayValues(values: any[]): string {
    if (Array.isArray(values)) {
      // Convertir los valores del array en una cadena separada por comas con espacio
      return values.filter(val => val).join(', ').trim(); // Si hay valores vacíos, los elimina
    }
    return '';
  }

  private capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
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

  onFilesDropped(files: FileList) {
    const maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;
    const newImageFiles = Array.from(files);
    const totalFiles = this.tempImages.length + newImageFiles.length;

    if (totalFiles <= 1) {
      this.imageUploadError = [];
    } else {
      this.imageUploadError.push({
        error: 'No puedes subir más de 1 imagen en total.'
      });
      return;
    }

    const imageFilesArray = this.institutionForm.get('imageFiles') as FormArray;

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
          imageFilesArray.push(this._fb.control(reader.result)); // Añadir al FormArray
          this.isFormModified = true;
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

    if (totalFiles <= 1) {
      this.imageUploadError = [];
    } else {
      this.imageUploadError.push({
        error: 'No puedes subir más de 1 imagen.'
      });
      input.value = '';
      return;
    }

    const imageFilesArray = this.institutionForm.get('imageFiles') as FormArray;

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

  removeImage(index: number) {
    this.tempImages.splice(index, 1);
    this.selectedImages = this.selectedImages.filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));
    this.isFormModified = true;
  }

  triggerFileInput() {
    const fileInput = document.getElementById('institutionImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
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
        return null;
    }
  }

  // Método para obtener un FormArray
  getFormArray(arrayName: string): FormArray {
    return this.institutionForm.get(arrayName) as FormArray;
  }

  // Método para agregar o eliminar un control en un FormArray
  addOrRemoveField(arrayName: 'phoneNumbers' | 'emails', remove: boolean = false, index?: number) {
    const formArray = this.getFormArray(arrayName);
    const fieldValidators = {
      phoneNumbers: [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^[0-9]*$')
      ],
      emails: [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
      ]
    };


    // Si el campo no debe eliminarse, se agrega el control
    if (!remove) {
      if (formArray.length < 5) { // Limitar a 5 elementos por FormArray
        formArray.push(this._fb.control('', fieldValidators[arrayName]));
      }
    } else if (remove && index !== undefined) {
      if (formArray.length > 1) { // Evitar que se elimine si es el único campo
        formArray.removeAt(index);
        this.isFormModified = true;
      }
    }
  }

  updateInstitution() {
    this.errorMessage = '';
    this.imageUploadError = [];

    // Marcar todos los controles como tocados
    Object.values(this.institutionForm.controls).forEach(control => {
      if (control instanceof FormGroup) {
        // Si el control es un FormGroup (como el grupo de dirección), marca sus controles también
        Object.values(control.controls).forEach(subControl => subControl.markAsTouched());
      } else if (control instanceof FormArray) {
        // Si el control es un FormArray (como los teléfonos, correos y sitios web), marca sus controles también
        control.controls.forEach(subControl => subControl.markAsTouched());
      } else {
        control.markAsTouched();
      }
    });

    // Validación de imágenes
    if (this.tempImages.length < 1) {
      this.imageUploadError.push({
        error: `Debe subir al menos 1 imagen.`
      });
    }

    if (this.institutionForm.valid && this.tempImages.length === 1) {
      const formData = new FormData();
      const formValue = this.institutionForm.value;

      let type = this.institutionForm.get('type')?.value || '';

      // Si el color de cabello es "otro", usar el valor de customHairColor
      if (type === 'otro') {
        type = this.institutionForm.get('otherType')?.value || '';
      }

      // Formatear los valores de los campos "phoneNumbers" y "emails"
      const formattedPhoneNumbers = this.formatFormArrayValues(formValue.phoneNumbers);
      const formattedEmails = this.formatFormArrayValues(formValue.emails);

      // Añadir los campos del formulario al FormData
      Object.keys(this.institutionForm.value).forEach(key => {
        if (key !== 'imageFiles' && key !== 'otherType' && key !== 'phoneNumbers' && key !== 'emails') {
          formData.append(key, this.institutionForm.value[key]);
        }
      });

      // Agregar los campos de teléfono, correo electrónico y sitio web formateados
      formData.append('phoneNumbers', formattedPhoneNumbers);
      formData.append('emails', formattedEmails);

      // Agregar campos de dirección correctamente
      const direction = formValue.direction;
      formData.append('state', direction.state);
      formData.append('city', direction.city);
      formData.append('postalCode', direction.postalCode);
      formData.append('neighborhood', direction.neighborhood);
      formData.append('street', direction.street);
      formData.append('number', direction.number);

      const imagePromises: Promise<void>[] = [];

      if (this.institution.image) {
        const imageUrl = this.institution.imageUrl;
        const imageName = this.institution.image;
        if (this.tempImages.includes(imageUrl)) {
          // Añadir imagen existente
          const promise = fetch(imageUrl)
            .then(res => res.blob())
            .then(blob => {
              if (this.allowedFormats.includes(blob.type)) {
                const extension = this.getExtensionFromMimeType(blob.type);
                formData.append('imageFile', blob, `${imageName}.${extension}`);
              } else {
                this.imageUploadError.push({
                  error: `La imagen ${imageUrl} tiene un formato no permitido: ${blob.type}. Solo se permiten JPG, PNG, JPEG, WEBP y HEIF.`
                });
              }
            });
          imagePromises.push(promise);
        }
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
        if (this.institution.id) {
          this._institutionService.updateInstitution(this.institution.id, formData).subscribe({
            next: () => {
              this._toastService.showToast('Institución actualizada', 'Los datos de la institución se han actualizado correctamente.', 'success');
              this.isFormModified = false;
              this.errorMessage = "";
            },
            error: (error) => {
              console.error('Error al actualizar institución:', error);
              this._toastService.showToast('Error al actualizar institución', 'Ha ocurrido un error al actualizar los datos de la institución.', 'error');
              this.errorMessage = 'Error al actualizar los datos de la institución.';
            }
          });
        } else {
          this._toastService.showToast('Error', 'No se encontró la institución para actualizar.', 'error');
          this.errorMessage = 'No se encontró la institución para actualizar.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
    }
  }

  deleteInstitution(id: number) {
    this._institutionService.deleteInstitution(id).subscribe(
      () => {
        console.log('Institución eliminada con éxito');
        this._toastService.showToast('Institución eliminada',
          'La institución ha sido eliminada correctamente.',
          'success');
        this._router.navigate(['/dashboard/institutions'])
      },
      error => {
        console.error('Error al eliminar la institución:', error);
        this._toastService.showToast('Error al eliminar la institución',
          'Ha ocurrido un error al eliminar la institución.',
          'error');
      }
    );
  }
}
