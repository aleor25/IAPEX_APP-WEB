import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Institution } from '../../../../core/models/institution/institution.model';
import { FormatDateTimePipe } from '../../../../shared/pipes/format-date-time.pipe';
import { InstitutionService } from '../../../../core/services/institution.service';

@Component({
  selector: 'app-institution-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormatDateTimePipe],
  templateUrl: './institution-details.component.html'
})
export class InstitutionDetailsComponent {
  // ========== Propiedades ==========
  selectedInstitution!: Institution;
  institutionForm!: FormGroup;
  isFormModified = false;
  isSubmitting = false;
  errorMessage: string = '';
  selectedFile: File | null = null;

  private _route = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _institutionService = inject(InstitutionService);
  private _fb = inject(FormBuilder);

  // ========== Constructor & Inicialización ==========
  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.getInstitutionById(+id);
    }
  }

  // ========== Gestión del Formulario ==========
  private initializeForm(): void {
    this.institutionForm = this._fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['', Validators.required],
      direction: this._fb.group({
        state: ['', [Validators.required, Validators.minLength(2)]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        postalCode: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{5}$')],
        ],
        neighborhood: ['', [Validators.required, Validators.minLength(2)]],
        street: ['', [Validators.required, Validators.minLength(2)]],
        number: ['', [Validators.required]],
      }),
      openingHours: ['', Validators.required],
      emails: [
        '',
        [
          Validators.required,
          Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
        ],
      ],
      phoneNumbers: [
        '',
        [Validators.required, Validators.pattern('^[0-9\\s,]+$')],
      ],
      websites: [''],
      mapUrl: [''],
      verificationKey: ['', Validators.required],
      active: [''],
      imageFile: [null],
    });

    this.institutionForm.valueChanges.subscribe(() => {
      this.isFormModified = this.institutionForm.dirty;
    });
  }

  private patchFormValues(institution: Institution): void {
    this.institutionForm.patchValue({
      name: institution.name,
      type: institution.type,
      direction: {
        state: institution.direction.state,
        city: institution.direction.city,
        postalCode: institution.direction.postalCode,
        neighborhood: institution.direction.neighborhood,
        street: institution.direction.street,
        number: institution.direction.number,
      },
      openingHours: institution.openingHours,
      emails: institution.emails,
      phoneNumbers: institution.phoneNumbers,
      websites: institution.websites,
      verificationKey: institution.verificationKey,
      active: institution.active,
    });
    this.institutionForm.markAsPristine();
  }

  // ========== Ayudantes de Validación del Formulario ==========
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
      control.markAsTouched();
    });
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.institutionForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  hasDirectionError(controlName: string, errorType: string): boolean {
    const control = this.institutionForm.get('direction')?.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  // ========== Gestión de Archivos ==========
  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Por favor seleccione un archivo de imagen válido';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'La imagen no debe exceder 5MB';
        return;
      }

      this.selectedFile = file;
      this.isFormModified = true;
    }
  }

  // ========== Operaciones de API ==========
  getInstitutionById(id: number): void {
    this._institutionService
      .getInstitution(id)
      .pipe(
        catchError((error) => {
          console.error('Error loading institution:', error);
          this.errorMessage = 'Error al cargar los detalles de la institución';
          return of(null);
        })
      )
      .subscribe((institution: Institution | null) => {
        if (institution) {
          this.selectedInstitution = institution;
          this.patchFormValues(institution);
        }
      });
  }

  updateInstitutionById() {
    if (
      !this.institutionForm.valid ||
      !this.selectedInstitution ||
      this.isSubmitting
    ) {
      this.markFormGroupTouched(this.institutionForm);
      this.errorMessage =
        'Por favor corrija los errores del formulario antes de enviar.';
      return;
    }

    // Validar campos de dirección
    const direction = this.institutionForm.get('direction')?.value;
    if (
      !direction.city?.trim() ||
      !direction.state?.trim() ||
      !direction.postalCode?.trim() ||
      !direction.neighborhood?.trim() ||
      !direction.street?.trim() ||
      !direction.number?.trim()
    ) {
      this.errorMessage = 'Todos los campos de dirección son requeridos';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = this.prepareFormData();

    this._institutionService
      .updateInstitution(this.selectedInstitution.id, formData)
      .pipe(
        catchError((error) => {
          console.error('Error updating institution:', error);
          this.errorMessage =
            'Error al actualizar la institución. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log('Institución actualizada exitosamente');
          this._route.navigate(['/dashboard/institutions']);
        }
      });
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const formValue = this.institutionForm.value;

    // Añadir campos del formulario a FormData
    Object.keys(formValue).forEach((key) => {
      if (key !== 'direction' && key !== 'imageFile') {
        formData.append(key, formValue[key]);
      }
    });

    // Añadir campos de dirección
    Object.keys(formValue.direction).forEach((key) => {
      formData.append(key, formValue.direction[key]);
    });

    // Manejar imagen
    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile);
    } else if (this.selectedInstitution) {
      if (this.selectedInstitution.image) {
        formData.append('image', this.selectedInstitution.image);
      }
      if (this.selectedInstitution.imageUrl) {
        formData.append('imageUrl', this.selectedInstitution.imageUrl);
      }
    }

    return formData;
  }

  deleteInstitutionById(id: number) {
    if (confirm('¿Está seguro que desea eliminar esta institución?')) {
      this._institutionService
        .deleteInstitution(id)
        .pipe(
          catchError((error) => {
            console.error('Error deleting institution:', error);
            this.errorMessage = 'Error al eliminar la institución';
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response !== null) {
            console.log('Institución eliminada exitosamente');
            this._route.navigate(['/dashboard/institutions']);
          }
        });
    }
  }

  // ========== Navegación ==========
  navigateToDashboard() {
    if (this.isFormModified) {
      if (confirm('Tiene cambios sin guardar. ¿Está seguro que desea salir?')) {
        this._route.navigate(['/dashboard/institutions']);
      }
    } else {
      this._route.navigate(['/dashboard/institutions']);
    }
  }
}
