import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { MembershipService } from '../../../../core/services/membership.service';
import { Membership } from '../../../../core/models/membership.model';
import { InstitutionService } from '../../../../core/services/institution.service';

@Component({
  selector: 'app-membership-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './membership-details.component.html'
})
export class MembershipDetailsComponent {
  selectedMembership!: Membership;
  membershipForm!: FormGroup;
  isFormModified = false;
  isSubmitting = false;
  errorMessage: string = '';
  institutionNames: string[] = [];

  private _route = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _membershipsService = inject(MembershipService);
  private _institutionsService = inject(InstitutionService);
  private _fb = inject(FormBuilder);

  // ========== Constructor & Inicialización ==========
  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    const id = this._activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.getMembershipById(+id);
    }
    this.loadInstitutionNames(); // Cargar nombres de instituciones al inicializar
  }

  private loadInstitutionNames(): void {
    this._institutionsService.getAllInstitutionNames().subscribe({
      next: (names) => {
        this.institutionNames = names;
      },
      error: (err) => {
        console.error('Error al obtener los nombres de las instituciones:', err);
      },
    });
  }

  // ========== Gestión del Formulario ==========
  private initializeForm(): void {
    this.membershipForm = this._fb.group({
      institutionName: ['', [Validators.required, Validators.maxLength(100)]],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.membershipForm.valueChanges.subscribe(() => {
      this.isFormModified = this.membershipForm.dirty;
    });
  }

  private patchFormValues(membership: Membership): void {
    this.membershipForm.patchValue({
      institutionName: membership.institutionName,
      status: membership.status,
      startDate: new Date(membership.startDate).toISOString().split('T')[0], // Formato YYYY-MM-DD
      endDate: new Date(membership.endDate).toISOString().split('T')[0], // Formato YYYY-MM-DD
    });
    this.membershipForm.markAsPristine();
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
    const control = this.membershipForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  // ========== Operaciones de API ==========

  private getMembershipById(id: number): void {
    this._membershipsService
      .getMembership(id)
      .pipe(
        catchError((error) => {
          console.error('Error al cargar los detalles de la membresía:', error);
          this.errorMessage = 'Error al cargar los detalles de la membresía';
          return of(null);
        })
      )
      .subscribe((membership: Membership | null) => {
        if (membership) {
          this.selectedMembership = membership;
          this.patchFormValues(membership);
        }
      });
  }

  updateMembershipById() {
    if (
      !this.membershipForm.valid ||
      !this.selectedMembership ||
      this.isSubmitting
    ) {
      this.markFormGroupTouched(this.membershipForm);
      this.errorMessage =
        'Por favor corrija los errores del formulario antes de enviar.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const updatedMembership: Membership = {
      ...this.selectedMembership,
      ...this.membershipForm.value,
      startDate: new Date(this.membershipForm.value.startDate).toISOString(),
      endDate: new Date(this.membershipForm.value.endDate).toISOString(),
    };

    this._membershipsService
      .updateMembership(this.selectedMembership.id, updatedMembership)
      .pipe(
        catchError((error) => {
          console.error('Error updating membership:', error);
          this.errorMessage =
            'Error al actualizar la membresía. Por favor intente nuevamente.';
          return of(null);
        }),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log('Membresía actualizada exitosamente');
          this._route.navigate(['/dashboard/memberships']);
        }
      });
  }

  deleteMembershipById(id: number): void {
    if (confirm('¿Está seguro que desea eliminar esta membresía?')) {
      this._membershipsService
        .deleteMembership(id)
        .pipe(
          catchError((error) => {
            console.error('Error deleting membership:', error);
            this.errorMessage = 'Error al eliminar la membresía';
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response !== null) {
            console.log('Membresía eliminada exitosamente');
            this._route.navigate(['/dashboard/memberships']);
          }
        });
    }
  }

  // Navegación al dashboard
  navigateToDashboard(): void {
    if (this.isFormModified) {
      if (confirm('Tiene cambios sin guardar. ¿Está seguro que desea salir?')) {
        this._route.navigate(['/dashboard/memberships']);
      }
    } else {
      this._route.navigate(['/dashboard/memberships']);
    }
  }
}